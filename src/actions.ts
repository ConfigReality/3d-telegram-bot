import { Composer, Telegraf } from "telegraf";
import { IContext } from "./context";

export const useActions = () => {
    const _currentConfig = async (ctx: IContext) => {
        await ctx.reply(`
<b>Configurazione Attuale</b>
Dettaglio:\n\t\t\t\t<i>${ctx.session.processConfig.detail || 'default'}</i>
Ordine:\n\t\t\t\t<i>${ctx.session.processConfig.order || 'default'}</i>
Feature:\n\t\t\t\t<i>${ctx.session.processConfig.feature || 'default'}</i>
        `, { parse_mode: 'HTML'}
                );
    }

    const _setDefaultConfig = (ctx: IContext) => {
        ctx.session.processConfig = {
            detail: "",
            detailMessage: 0,
            order: "",
            orderMessage: 0,
            feature: "",
            featureMessage: 0,
            completeMessage: 0,
            abortedMessage: 0,
            defaultMessage: 0,
            // isComplete: true
        }
    }

    const _deleteMessages = async (ctx: IContext) => {
        ctx.session.processConfig.detailMessage !== 0 && await ctx.deleteMessage(ctx.session.processConfig.detailMessage );
        ctx.session.processConfig.orderMessage !== 0 && await ctx.deleteMessage(ctx.session.processConfig.orderMessage );
        ctx.session.processConfig.featureMessage !== 0 && await ctx.deleteMessage(ctx.session.processConfig.featureMessage );
        ctx.session.processConfig.completeMessage !== 0 && await ctx.deleteMessage(ctx.session.processConfig.completeMessage );
        ctx.session.processConfig.abortedMessage !== 0 && await ctx.deleteMessage(ctx.session.processConfig.abortedMessage );
        ctx.session.processConfig.defaultMessage !== 0 && await ctx.deleteMessage(ctx.session.processConfig.defaultMessage);
    }
    const stepHandler = new Composer<IContext>();
    // stepHandler.action("next", async (ctx) => ctx.wizard.next()); // uncomment if use wizard
    stepHandler.action("done", async (ctx) => {
        // TODO: implement check if all config is set
        await _deleteMessages(ctx);
        await _currentConfig(ctx);
        // ctx.session.processConfig.isComplete = true;
        // return ctx.scene.leave(); // uncomment if use wizard
    });

    stepHandler.action("default", async (ctx) => {
        await _deleteMessages(ctx);
        _setDefaultConfig(ctx)
        // ctx.session.processConfig.isComplete = true;
        await _currentConfig(ctx);
        // trigger done action
        // return ctx.scene.leave(); // uncomment if use wizard
    });

    stepHandler.action("cancel", async (ctx) => {
        await _deleteMessages(ctx);
        _setDefaultConfig(ctx)
        
        await ctx.reply('Configurazione annullata! Verrà applicata la configurazione di default.');

        await _currentConfig(ctx);
        // ctx.session.processConfig.isComplete = true;
        // return ctx.scene.leave(); // uncomment if use wizard
    });
    const _reactOkMessage = async (ctx: IContext) => {
        await ctx.react('👍');;
    }
    // detail
    stepHandler.action("🧐 preview", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.detail = 'preview'
        _reactOkMessage(ctx)
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    stepHandler.action("🧐 reduced", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.detail = 'reduced'
        _reactOkMessage(ctx)
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    stepHandler.action("🧐 medium", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.detail = 'medium'
        _reactOkMessage(ctx)
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    stepHandler.action("🧐 full", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.detail = 'full'
        _reactOkMessage(ctx)
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    stepHandler.action("🧐 raw", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.detail = 'raw'
        _reactOkMessage(ctx)
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    // order
    stepHandler.action("👔 unordered", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.order = 'unordered'
        _reactOkMessage(ctx)
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    stepHandler.action("👔 sequential", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.order = 'sequential'
        _reactOkMessage(ctx)
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    // feature
    stepHandler.action("💎 normal", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.feature = 'normal'
        _reactOkMessage(ctx)
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    stepHandler.action("💎 high", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.feature = 'high'
        _reactOkMessage(ctx)
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })

    return stepHandler;
}