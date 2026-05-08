import type { ArticleMeta } from "../components/ArticleCard";

export const articles: ArticleMeta[] = [
	{
		slug: "focus-trap",
		title: "Focus Trap",
		description:
			"Keep keyboard focus inside modal dialogs using a proper focus trap implementation.",
		wcag: "2.1.2",
		tags: ["keyboard", "modal", "focus"],
	},
	{
		slug: "aria-roles",
		title: "ARIA Roles",
		description:
			"Use ARIA roles to give semantic meaning to custom interactive widgets.",
		wcag: "4.1.2",
		tags: ["aria", "semantics", "roles"],
	},
	{
		slug: "color-contrast",
		title: "Color Contrast",
		description:
			"Ensure sufficient contrast ratios for text and interactive elements.",
		wcag: "1.4.3",
		tags: ["color", "visual", "contrast"],
	},
];
