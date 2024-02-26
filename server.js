const { Telegraf, Markup } = require('telegraf');
const { mkdir } = require('fs/promises');
const { useCommand } = require('./src/command');
const { useOn } = require('./src/on');
const { useWizard } = require('./src/wizard');

require('dotenv').config();

// ensure photos directory exists
mkdir("./photos", { recursive: true }).then(console.log).catch(console.error);

const bot = new Telegraf(process.env.BOT_TOKEN);
// bot.on(message('text'), (ctx) => ctx.reply('👍'));
useCommand(bot);
useOn(bot);
useWizard(bot);
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
