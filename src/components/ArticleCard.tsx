import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import styles from "./ArticleCard.module.css";

export interface ArticleMeta {
	slug: string;
	wcag: string;
	tags: string[];
}

interface ArticleCardProps {
	article: ArticleMeta;
}

export default function ArticleCard({ article }: ArticleCardProps) {
	const { t } = useTranslation(["common", "articles"]);
	const title = t(`${article.slug}.title`, { ns: "articles" });
	const description = t(`${article.slug}.description`, { ns: "articles" });
	const articleAriaLabel = t("article.ariaLabel", {
		title,
		description,
		wcag: article.wcag,
		tags: article.tags.join(", "),
	});

	return (
		<article className={styles.card} aria-label={articleAriaLabel}>
			<header>
				<h2 className={styles.title}>
					<Link to={`/articles/${article.slug}`}>{title}</Link>
				</h2>
				<p className={styles.wcag}>
					<span className={styles.tag}>{t("article.wcag", { id: article.wcag })}</span>
				</p>
			</header>
			<p className={styles.description}>{description}</p>
			<footer className={styles.footer}>
				<ul className={styles.tags} aria-label={t("article.tagsLabel")}>
					{article.tags.map((tag) => (
						<li key={tag} className={styles.tag}>
							{tag}
						</li>
					))}
				</ul>
			</footer>
		</article>
	);
}
