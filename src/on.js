const { message } = require("telegraf/filters");

const { createWriteStream } = require("node:fs");
const { Writable } = require("node:stream");

const useOn = (bot) => {
    bot.hears('hi', (ctx) => ctx.reply('Hey there'));
    bot.on(message('sticker'), (ctx) => ctx.reply('🖕'));

    const download = async (fromFileId, toPath) => {
        const link = await bot.telegram.getFileLink(fromFileId);
        console.log(link.toString());
        const res = await fetch(link.toString());
        await res.body.pipeTo(Writable.toWeb(createWriteStream(toPath)));
    };

    bot.on(message("photo"), async ctx => {
        // take the last photosize (highest size)
        debugger;
        const { file_id } = ctx.message.photo.pop();
        const path = `./photos/${file_id}.jpg`;
        await download(file_id, path);
        console.log("Downloaded", path);
    });

    bot.on(message("document"), async ctx => {
        const { file_id, file_name } = ctx.message.document;
        const path = `./photos/${file_name}`;

        await download(file_id, path);

        console.log("Downloaded", path);
    });
}

module.exports = {
    useOn
}