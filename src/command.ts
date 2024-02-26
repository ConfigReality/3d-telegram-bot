import { Context, Markup, Telegraf } from "telegraf";

import { IContext } from "./context";

export const useCommand = (bot: Telegraf<IContext>) => {
    bot.start((ctx) => ctx.reply('Welcome!'));
    bot.help((ctx) => ctx.reply('Try /wizard to create a 3d wizard'));

    bot.command('me', (ctx) => {
        ctx.reply(`${JSON.stringify({ ...ctx.from, ...ctx.chat }, null, 2)}`);
    })

    bot.command('quit', async (ctx) => {
        // Explicit usage
        await ctx.telegram.leaveChat(ctx.message.chat.id)
        // Using context shortcut
        await ctx.leaveChat()
    })

    // bot.command('test', (ctx) => {
    //     console.log(ctx.message)
    //     ctx.reply('Hello World')
    // })
    // bot.command('hipster', Telegraf.reply('λ'))
    // bot.command('oldschool', (ctx) => ctx.reply('Hello'))
    // bot.command('keyboard', (ctx) => {
    //     Markup.keyboard(['1 - 👍', '2 - 👎']);
    //     ctx.reply('Keyboard', Markup.keyboard(['1 - 👍', '2 - 👎']).oneTime().resize());
    // })

    // /docs
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
