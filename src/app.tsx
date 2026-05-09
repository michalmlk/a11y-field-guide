import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import ArticlePage from "./pages/ArticlePage";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: "/about",
				element: <About />,
			},
			{
				path: "/articles/:slug",
				element: <ArticlePage />,
			},
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
