// create wizard to create a new project
// 1. create a new project

import { Scenes, session, Markup, Telegraf, Context } from "telegraf";
import { v4 as uuidv4 } from 'uuid';
import { IContext } from "./context";

// 2. "-d","medium", // -d specifies the detail
const details = {
    preview: 'preview',
    reduced: 'reduced',
    medium: 'medium',
    full: 'full',
    raw: 'raw',
}

// 3. "-o","unordered", // -o specifies the sample ordering
const orders = {
    unordered: 'unordered',
    sequential: 'sequential',
}

// 4. "-f","normal" // -f specifies the feature sensitivity
const features = {
    normal: 'normal',
    high: 'high',
}
export const useWizard = (bot: Telegraf<IContext>) => {
    const wizard = new Scenes.WizardScene<IContext>(
        "wizard",
        async (ctx) => {
            const id: string = uuidv4()
            ctx.projectId = id
            ctx.reply(`[${id}] Welcome to the project creation wizard. Please select the detail level of the project`, Markup.keyboard([
                details.preview,
                details.reduced,
                details.medium,
                details.full,
                details.raw,
            ]).oneTime().resize())
            return ctx.wizard.next()
        },
        async (ctx) => {
            // check if the user has selected a detail level)
            // ctx.scene.session.wizardSessionProp.detail = ctx.message.text
            debugger;

            await ctx.reply('Please select the sample ordering.', Markup.keyboard([
                orders.unordered,
                orders.sequential,
            ]).oneTime().resize())
            return ctx.wizard.next()
        },
        async (ctx) => {
            
            // ctx.scene.session.wizardSessionProp.order = ctx.message.text
            await ctx.reply('Please select the feature sensitivity.', Markup.keyboard([
                features.normal,
                features.high,
            ]).oneTime().resize())
            Markup.removeKeyboard()
            return ctx.wizard.next()
        },
        async (ctx) => {
            // get photo from user
            // ctx.scene.session.wizardSessionProp.feature = ctx.message.text
            await ctx.reply('Please send a photo of the project.')
            return ctx.wizard.next()
        },
        async (ctx) => {
            // ctx.scene.session.wizardSessionProp.feature = ctx.message.text
            await ctx.reply(`[${ctx.projectId}] Project created with the following settings:
Detail:         ${ctx.scene.session.wizardSessionProp.detail}
Order:          ${ctx.scene.session.wizardSessionProp.order}
Feature:    ${ctx.scene.session.wizardSessionProp.feature}
            `)

            console.log(ctx.scene.session)
            
            return await ctx.scene.leave()  
        }
    );
    
    const stage = new Scenes.Stage<IContext>([wizard], {
        ttl: 10,
    });
    bot.use(session());
    bot.use(stage.middleware());
    bot.command("wizard", ctx => ctx.scene.enter("wizard"));

}

