import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
	const stored = localStorage.getItem("theme") as Theme | null;
	if (stored) return stored;
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function useTheme() {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);
	useEffect(() => {
		const stored = localStorage.getItem("theme") as Theme | null;
		if (stored) {
			setTheme(stored);
		} else {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const handleChange = () => {
				setTheme(mediaQuery.matches ? "dark" : "light");
			};
			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}
	}, []);

	const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

	return { theme, toggle };
}

export default function ThemeToggle() {
	const { t } = useTranslation();

	const { theme, toggle } = useTheme();

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

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
