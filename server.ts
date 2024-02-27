import { Telegraf, session } from 'telegraf';
import { mkdir } from 'fs/promises';
import { useCommand } from './src/command';
import { useOn } from './src/on';
import { IContext } from './src/context';
import { useProcessing } from './src/lib/process';

require('dotenv').config();

mkdir("./photos", { recursive: true }).then(console.log).catch(console.error);

if (process.env.BOT_TOKEN === undefined) {
	throw new TypeError("BOT_TOKEN must be provided!");
}

const bot = new Telegraf<IContext>(process.env.BOT_TOKEN);
const newDateString = new Date().toISOString();
bot.use(session({defaultSession: () => ({id: '', processing: false, lastIteraction: newDateString})}));

useCommand(bot);
useOn(bot);
useProcessing(bot);

bot.launch().then(console.log).catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));