import { Telegraf } from "telegraf";
import { IContext } from "../context";
import { ChildProcess, exec } from "child_process";
import { join } from 'path'
import fastq from "fastq";

import { v4 as uuidv4 } from "uuid";

const dir = join(__dirname.substring(0, __dirname.lastIndexOf('/')), '..', '..')
const outDir = `${dir}/photos`
const libDir = `${dir}/src/lib`

function promiseFromChildProcess(child: ChildProcess) {
    return new Promise(function (resolve, reject) {
        child.addListener("error", reject);
        child.addListener("exit", resolve);
    });
}

const queue = fastq.promise(async (ctx: IContext) => {
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    const id = ctx.session.id;
    await promiseFromChildProcess(exec(
        `cd ${libDir} && ./HelloPhotogrammetry ${outDir}/${id}/ ${outDir}/${id}/${id}.usdz`,
        console.error
    ));
    ctx.reply(
        `Modello pronto! 
${ctx.session.id}`
    );
    ctx.sendDocument(`${outDir}/${id}/models/${id}.usdz`);
    ctx.session.id = "";
}, 1);

export const useProcessing = (bot: Telegraf<IContext>) => {
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
            `Step 1 
            Iniziamo! Invia le foto e attedi l'upload.
            
            Al termine basterà eseguire il comando /processing per avviare il processo di elaborazione.
            
            Attendi il messaggio di conferma.
            
            NOTA BENE: Attendi il caricamento di tutte le foto prima di inviare /processing.
            
            Premi /cancel per annullare il processo.`
            );
            
        ctx.session.id = uuidv4();
        await ctx.reply(`Incolla le foto da processare.`);
    });

    bot.command("cancel", async (ctx) => {
        if (!ctx.session.processing) {
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
        // creo un id univoco per la sessione
        await ctx.reply(
`Step 2
[${ctx.session.id}] Processing...
Attendi qualche minuto. 
Ti invierò il modello 3D appena pronto.`
        );

        queue.push(ctx);
    });
};
