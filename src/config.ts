import { Markup, Telegraf } from "telegraf"
import { IContext } from "./context"
import { useActions } from "./actions";

export const useConfig = (bot: Telegraf<IContext>) => {
    bot.use(useActions().middleware());
    bot.command("config", async (ctx) => {
        // ctx.session.processConfig.isComplete = false;
        if(ctx.session.processing) {
            ctx.reply(`Processo ${ctx.session.id} già in corso.
Premere /cancel per annullare il processo e quindi proseguire al cambio di configurazione.`);
            return;
        }

        const d = await ctx.reply("Inserisci il dettaglio del modello:", Markup.inlineKeyboard([
            Markup.button.callback('🧐 preview', '🧐 preview'),
            Markup.button.callback('🧐 reduced', '🧐 reduced'),
            Markup.button.callback('🧐 medium', '🧐 medium'),
            Markup.button.callback('🧐 full', '🧐 full'),
            Markup.button.callback('🧐 raw', '🧐 raw'),
        ], { columns: 2 }));
        ctx.session.processConfig.detailMessage = d.message_id
        
        const o = await ctx.reply("Inserisci l'ordine del modello:", Markup.inlineKeyboard([
            Markup.button.callback('👔 unordered', '👔 unordered'),
            Markup.button.callback('👔 sequential', '👔 sequential')
        ]));
        ctx.session.processConfig.orderMessage = o.message_id
        
        const f = await ctx.reply("Inserisci la feature del modello:", Markup.inlineKeyboard([
            Markup.button.callback('💎 normal', '💎 normal'),
            Markup.button.callback('💎 high', '💎 high')
        ]));
        ctx.session.processConfig.featureMessage = f.message_id

        const done = await ctx.reply('Premi "Completa" per completare la configurazione', Markup.inlineKeyboard([Markup.button.callback('Completa', 'done')]));
        ctx.session.processConfig.completeMessage = done.message_id;

        const dd = await ctx.reply('[SCELTA CONSIGLIATA] Premi "Default" per impostare i parametri di default', Markup.inlineKeyboard([Markup.button.callback('Default', 'default')]));
        ctx.session.processConfig.defaultMessage = dd.message_id;

        const cancel = await ctx.reply('Premi "Annulla" per annullare la configurazione', Markup.inlineKeyboard([ Markup.button.callback('Annulla', 'cancel')]));
        ctx.session.processConfig.abortedMessage = cancel.message_id;
    })
}