import { IContext } from "./context";

export const useI18n = (ctx: IContext) => {
    const lang = ctx.from?.language_code;

    const it = "./i18n/it.json";
    const en = "./i18n/en.json";

    // read json file and return object
    const read = (path: string) => {
        return JSON.parse(require
            .resolve(path)
            .replace(/\.js$/, '.json')
        );
    }

    // read json file
    const i18n = lang === "it" ? read(it) : read(en);

    ctx.i18n = i18n;
};

export interface I18nProp {
    [key: string]: string;
}