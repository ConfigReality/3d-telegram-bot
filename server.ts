import { Telegraf, session } from 'telegraf';
import { mkdir } from 'fs/promises';
import { useCommand } from './src/command';
import { useOn } from './src/on';
// import { useWizard } from './src/wizard';
import { IContext } from './src/context';
import { useProcessing } from './src/lib/process';
import { useDb } from './src/lib/db';

require('dotenv').config();

mkdir("./photos", { recursive: true }).then(console.log).catch(console.error);

if (process.env.BOT_TOKEN === undefined) {
	throw new TypeError("BOT_TOKEN must be provided!");
}

const bot = new Telegraf<IContext>(process.env.BOT_TOKEN);
// bot.on(message('text'), (ctx) => ctx.reply('👍'));
useCommand(bot);
useDb().then((instance) => {;
	useOn(bot);
	useProcessing(bot, instance);
	// useWizard(bot);
	bot.use(session());
	bot.launch();

	process.once('SIGINT', () => bot.stop('SIGINT'));
	process.once('SIGTERM', () => bot.stop('SIGTERM'));
}).catch(console.error);