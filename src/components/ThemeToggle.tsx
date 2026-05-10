import { useTranslation } from "react-i18next";
import styles from "./ThemeToggle.module.css";
import { useTheme } from "../context/themeContext";

export default function ThemeToggle() {
	const { t } = useTranslation();

	const { theme, toggle } = useTheme();

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={
				theme === "light" ? t("theme.switchToDark") : t("theme.switchToLight")
			}
			aria-pressed={theme === "dark"}
			className={styles.toggle}
		>
			{theme === "light" ? "🌙" : "☀️"}
		</button>
	);
}
