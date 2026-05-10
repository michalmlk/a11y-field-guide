import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ThemeContext } from "./themeContext";
import type { Theme } from "./themeContext";

function getInitialTheme(): Theme {
	const stored = localStorage.getItem("theme") as Theme | null;
	if (stored === "light" || stored === "dark") return stored;
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	useEffect(() => {
		if (localStorage.getItem("theme")) return;
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			setThemeState(mediaQuery.matches ? "dark" : "light");
		};
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	const setTheme = useCallback((t: Theme) => {
		localStorage.setItem("theme", t);
		setThemeState(t);
	}, []);

	const toggle = useCallback(() => {
		setThemeState((t) => {
			const next = t === "light" ? "dark" : "light";
			localStorage.setItem("theme", next);
			return next;
		});
	}, []);

	return (
		<ThemeContext.Provider value={{ theme, toggle, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
