export const defaultRoute = {
  view: "home", q: "", category: "all", type: "all", language: "all", tag: "all",
  source: "starred", archive: "active", sort: "auto", layout: "list", repo: "",
  year: "all", from: "", to: "", coverage: "all", origin: "all",
  topic: "", recipe: "", issue: "", anchor: "", queue: "unclassified", queuePage: "1", queueQuery: "",
  queueStatus: "all", queueTopic: "all", queueCheckedBefore: "", queueSort: "starred",
};
const views = new Set(["home", "library", "history", "weekly", "inbox", "detail", "about", "curation", "topics", "recipes", "basket"]);
export function routeFromUrl(href) {
  const params = new URL(href).searchParams;
  const route = Object.fromEntries(Object.entries(defaultRoute).map(([key, fallback]) => [key, params.get(key) || fallback]));
  if (!views.has(route.view)) route.view = "library";
  if (route.view === "history" && !params.get("source")) route.source = "all";
  for (const key of ["from", "to", "queueCheckedBefore"]) if (!/^\d{4}-\d{2}-\d{2}$/.test(route[key])) route[key] = "";
  try { route.anchor = decodeURIComponent(new URL(href).hash.slice(1)); } catch { route.anchor = ""; }
  if (!route.anchor.startsWith("content-") && !["queue-list","curation-sheet", "weekly-archive"].includes(route.anchor) && !/^weekly-item-[1-9]\d*$/.test(route.anchor) && !/^recipe-step-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(route.anchor)) route.anchor = "";
  return route;
}
export function urlForRoute(route, href) {
  const url = new URL(href); url.search = "";
  Object.entries(defaultRoute).forEach(([key, fallback]) => {
    if (key === "anchor") return;
    if (key === "source" && route.view === "history") fallback = "all";
    if (route[key] && route[key] !== fallback) url.searchParams.set(key, route[key]);
  });
  return `${url.pathname}${url.search}${route.anchor ? `#${encodeURIComponent(route.anchor)}` : ""}`;
}

export function shouldHandleLink(event) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function detailReturnRoute(route, recipes, issues = []) {
  if (issues.some(issue => issue.id === route.issue)) return { ...defaultRoute, view: "weekly", issue: route.issue };
  if (recipes.some(recipe => recipe.id === route.recipe)) return { ...defaultRoute, view: "recipes", recipe: route.recipe };
  return { ...route, view: route.topic ? "topics" : "library", repo: "", recipe: "", anchor: "" };
}

export function activeNavigationView(route, returnRoute, recipes, issues = []) {
  if (route.view === "weekly") return "history";
  if (route.view === "recipes") return "topics";
  if (["detail", "curation"].includes(route.view)) {
    if (issues.some(issue => issue.id === route.issue)) return "history";
    if (recipes.some(recipe => recipe.id === route.recipe)) return "topics";
    if (returnRoute?.view === "basket") return "basket";
    return "library";
  }
  return route.view;
}
