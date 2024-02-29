import { Markup, Telegraf } from "telegraf";

import { IContext } from "./context";
import { Client } from "pg";

export const useCommand = (bot: Telegraf<IContext>, db: Client) => {
    bot.start((ctx) => {
        ctx.reply('Benvenuto! ' + ctx.from.first_name);
        db.query('SELECT * FROM telegram_users WHERE user_id = $1', [ctx.from.id], (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            if (res.rows.length === 0) {
                db.query('INSERT INTO telegram_users (user_id, first_name, username, language_code, type) VALUES ($1, $2, $3, $4, $5)', [ctx.from.id, ctx.from.first_name, ctx.from.username, ctx.from.language_code, ctx.chat.type], (err, res) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('User added');
                })
            }
        })
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
