import { v4 as uuidv4 } from "uuid";
import { Telegraf } from "telegraf";
import { IContext } from "./context";
import { supabase } from "./lib/supabase";
import { sendToQueue } from "./lib/queue";
import { Database } from "./types/supabase";
import { init } from "./texts/init";
import { exit } from "./texts/exit";
import { processing } from "./texts/processing";
import { reprocessing } from "./texts/reprocessing";

export const useProcessing = (bot: Telegraf<IContext>) => {
    /* LIST */
    bot.command("list", async (ctx) => {
        await ctx.reply('In lavorazione');
    });
    /* INIT */
    bot.command("init", async (ctx) => {
        if (ctx.session.id) return await ctx.reply(exit(ctx.session.id));
        
        await ctx.reply(init); // text
        
        ctx.session.id = uuidv4();
        ctx.session.processing = true;
        console.log(`User ID: ${ctx.session.user_id}`)
        const {data, error} = await supabase.from('Project').insert({
            telegram_user: ctx.session.user_id,
            status: 'draft'
        }).select('id').single();
        console.log(`Project ->`, {error, data}, ctx.session.user_id)
        if (data) ctx.session.project_id = data.id;

        if(error) return await ctx.reply('Errore durante l\'inserimento del modello');
        
        await ctx.reply(`Incolla le foto da processare.`);
    });
    /* CANCEL */
    bot.command("cancel", async (ctx) => {
        if (!ctx.session.processing && !ctx.session.id) {
            await ctx.reply("Nessun processo in corso.");
            return
        }
        
        await ctx.reply(`Processo annullato., ${ctx.session.id}`);

        ctx.session.id = "";
        ctx.session.processing = false;
    });
    /* PROCESSING */
    bot.command("processing", async (ctx) => {
        if (!ctx.session.id) {
            await ctx.reply(`Per iniziare un nuovo processo, invia /init.`);
            return
        }

        await ctx.reply(processing(ctx.session.id)); // text

        const {data: d, error: e} = await supabase.from('Project')
            .select('id')
            .eq('id', ctx.session.project_id)
            .single();

        console.log(`Project ->`, {e, d})
            
        if(e || !d.id) {
            return await ctx.reply('Errore durante l\'inserimento del processo');
        }
        
        const {error, data} = await supabase.from('Process').insert({
            detail: ctx.session.processConfig.detail as Database['public']['Enums']['details'],
            order: ctx.session.processConfig.order as Database['public']['Enums']['orders'], 
            feature: ctx.session.processConfig.feature as Database['public']['Enums']['features'],
            project_id: d.id,
            user_id: ctx.session.id,
            status: 'open'
        }).select('id').single();

        console.log(`Process ->`, {error, data})

        if(error || !data.id) {
            await ctx.reply('Errore durante l\'inserimento del processo');
        }


        try {
            if(data) sendToQueue(data.id);
        } catch (error) {
            console.log(error);
        }

        await supabase.from('Project').update({status: 'queued'}).eq('id', d.id);

        ctx.session.processing = false;
        ctx.session.id = "";
    });
    /* REPROCESSING */
    bot.command('reprocessing', async (ctx) => {
        const {text} = ctx.message;
        const [_, id] = text.split(' ');
        if(!id) {
            await ctx.reply(reprocessing); // text
            return
        }
        
        await ctx.reply(`Riprovo il processo ${id}`);

        ctx.session.processing = false;
        ctx.session.id = "";
    });
};
