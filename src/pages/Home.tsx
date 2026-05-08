import { useTranslation } from "react-i18next";
import ArticleCard from "../components/ArticleCard";
import { articles } from "../articles/index";
import styles from "./Home.module.css";

export default function Home() {
	const { t } = useTranslation();
	return (
		<>
			<h1>{t("site.title")}</h1>
			<p className={styles.description}>{t("site.tagline")}</p>
			<ul className={styles.list} aria-label={t("home.articlesLabel")}>
				{articles.map((article) => (
					<li key={article.slug}>
						<ArticleCard article={article} />
					</li>
				))}
			</ul>
		</>
	);
}
