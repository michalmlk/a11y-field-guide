import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./DemoShell.module.css";
import { useTheme } from "../context/themeContext";
import type { Theme } from "../context/themeContext";

export interface DemoMountContext {
	theme: Theme;
}

interface DemoShellProps {
	title: string;
	/** Receives the container element and the current theme; return a cleanup function */
	// biome-ignore lint/suspicious/noConfusingVoidType: returning a cleanup fn is optional
	mount: (
		container: HTMLElement,
		ctx: DemoMountContext,
	) => (() => void) | void;
}

export default function DemoShell({ title, mount }: DemoShellProps) {
	const { t } = useTranslation();
	const containerRef = useRef<HTMLDivElement>(null);

	const { theme } = useTheme();

	useEffect(() => {
		const el = containerRef.current;
		if (!el) {
			return;
		}
		const cleanup = mount(el, { theme });
		return () => {
			cleanup?.();
			el.innerHTML = "";
		};
	}, [mount, theme]);

	return (
		<section className={styles.shell} aria-label={t("demo.label", { title })}>
			<h3 className={styles.heading}>{title}</h3>
			<div
				className={styles.stage}
				ref={containerRef}
				data-theme={theme}
			/>
		</section>
	);
}
