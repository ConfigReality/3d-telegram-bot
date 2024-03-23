import { Telegraf, session } from 'telegraf';
import { mkdir } from 'fs/promises';
import { useCommand } from './src/command';
import { useOn } from './src/on';
import { IContext } from './src/context';
import { useProcessing } from './src/process';
// import { useActions } from './src/actions';
// import { useWizard } from './src/wizard';
import { useConfig } from './src/config';

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
			detail: "preview",
			detailMessage: 0,
			order: "sequential",
			orderMessage: 0,
			feature: "normal",
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
			useCommand(bot);
			useOn(bot);
			useProcessing(bot);
			useConfig(bot);

			bot.launch().then(console.log).catch(console.error);

			process.once('SIGINT', async () => {
				console.log(('SIGINT'));
				bot.stop('SIGINT');
				setTimeout(() => {
					process.exit(1)
				}, 500);
			});
			process.once('SIGTERM', async () => {
				console.log(('SIGTERM'));
				bot.stop('SIGTERM');
				setTimeout(() => {
					process.exit(1)
				}, 500);
			});
			resolve('Bot started');

		} catch (error) {
			reject(error);
		}
	});
}

init().then(console.log).catch(console.error);