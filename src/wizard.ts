// create wizard to create a new project
// 1. create a new project

import { Scenes, Markup, Telegraf, Composer } from "telegraf";
import { IContext } from "./context";
import { useActions } from "./actions";

export const useWizard = (bot: Telegraf<IContext>) => {
    const actions = useActions();
    const _wizard = new Scenes.WizardScene<IContext>("config",
        async (ctx) => {
            await ctx.reply(`
Benvenuto nel wizard di configurazione!
`
            );
            ctx.reply("Inserisci il dettaglio del modello:", Markup.inlineKeyboard([
                Markup.button.callback('🧐 preview', '🧐 preview'),
                Markup.button.callback('🧐 reduced', '🧐 reduced'),
                Markup.button.callback('🧐 medium', '🧐 medium'),
                Markup.button.callback('🧐 full', '🧐 full'),
                Markup.button.callback('🧐 raw', '🧐 raw'),
            ], { columns: 2 }));

            ctx.reply('Premi "Continua" per continuare', Markup.inlineKeyboard([Markup.button.callback('Continua', 'next')]));

            return ctx.wizard.next();
        },
        actions,
        async (ctx) => {
            ctx.reply("Inserisci l'ordine del modello:", Markup.inlineKeyboard([
                Markup.button.callback('👔 unordered', '👔 unordered'),
                Markup.button.callback('👔 sequential', '👔 sequential')
            ]));
            ctx.reply('Premi "Continua" per continuare', Markup.inlineKeyboard([Markup.button.callback('Continua', 'next')]));
            return ctx.wizard.next();
        },
        actions,
        async (ctx) => {
            await ctx.reply("Inserisci la feature del modello:", Markup.inlineKeyboard([
                Markup.button.callback('💎 normal', '💎 normal'),
                Markup.button.callback('💎 high', '💎 high')
            ]));
            ctx.reply('Premi "Continua" per continuare', Markup.inlineKeyboard([Markup.button.callback('Continua', 'next')]));
            return ctx.wizard.next();
        },
        actions,
        async (ctx) => {
            await ctx.reply(`
Configurazione completata!
Dettaglio: ${ctx.session.processConfig.detail}
Ordine: ${ctx.session.processConfig.order}
Feature: ${ctx.session.processConfig.feature}
`,
            Markup.removeKeyboard());
            return ctx.scene.leave();
        }
    );
    const stage = new Scenes.Stage([_wizard]);
    bot.use(stage.middleware());
    bot.command("config", (ctx) => ctx.scene.enter("config"));
}