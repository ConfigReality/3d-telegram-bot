import { Markup, Telegraf } from "telegraf";

import { IContext } from "./context";
import { supabase } from "./lib/supabase";

export const useCommand = (bot: Telegraf<IContext>) => {
    bot.start(async (ctx) => {
        ctx.reply('Benvenuto! ' + ctx.from.first_name);
        // insert user in db if not exists
        const {data, count, error} = await supabase.from('telegram_user')
            .select('id', { count: 'exact' })
            .eq('user_id', ctx.from.id)
            .single()

        console.log({data, count, error})
        if(error) return console.log(error)
        if(count === 0){
            const {data: dataInsert, error: errorInsert} = await supabase.from('telegram_user')
                .insert({
                    user_id: ctx.from.id,
                    first_name: ctx.from.first_name,
                    username: ctx.from.username,
                    language_code: ctx.from.language_code,
                    type: ctx.chat.type
                }).select('id').single()

            console.log({dataInsert, errorInsert})
            if(dataInsert) ctx.session.user_id = dataInsert.id
        } else {
            if(data) ctx.session.user_id = data.id
        }
    });
    
    bot.help((ctx) => ctx.reply('Try /wizard to create a 3d wizard'));

    bot.command('me', (ctx) => {
        ctx.reply(`${JSON.stringify({ ...ctx.from, ...ctx.chat }, null, 2)}`);
    })

    bot.command('chat', (ctx) => {
        ctx.reply(`${JSON.stringify({ ...ctx.chat }, null, 2)}`);
    })
    bot.command('message', (ctx) => {
        ctx.reply(`${JSON.stringify({ ...ctx.message }, null, 2)}`);
    })

    bot.command('quit', async (ctx) => {
        // Explicit usage
        await ctx.telegram.leaveChat(ctx.message.chat.id)
        // Using context shortcut
        await ctx.leaveChat()
    })

    bot.command('docs', (ctx) => {
        ctx.reply(
            `Hi! ${ctx.from.first_name} 👋 \n \n Shall we start? 👇 `,
            Markup.inlineKeyboard(
                [
                    Markup.button.url(
                        "Telegraf 🤖",
                        "https://telegraf.js.org/"
                    ),
                    Markup.button.url(
                        "salvatorelaspata.net 🌎", 
                        "https://salvatorelaspata.net"
                    ),
                ],
                { columns: 2 }
            )
        );
    })

}
