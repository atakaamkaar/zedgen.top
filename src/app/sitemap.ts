import type { MetadataRoute } from "next";

const BASE_URL = "https://zedgen.top";

const routes = ["/", "/login", "/season0", "/season1", "/store", "/collab"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
