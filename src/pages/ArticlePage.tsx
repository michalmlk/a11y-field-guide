import { lazy, Suspense, useEffect, useMemo, useRef, Component } from "react";
import type { ComponentType, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { articles } from "../articles/index";
import type { ArticleMeta } from "../components/ArticleCard";
import { Link, useParams } from "react-router";
import { wcagCriteria } from "../utils/wcag-criteria";
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
				<div role="alert">
					<h1>{this.props.failedText}</h1>
					<p>
						<Link to="/">{this.props.backText}</Link>
					</p>
				</div>
			);
		return this.props.children;
	}
}

const mdxModules = import.meta.glob<{ default: ComponentType }>(
	"../articles/*/*.mdx",
);

const lazyCache = new Map<string, ReturnType<typeof lazy>>();

interface ResolvedMDX {
	Component: ReturnType<typeof lazy>;
	lang: string;
}

function getLazyMDX(lang: string, slug: string): ResolvedMDX | null {
	const localizedPath = `../articles/${lang}/${slug}.mdx`;
	const fallbackPath = `../articles/en/${slug}.mdx`;
	const resolvedLang = mdxModules[localizedPath] ? lang : "en";
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
	return { Component: cached, lang: resolvedLang };
}

export default function ArticlePage() {
	const { slug } = useParams<{ slug: string }>();
	const { t, i18n } = useTranslation(["common", "articles"]);
	const lang = i18n.language.split("-")[0];
	const meta: ArticleMeta | undefined = articles.find((a) => a.slug === slug);
	const headingRef = useRef<HTMLHeadingElement>(null);

	const resolved = useMemo(
		() => (slug ? getLazyMDX(lang, slug) : null),
		[slug, lang],
	);

	useEffect(() => {
		if (!meta || !resolved) return;
		headingRef.current?.focus();
	}, [slug, meta, resolved]);

	if (!meta || !resolved) {
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
	const { Component: MDXContent, lang: contentLang } = resolved;
	const criterion = wcagCriteria[meta.wcag];

	return (
		<article className={styles.article} lang={contentLang}>
			<header className={styles.header}>
				<nav aria-label={t("nav.breadcrumb")}>
					<ol className={styles.breadcrumb}>
						<li>
							<Link to="/">{t("nav.articles")}</Link>
						</li>
						<li aria-current="page">{title}</li>
					</ol>
				</nav>
				<h1 ref={headingRef} tabIndex={-1} className={styles.title}>
					{title}
				</h1>
				<p className={styles.wcagMeta}>
					{criterion ? (
						<a
							className={styles.wcagLink}
							href={criterion.url}
							target="_blank"
							rel="noopener noreferrer"
						>
							{t("article.wcagFull", {
								id: criterion.id,
								level: criterion.level,
								title: criterion.title,
							})}
							<span className="visually-hidden">
								{" "}
								{t("article.opensInNewTab")}
							</span>
						</a>
					) : (
						<span>{t("article.wcag", { id: meta.wcag })}</span>
					)}
				</p>
				<ul aria-label={t("article.tagsLabel")} className={styles.tags}>
					{meta.tags.map((tag) => (
						<li key={tag} className={styles.tag}>
							{tag}
						</li>
					))}
				</ul>
			</header>
			<div className={styles.content}>
				<ArticleErrorBoundary
					failedText={t("article.loadFailed")}
					backText={t("article.backToArticles")}
				>
					<Suspense fallback={<p>{t("article.loading")}</p>}>
						<MDXContent />
					</Suspense>
				</ArticleErrorBoundary>
			</div>
		</article>
	);
}
