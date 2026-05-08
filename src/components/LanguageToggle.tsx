import { useTranslation } from "react-i18next";
import { supportedLngs } from "../i18n";
import styles from "./ThemeToggle.module.css";

export default function LanguageToggle() {
	const { t, i18n } = useTranslation();
	const current = i18n.language.split("-")[0];

	return (
		<label className={styles.toggle}>
			<span className="visually-hidden">{t("language.label")}</span>
			<select
				className={styles.select}
				value={supportedLngs.includes(current as never) ? current : "en"}
				onChange={(e) => i18n.changeLanguage(e.target.value)}
				aria-label={t("language.label")}
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
