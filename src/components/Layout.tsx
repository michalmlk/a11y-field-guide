import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import styles from "./Layout.module.css";
import { Link, Outlet } from "react-router";

export default function Layout() {
	const { t } = useTranslation();
	return (
		<>
			<a href="#main-content" className="skip-link">
				{t("nav.skipToMain")}
			</a>
			<div className={styles.wrapper}>
				<header className={styles.header}>
					<a
						href="/"
						className={styles.logo}
						aria-label={t("site.homeAriaLabel")}
					>
						{t("site.title")}
					</a>
					<nav aria-label={t("nav.primary")}>
						<ul className={styles.nav}>
							<Link to="/about">{t("nav.about")}</Link>
						</ul>
					</nav>
					<LanguageToggle />
					<ThemeToggle />
				</header>
				<main id="main-content" className={styles.main} tabIndex={-1}>
					<Outlet />
				</main>
				<footer className={styles.footer}>
					<p>{t("site.footer")}</p>
				</footer>
			</div>
		</>
	);
}
