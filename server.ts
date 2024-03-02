import { Telegraf, session } from 'telegraf';
import { mkdir } from 'fs/promises';
import { useCommand } from './src/command';
import { useOn } from './src/on';
import { IContext } from './src/context';
import { useProcessing } from './src/lib/process';
// import { useActions } from './src/actions';
// import { useWizard } from './src/wizard';
import { useConfig } from './src/config';
import { useDb } from './src/lib/db';
import { useQueue } from './src/lib/queue';

require('dotenv').config();

mkdir("./photos", { recursive: true }).catch(console.error);

if (process.env.BOT_TOKEN === undefined) {
	throw new TypeError("BOT_TOKEN must be provided!");
}

const bot = new Telegraf<IContext>(process.env.BOT_TOKEN);
const newDateString = new Date().toISOString();
bot.use(session({
	defaultSession: () => ({
		id: '',
		processing: false,
		lastIteraction: newDateString,
		processConfig: {
			detail: "default",
			detailMessage: 0,
			order: "default",
			orderMessage: 0,
			feature: "default",
			featureMessage: 0,
			completeMessage: 0,
			abortedMessage: 0,
			defaultMessage: 0,
			// isComplete: false
		}
	})
}));

const init = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const db = await useDb();
			const queue = useQueue();
			useCommand(bot, db);
			useOn(bot, db);
			// processing
			useProcessing(bot, db, queue);
			// config
			// useWizard(bot);
			useConfig(bot);

			bot.launch().then(console.log).catch(console.error);

			process.once('SIGINT', async () => {
				console.log(('SIGINT'));
				bot.stop('SIGINT');
				await db.end();
				queue?.destroy();
				process.exit(1)
			});

			process.once('SIGTERM', async () => {
				console.log(('SIGTERM'));
				bot.stop('SIGTERM');
				await db.end();
				queue?.destroy();
				process.exit(1)
			});
			resolve('Bot started');

		} catch (error) {
			reject(error);
		}
	});
}

init().then(console.log).catch(console.error);