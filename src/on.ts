import { message } from "telegraf/filters";

import { createWriteStream } from "node:fs";
import { Writable } from "node:stream";
import { Telegraf } from "telegraf";
import { PhotoSize, Update } from "telegraf/typings/core/types/typegram";
import { mkdir } from "fs/promises";
import { IContext } from "./context";
import { join } from 'path';
import { supabase } from "./lib/supabase";

const PERSISTENCE = false;

export const useOn = (bot: Telegraf<IContext>) => {
    bot.hears('hi', (ctx) => {
        const user = ctx.from;
        ctx.reply(`Hello ${user.first_name}!`);
    });

    bot.on(message('sticker'), (ctx) => ctx.reply('🖕'));

    const download = async (fromFileId: string, toPath: string, sessionId: string) => {
        const link = await bot.telegram.getFileLink(fromFileId);
        console.log('[download]', link.toString());
        
        // DB PERSISTENCE - Start
        try {
            const { data, error } = await supabase.from('Project').select('id, files')
                .eq('user_id', sessionId)
                .order('created_at', {ascending: false})
                .single()

            if (error) { console.error('Error', error); return; }

            const {error: e} = await supabase.rpc('append_array', {
                id: data?.id,
                new_element: link.toString()
            });

            if (e) { console.error('Error', e); return; }

        } catch (error) {
            console.log('Error', error)
        }

        if(!PERSISTENCE) return;
        const res = await fetch(link.toString());
        await res.body?.pipeTo(Writable.toWeb(createWriteStream(toPath)));
        console.log("Downloaded", link.toString());
    };

    bot.on(message("photo"), async ctx => {
        if (ctx.session.id === '') {
            ctx.reply('Inizia un nuovo processo con /init');
            return
        } 
        // else if(ctx.session.processing) {
        //     ctx.reply(`Processo ${ctx.session.id} già in corso.`);
        // }
        
        const { file_id } = ctx.message.photo.pop() as PhotoSize;

        const id = ctx.session.id;
        ctx.session.lastIteraction = new Date().toISOString();
        const dirPath = `./photos/${id}`;
        const _path = join(dirPath, `${file_id}.jpg`);
        if(PERSISTENCE) try { await mkdir(dirPath, { recursive: true }); } catch (e) { console.error(e) }
        await download(file_id, _path, id);
    });

    bot.on(message("document"), async ctx => {
        if (ctx.session.id === '') {
            ctx.reply('Inizia un nuovo processo con /init');
            return
        } 
        // else if(ctx.session.processing) {
        //     ctx.reply(`Processo ${ctx.session.id} già in corso.`);
        // }
        const { file_id, file_name } = ctx.message.document;
        ctx.session.lastIteraction = new Date().toISOString();
        const id = ctx.session.id;
        const dirPath = `./photos/${id}`;
        const _path = join(dirPath, `${file_name}`);
        if(PERSISTENCE) try { await mkdir(dirPath, { recursive: true }); } catch (e) { console.error(e) }
        await download(file_id, _path, id);
    });

}
