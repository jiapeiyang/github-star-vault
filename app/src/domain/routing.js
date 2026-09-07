export const defaultRoute = {
  view: "home", q: "", category: "all", type: "all", language: "all", tag: "all",
  source: "starred", archive: "active", sort: "starred", layout: "list", repo: "",
  year: "all", from: "", to: "", coverage: "all", origin: "all",
  queue: "unclassified", queuePage: "1", queueQuery: "",
};
const views = new Set(["home", "library", "history", "inbox", "detail", "about", "curation"]);
export function routeFromUrl(href) {
  const params = new URL(href).searchParams;
  const route = Object.fromEntries(Object.entries(defaultRoute).map(([key, fallback]) => [key, params.get(key) || fallback]));
  if (!views.has(route.view)) route.view = "library";
  if (route.view === "history" && !params.get("source")) route.source = "all";
  for (const key of ["from", "to"]) if (!/^\d{4}-\d{2}-\d{2}$/.test(route[key])) route[key] = "";
  return route;
}
export function urlForRoute(route, href) {
  const url = new URL(href); url.search = "";
  Object.entries(defaultRoute).forEach(([key, fallback]) => {
    if (key === "source" && route.view === "history") fallback = "all";
    if (route[key] && route[key] !== fallback) url.searchParams.set(key, route[key]);
  });
  return `${url.pathname}${url.search}`;
}
