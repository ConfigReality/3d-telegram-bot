import { Telegraf } from 'telegraf';
import { mkdir } from 'fs/promises';
import { useCommand } from './src/command';
import { useOn } from './src/on';
import { useWizard } from './src/wizard';
import { IContext } from './src/context';

require('dotenv').config();

mkdir("./photos", { recursive: true }).then(console.log).catch(console.error);

if (process.env.BOT_TOKEN === undefined) {
	throw new TypeError("BOT_TOKEN must be provided!");
}

const bot = new Telegraf<IContext>(process.env.BOT_TOKEN);
// bot.on(message('text'), (ctx) => ctx.reply('👍'));
useCommand(bot);
useOn(bot);
useWizard(bot);
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
