// create wizard to create a new project
// 1. create a new project

import { Scenes, session, Markup, Telegraf } from "telegraf";
import { v4 as uuidv4 } from 'uuid';
import { IContext } from "./context";

// 2. "-d","medium", // -d specifies the detail
// const details = {
//     _: 'detail',
//     preview: 'preview',
//     reduced: 'reduced',
//     medium: 'medium',
//     full: 'full',
//     raw: 'raw',
// }

// // 3. "-o","unordered", // -o specifies the sample ordering
// const orders = {
//     _: 'orders',
//     unordered: 'unordered',
//     sequential: 'sequential',
// }

// // 4. "-f","normal" // -f specifies the feature sensitivity
// const features = {
//     _: 'features',
//     normal: 'normal',
//     high: 'high',
// }
export const useWizard = (bot: Telegraf<IContext>) => {
//     const wizard = new Scenes.WizardScene<IContext>(
//         "wizard",
//         async (ctx) => {
//             const id: string = uuidv4()
//             const keyboard = Markup.keyboard([
//                 Markup.button.text(`👉 ${details._} ${details.preview}`),
//                 Markup.button.text(`👉 ${details._} ${details.reduced}`),
//                 Markup.button.text(`👉 ${details._} ${details.medium}`),
//                 Markup.button.text(`👉 ${details._} ${details.full}`),
//                 Markup.button.text(`👉 ${details._} ${details.raw}`),
//             ]).oneTime().resize();
            
//             ctx.scene.session.projectId = id
//             await ctx.reply(`[${id}] Welcome to the project creation wizard. Please select the detail level of the project`, 
//             keyboard)

//             return ctx.wizard.next()

//         },
//         async (ctx) => {
//             // check if the user has selected a detail level)
//             // ctx.scene.session.wizardSessionProp.detail = ctx.message.text
//             await ctx.reply('Please select the sample ordering.', Markup.keyboard([
//                 Markup.button.text(`👉 ${orders._} ${orders.unordered}`),
//                 Markup.button.text(`👉 ${orders._} ${orders.sequential}`),
//             ]).oneTime().resize())
//             return ctx.wizard.next()
//         },
//         async (ctx) => {
//             // ctx.scene.session.wizardSessionProp.order = ctx.message.text
//             await ctx.reply('Please select the feature sensitivity.', Markup.keyboard([
//                 Markup.button.text(`👉 ${features._} ${features.normal}`),
//                 Markup.button.text(`👉 ${features._} ${features.high}`),
//             ]).oneTime().resize())
//             return ctx.wizard.next()
//         },
//         async (ctx) => {
//             // get photo from user
//             // ctx.scene.session.wizardSessionProp.feature = ctx.message.text
//             await ctx.reply('Please send a photo of the project.')
//             return ctx.wizard.next()
//         },
//         async (ctx) => {
//             // ctx.scene.session.wizardSessionProp.feature = ctx.message.text
//             await ctx.reply(`[${ctx.scene.session.projectId}] Project created with the following settings:
// Detail:         ${ctx.scene.session.wizardSessionProp.detail}
// Order:          ${ctx.scene.session.wizardSessionProp.order}
// Feature:    ${ctx.scene.session.wizardSessionProp.feature}
//             `)

//             return await ctx.scene.leave()  
//         }
//     );
    
    
    // listeners
    // const regexO = new RegExp(`^👉 ${orders._}`)
    // const regexF = new RegExp(`^👉 ${features._}`)
    // const regexD = new RegExp(`^👉 ${details._}`)
    // bot.hears(regexD, async ctx => {
    //     console.log('ctx.message.text', ctx.message.text)
    //     // await ctx.reply(`👍 ${ctx.message.text}`)
    //     // ctx.wizard.next()
    // });
    // bot.hears(regexO, async ctx => {
    //     console.log('ctx.message.text', ctx.message.text)
    //     // await ctx.reply(`👍 ${ctx.message.text}`)
    // });
    // bot.hears(regexF, async ctx => {
    //     console.log('ctx.message.text', ctx.message.text)
    //     // await ctx.reply(`👍 ${ctx.message.text}`)
    // });

    // const stage = new Scenes.Stage<IContext>([wizard], {
    //     ttl: 10,
    // });

    // bot.use(session());
    // bot.use(stage.middleware());
    // bot.command("wizard", async ctx => await ctx.scene.enter("wizard"));
}

