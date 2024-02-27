import { message } from "telegraf/filters";

import { createWriteStream } from "node:fs";
import { Writable } from "node:stream";
import { Telegraf } from "telegraf";
import { PhotoSize, Update } from "telegraf/typings/core/types/typegram";
import { mkdir } from "fs/promises";
import { IContext } from "./context";
import { join } from 'path';

export const useOn = (bot: Telegraf<IContext>) => {
    bot.hears('hi', (ctx) => {
        const user = ctx.from;
        ctx.reply(`Hello ${user.first_name}!`);
    });


    bot.on(message('sticker'), (ctx) => ctx.reply('🖕'));

    const download = async (fromFileId: string, toPath: string) => {
        const link = await bot.telegram.getFileLink(fromFileId);
        console.log('[download]', link.toString());
        const res = await fetch(link.toString());
        await res.body?.pipeTo(Writable.toWeb(createWriteStream(toPath)));
    };

    bot.on(message("photo"), async ctx => {
        if (ctx.session.id === '') {
            ctx.reply('Inizia un nuovo processo con /init');
            return
        }
        const { file_id } = ctx.message.photo.pop() as PhotoSize;

        const id = ctx.session.id;
        ctx.session.lastIteraction = new Date().toISOString();
        const dirPath = `./photos/${id}`;
        const _path = join(dirPath, `${file_id}.jpg`);
        try { await mkdir(dirPath, { recursive: true }); } catch (e) { console.error(e) }
        await download(file_id, _path)

        console.log("Downloaded", _path);
    });

    bot.on(message("document"), async ctx => {
        if (ctx.session.id === '') {
            ctx.reply('Inizia un nuovo processo con /init');
            return
        }
        const { file_id, file_name } = ctx.message.document;
        ctx.session.lastIteraction = new Date().toISOString();
        const id = ctx.session.id;
        const dirPath = `./photos/${id}`;
        const _path = join(dirPath, `${file_name}`);
        try { await mkdir(dirPath, { recursive: true }); } catch (e) { console.error(e) }
        await download(file_id, _path);

        console.log("Downloaded", _path);
    });

}
