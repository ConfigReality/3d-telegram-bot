import { Telegraf } from "telegraf";
import { IContext } from "../context";
import { ChildProcess, ExecException, exec } from "child_process";
import { join } from 'path'
import fastq from "fastq";

import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";
import { Client } from "pg";

const dir = join(__dirname.substring(0, __dirname.lastIndexOf('/')), '..', '..')
const outDir = `${dir}/photos`
const libDir = `${dir}/src/lib`


// const INACTICITY_TIMEOUT = 10 * 1000;

function promiseFromChildProcess(child: ChildProcess) {
    return new Promise(function (resolve, reject) {
        child.addListener("error", reject);
        child.addListener("exit", resolve);
    });
}

const queue = fastq.promise(async (ctx: IContext) => {
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    const id = ctx.session.id;
    const source = `${outDir}/${id}/${id}.usdz`;
    await promiseFromChildProcess(exec(
        `cd ${libDir} && ./HelloPhotogrammetry ${outDir}/${id}/ ${source}`,
        (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                ctx.reply(`Errore durante l'elaborazione del modello. ${error.message}`)
                return;
            }
            
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        }
    ));
    ctx.reply(
`Modello pronto! 
${ctx.session.id}`
    );
    // check if file exists
    if(!existsSync(source)) {
        ctx.reply(`Errore durante l'elaborazione del modello. File non trovato.`);
        return;
    }
    ctx.sendDocument({source});
    ctx.session.id = "";
    ctx.session.processing = false;
}, 1);

export const useProcessing = (bot: Telegraf<IContext>, db: Client) => {
    const _exit = (id: string) => `Processo ${id} già in corso.
Premere /cancel per annullare il processo.`

    bot.command("list", async (ctx) => {
        const resume = queue.resume()
        const length = queue.length()
        console.log(resume, length)
        await ctx.reply(JSON.stringify({ resume, length }, null, 2));
    });

    bot.command("init", async (ctx) => {
        if (ctx.session.id) {
            await ctx.reply(_exit(ctx.session.id));
            return
        }
        
        await ctx.reply(
            ` 
Iniziamo! Invia le foto e attedi l'upload.

Al termine basterà eseguire il comando /processing per avviare il processo di elaborazione.

Attendi il messaggio di conferma.

NOTA BENE: Attendi il caricamento di tutte le foto prima di inviare /processing.

Premi /cancel per annullare il processo.`
            );
            
        ctx.session.id = uuidv4();

        const insertModel = await db.query('INSERT INTO models (model_id, user_id) VALUES ($1, $2)', [ctx.session.id, ctx.from.id]);
        if(insertModel.rowCount === 0) {
            await ctx.reply('Errore durante l\'inserimento del modello');
        }
        await ctx.reply(`Incolla le foto da processare.`);
    });

    bot.command("cancel", async (ctx) => {
        if (!ctx.session.processing && !ctx.session.id) {
            await ctx.reply("Nessun processo in corso.");
            return
        }
        await ctx.reply(`Processo annullato., ${ctx.session.id}`);
        ctx.session.id = "";
        ctx.session.processing = false;
    });

    bot.command("processing", async (ctx) => {
        if (!ctx.session.id) {
            await ctx.reply(`Per iniziare un nuovo processo, invia /init.`);
            return
        }
        if (ctx.session.processing) {
            await ctx.reply(_exit(ctx.session.id));
            return
        }

        await ctx.reply(
`
[${ctx.session.id}] Processing...
Attendi qualche minuto. 
Ti invierò il modello 3D appena pronto.`
        );

        queue.push(ctx);
    });

    // bot.command('config', async (ctx) => {
    //     const { detail, order, feature } = ctx.session.processConfig;

    //     const _detail = await ctx.reply('Seleziona il dettaglio', Markup.keyboard(['preview'  ,'reduced'  ,'medium'  ,'full'  ,'raw']).oneTime().resize());
    //     const _order = await ctx.reply('Seleziona l\'ordine', Markup.keyboard(['unordered','sequential']).oneTime().resize());
    //     const _feature = await ctx.reply('Seleziona la feature', Markup.keyboard(['normal','high']).oneTime().resize());

    //     console.log({ _detail, _order, _feature })
    // });

    bot.command('reprocessing', async (ctx) => {
        const {text} = ctx.message;
        const [_, id] = text.split(' ');
        if(!id) {
            await ctx.reply(`
Inserisci l'id del processo da riprovare. 

Esempio: /reprocessing 123e4567-e89b-12d3-a456-426614174000`
            );
            return
        }
        ctx.session.id = id;
        ctx.session.processing = false;
        await ctx.reply(`Riprovo il processo ${id}`);
        queue.push(ctx);
    });
};
