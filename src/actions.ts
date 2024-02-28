import { Composer, Telegraf } from "telegraf";
import { IContext } from "./context";

export const useActions = () => {
    const _currentConfig = async (ctx: IContext) => {
        await ctx.reply(`
Configurazione Attuale:
Dettaglio: ${ctx.session.processConfig.detail || 'default'}
Ordine: ${ctx.session.processConfig.order || 'default'}
Feature: ${ctx.session.processConfig.feature || 'default'}
        `,
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
    // detail
    stepHandler.action("🧐 preview", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.detail = 'preview'
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    stepHandler.action("🧐 reduced", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.detail = 'reduced'
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    stepHandler.action("🧐 medium", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.detail = 'medium'
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    stepHandler.action("🧐 full", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.detail = 'full'
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    stepHandler.action("🧐 raw", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.detail = 'raw'
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    // order
    stepHandler.action("👔 unordered", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.order = 'unordered'
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    stepHandler.action("👔 sequential", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.order = 'sequential'
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    // feature
    stepHandler.action("💎 normal", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.feature = 'normal'
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })
    stepHandler.action("💎 high", async (ctx) => {
        // if(ctx.session.processConfig.completeMessage) return;
        ctx.session.processConfig.feature = 'high'
        // await ctx.deleteMessage();
        // return ctx.wizard.next(); // uncomment if use wizard
    })

    return stepHandler;
}