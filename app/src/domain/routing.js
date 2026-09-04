export const defaultRoute = {
  view: "home",
  q: "",
  category: "all",
  stage: "all",
  type: "all",
  language: "all",
  tag: "all",
  source: "starred",
  archive: "active",
  sort: "starred",
  layout: "list",
  repo: "",
};

const views = new Set(["home", "library", "inbox", "learning", "detail", "about"]);

export function routeFromUrl(href) {
  const params = new URL(href).searchParams;
  const route = Object.fromEntries(Object.entries(defaultRoute).map(([key, fallback]) => [key, params.get(key) || fallback]));
  if (!views.has(route.view)) route.view = "home";
  return route;
}

export function urlForRoute(route, href) {
  const url = new URL(href);
  url.search = "";
  Object.entries(route).forEach(([key, value]) => {
    if (value && value !== defaultRoute[key]) url.searchParams.set(key, value);
  });
  return `${url.pathname}${url.search}`;
}
