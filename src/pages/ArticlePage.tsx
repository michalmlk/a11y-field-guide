import { lazy, Suspense, useMemo, Component } from "react";
import type { ComponentType, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { articles } from "../articles/index";
import type { ArticleMeta } from "../components/ArticleCard";
import { Link, useParams } from "react-router";
import styles from "./ArticlePage.module.css";

class ArticleErrorBoundary extends Component<
	{ children: ReactNode; failedText: string; backText: string },
	{ failed: boolean }
> {
	state = { failed: false };
	static getDerivedStateFromError() {
		return { failed: true };
	}
	render() {
		if (this.state.failed)
			return (
				<div>
					<p>{this.props.failedText}</p>
					<Link to="/">{this.props.backText}</Link>
				</div>
			);
		return this.props.children;
	}
}

const mdxModules = import.meta.glob<{ default: ComponentType }>(
	"../articles/*/*.mdx",
);

const lazyCache = new Map<string, ReturnType<typeof lazy>>();

function getLazyMDX(lang: string, slug: string) {
	const localizedPath = `../articles/${lang}/${slug}.mdx`;
	const fallbackPath = `../articles/en/${slug}.mdx`;
	const path = mdxModules[localizedPath] ? localizedPath : fallbackPath;
	const loader = mdxModules[path];
	if (!loader) {
		return null;
	}
	let cached = lazyCache.get(path);

	if (!cached) {
		cached = lazy(loader);
		lazyCache.set(path, cached);
	}
	return cached;
}

export default function ArticlePage() {
	const { slug } = useParams<{ slug: string }>();
	const { t, i18n } = useTranslation(["common", "articles"]);
	const lang = i18n.language.split("-")[0];
	const meta: ArticleMeta | undefined = articles.find((a) => a.slug === slug);

	const MDXContent = useMemo(
		() => (slug ? getLazyMDX(lang, slug) : null),
		[slug, lang],
	);

	if (!meta || !MDXContent) {
		return (
			<div>
				<h1>{t("article.notFound")}</h1>
				<p>
					<Link to="/">{t("article.backToArticles")}</Link>
				</p>
			</div>
		);
	}

	const title = t(`${meta.slug}.title`, { ns: "articles" });

	return (
		<article className={styles.article}>
			<header className={styles.header}>
				<nav aria-label={t("nav.breadcrumb")}>
					<Link to="/">{t("nav.articles")}</Link> / {title}
				</nav>
				<h1 id="article-title">{title}</h1>
				<p>
					<span>{t("article.wcag", { id: meta.wcag })}</span>
				</p>
				<ul aria-label={t("article.tagsLabel")} className={styles.tags}>
					{meta.tags.map((tag) => (
						<li key={tag} className={styles.tag}>
							{tag}
						</li>
					))}
				</ul>
			</header>
			<section
				className={styles.content}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must be keyboard reachable
				tabIndex={0}
				aria-labelledby="article-title"
			>
				<ArticleErrorBoundary
					failedText={t("article.loadFailed")}
					backText={t("article.backToArticles")}
				>
					<Suspense fallback={<p>{t("article.loading")}</p>}>
						<MDXContent />
					</Suspense>
				</ArticleErrorBoundary>
			</section>
		</article>
	);
}
