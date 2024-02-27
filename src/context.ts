import { Context, Scenes, Telegram } from "telegraf";
import { I18nProp } from "./i18n";
// import { Update, UserFromGetMe } from "telegraf/typings/core/types/typegram";

// interface IWizardContext extends Scenes.WizardSessionData {
//     detail: string;
//     order: string;
//     feature: string;
// }

/**
 * It is possible to extend the session object that is available to each wizard.
 * This can be done by extending `WizardSessionData` and in turn passing your
 * own interface as a type variable to `WizardContextWizard`.
 */
// interface IWizardSession extends Scenes.WizardSessionData {
// 	// will be available under `ctx.scene.session.wizardSessionProp`
// 	projectId: string;
// 	wizardSessionProp: IWizardContext;
// }

interface SessionData {
	// will be available under `ctx.session.userId`
	// userId: number;
	id: string;
	processing: boolean;
	lastIteraction: string;
}
/**
 * We can define our own context object.
 *
 * We now have to set the scene object under the `scene` property. As we extend
 * the scene session, we need to pass the type in as a type variable.
 *
 * We also have to set the wizard object under the `wizard` property.
 */
export interface IContext extends Context {
	session: SessionData;
	// will be available under `ctx.id`
	i18n: I18nProp;

	// declare scene type
	// scene: Scenes.SceneContextScene<IContext, IWizardSession>;
	// declare wizard type
	// wizard: Scenes.WizardContextWizard<IContext>;
}

