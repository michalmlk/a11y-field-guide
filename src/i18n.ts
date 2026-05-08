import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import enArticles from "./locales/en/articles.json";
import plCommon from "./locales/pl/common.json";
import plArticles from "./locales/pl/articles.json";

export const supportedLngs = ["en", "pl"] as const;
export type Locale = (typeof supportedLngs)[number];

const syncHtmlLang = (lng: string) => {
	document.documentElement.lang = lng.split("-")[0];
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { common: enCommon, articles: enArticles },
			pl: { common: plCommon, articles: plArticles },
		},
		fallbackLng: "en",
		supportedLngs: [...supportedLngs],
		ns: ["common", "articles"],
		defaultNS: "common",
		interpolation: { escapeValue: false },
		detection: {
			order: ["localStorage", "navigator"],
			caches: ["localStorage"],
			lookupLocalStorage: "i18nextLng",
		},
	})
	.then(() => syncHtmlLang(i18n.language));

i18n.on("languageChanged", syncHtmlLang);

export default i18n;
