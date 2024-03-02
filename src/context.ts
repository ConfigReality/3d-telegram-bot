import { Context, Scenes } from "telegraf";
// import { I18nProp } from "./i18n";
// import { SessionContext } from "telegraf/typings/session";
// import { SceneContextScene, WizardSession, WizardSessionData } from "telegraf/typings/scenes";

// type DetailType = "preview" | "reduced" | "medium" | "full" | "raw";
// type OrderType = "unordered" | "sequential";
// type FeatureType = "normal" | "high";

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
// interface IWizardSession extends Scenes.WizardSessionData {
interface ProcessConfigProps {
	// will be available under `ctx.scene.session.myWizardSessionProp`
	detail: string;
	order: string;
	feature: string;
	detailMessage: number;
	orderMessage: number;
	featureMessage: number;
	completeMessage: number;
	abortedMessage: number;
	defaultMessage: number;
	// isComplete: boolean;
}

interface SessionData extends Scenes.WizardSession {
	// will be available under `ctx.session.userId`
	// userId: number;
	id: string;
	processing: boolean;
	processConfig: ProcessConfigProps;
	lastIteraction: string;
}
// interface IWizardContext extends IContext {
// 	detail: string;
// 	order: string;
// 	feature: string;
// }

export interface IContext extends Context {
	session: SessionData;
	// will be available under `ctx.id`
	// i18n: I18nProp;
	// declare scene type
	scene: Scenes.SceneContextScene<IContext, Scenes.WizardSessionData>;
	// declare wizard type
	wizard: Scenes.WizardContextWizard<IContext>;
}

