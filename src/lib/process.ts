import { Telegraf } from "telegraf";
import { IContext } from "../context";
import { exec } from "child_process";
import { mkdir } from "fs/promises";
import {join} from 'path'
import { Client } from "pg";

const dir = join(__dirname.substring(0, __dirname.lastIndexOf('/')), '..', '..')
const outDir = `${dir}/tmp`
const libDir = `${dir}/src/lib`

export const useProcessing = (bot: Telegraf<IContext>, instance: Client) => {
    bot.command("list", async (ctx) => {
        // const id = ctx.from.id;
        // const res = await instance.query(
        //     "SELECT * FROM models WHERE user_id = $1",
        //     [id]
        // );
        // await ctx.reply(
        //     res.rows.map((row) => row.id).join("\n") || "No models found."
        // );
    });

    bot.command("process", async (ctx) => {
        await ctx.reply(`[${ctx.from.id}]Incolla le foto da processare.`);
        // const res = await instance.query(
        //     "INSERT INTO models (user_id) VALUES ($1) RETURNING id",
        //     [ctx.from.id]
        // );
        
        // const id = res.rows[0].id;

        await mkdir(`${outDir}/${ctx.from.id}/images`, { recursive: true });
        await mkdir(`${outDir}/${ctx.from.id}/models`, { recursive: true });
        
        await ctx.replyWithMarkdownV2(`Per terminare il processo, invia /done.
Il processo potrebbe richiedere diversi minuti. 
Attendi il messaggio di conferma.

**NOTA BENE**: Attendi il caricamento di tutte le foto prima di inviare /done.`);
    });

    bot.command("done", async (ctx) => {
        const id = ctx.from.id;
        await ctx.reply(`[${id}] Processing...
Attendi qualche minuto. 
Ti invierò il modello 3D appena pronto.`);
        // move images to processing folder
        const destFOlder = `${dir}/photos/`
        const outFOlder = `${outDir}/${ctx.from.id}/images/`
        
        exec(`mv ${destFOlder}*.jpg ${outFOlder}`, console.error)

        exec(
            `cd ${libDir} && ./HelloPhotogrammetry ${outDir}/${id}/images/ ${outDir}/${id}/models/${id}.usdz`,
            console.error
          )
    });
};
