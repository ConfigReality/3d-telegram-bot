// create wizard to create a new project
// 1. create a new project

const { Scenes, session, Markup } = require("telegraf");
const { v4 : uuidv4 } = require( 'uuid');

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
const useWizard = (bot) => {
    const wizard = new Scenes.WizardScene(
        "wizard",
        (ctx) => {
            const id = uuidv4()
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
            ctx.wizard.state.detail = ctx.message.text
            await ctx.reply('Please select the sample ordering.', Markup.keyboard([
                orders.unordered,
                orders.sequential,
            ]).oneTime().resize())
            return ctx.wizard.next()
        },
        async (ctx) => {
            ctx.wizard.state.order = ctx.message.text
            await ctx.reply('Please select the feature sensitivity.', Markup.keyboard([
                features.normal,
                features.high,
            ]).oneTime().resize())
            Markup.removeKeyboard()
            return ctx.wizard.next()
        },
        async (ctx) => {
            // get photo from user
            ctx.wizard.state.feature = ctx.message.text
            await ctx.reply('Please send a photo of the project.')
            return ctx.wizard.next()
        },
        async (ctx) => {

            ctx.wizard.state.feature = ctx.message.text
            await ctx.reply(`[${id}] Project created with the following settings:
Detail:         ${ctx.wizard.state.detail}
Order:          ${ctx.wizard.state.order}
Feature:    ${ctx.wizard.state.feature}
            `)

            console.log(ctx.wizard.state)
            
            return await ctx.scene.leave()  
        }
    );
    
    const stage = new Scenes.Stage([wizard], {
        ttl: 10,
    });
    bot.use(session());
    bot.use(stage.middleware());
    bot.command("wizard", ctx => ctx.scene.enter("wizard"));

}

module.exports = {
    useWizard
}