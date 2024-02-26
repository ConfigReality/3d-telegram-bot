import { message } from "telegraf/filters";

import { createWriteStream } from "node:fs";
import { Writable } from "node:stream";
import { Telegraf } from "telegraf";
import { PhotoSize, Update } from "telegraf/typings/core/types/typegram";
import { IContext } from "./context";

export const useOn = (bot: Telegraf<IContext>) => {
    bot.hears('hi', (ctx) => {
        const user = ctx.from;
        ctx.reply(`Hello ${user.first_name}!`);
    });


    bot.on(message('sticker'), (ctx) => ctx.reply('🖕'));

    const download = async (fromFileId: string, toPath: string) => {
        const link = await bot.telegram.getFileLink(fromFileId);
        console.log('[download]',link.toString());
        const res = await fetch(link.toString());
        await res.body?.pipeTo(Writable.toWeb(createWriteStream(toPath)));
    };

    bot.on(message("photo"), async ctx => {
        console.log('[message("photo")] - context',ctx)
        const { file_id } = ctx.message.photo.pop() as PhotoSize ;
        const path = `./photos/${file_id}.jpg`;
        await download(file_id, path);
        console.log("Downloaded", path);
    });

    bot.on(message("document"), async ctx => {
        console.log('[message("document")] - context', ctx)
        const { file_id, file_name } = ctx.message.document;
        const path = `./photos/${file_name}`;

        await download(file_id, path);

        console.log("Downloaded", path);
    });

}
