import { useTranslation } from "react-i18next";
import { supportedLngs, type Locale } from "../i18n";
import styles from "./ThemeToggle.module.css";

export default function LanguageToggle() {
	const { t, i18n } = useTranslation();
	const current = i18n.language.split("-")[0] as Locale;
	const value = supportedLngs.includes(current) ? current : "en";

	return (
		<label className={styles.toggle}>
			<span className="visually-hidden">{t("language.label")}</span>
			<select
				className={styles.select}
				value={value}
				onChange={(e) => i18n.changeLanguage(e.target.value)}
			>
				{supportedLngs.map((lng) => (
					<option key={lng} value={lng}>
						{t(`language.${lng}`)}
					</option>
				))}
			</select>
		</label>
	);
}
