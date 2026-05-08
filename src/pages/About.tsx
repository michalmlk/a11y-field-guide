import { useTranslation } from "react-i18next";

export default function About() {
	const { t } = useTranslation();
	return (
		<>
			<h1>{t("about.title")}</h1>
			<p>{t("about.body")}</p>
		</>
	);
}
