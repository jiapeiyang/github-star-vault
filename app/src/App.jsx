import { useEffect, useState } from "react";
import { Header } from "./components/Header.jsx";
import { loadCatalog } from "./domain/catalog.js";
import { defaultRoute, routeFromUrl, urlForRoute } from "./domain/routing.js";
import { AboutView } from "./views/AboutView.jsx";
import { DetailView } from "./views/DetailView.jsx";
import { HomeView } from "./views/HomeView.jsx";
import { InboxView } from "./views/InboxView.jsx";
import { LearningView } from "./views/LearningView.jsx";
import { LibraryView } from "./views/LibraryView.jsx";
import { NotFoundView } from "./views/NotFoundView.jsx";

export function App() {
  const [route, setRoute] = useState(() => routeFromUrl(window.location.href));
  const [catalog, setCatalog] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoadError("");
    loadCatalog().then((value) => active && setCatalog(value)).catch((error) => active && setLoadError(error.message));
    return () => { active = false; };
  }, [loadAttempt]);

  useEffect(() => {
    const restore = () => setRoute(routeFromUrl(window.location.href));
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  useEffect(() => {
    const focusSearch = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("masthead-query")?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const updateRoute = (patch, mode = "push") => {
    setRoute((current) => {
      const next = { ...current, ...patch };
      window.history[mode === "replace" ? "replaceState" : "pushState"]({}, "", urlForRoute(next, window.location.href));
      return next;
    });
    if (patch.view) window.scrollTo({ top: 0, behavior: "auto" });
  };

  const navigate = (view, patch = {}) => updateRoute({ view, ...patch });
  const openRepo = (repoOrId) => {
    const repoId = typeof repoOrId === "object" ? repoOrId.repoId : repoOrId;
    navigate("detail", { repo: String(repoId) });
  };
  const openLibrary = (patch = {}) => navigate("library", { ...defaultRoute, view: "library", ...patch });

  const repositories = catalog?.repositories || [];
  const inboxCount = repositories.filter((repo) => repo.stage === "inbox" && repo.sourceStatus === "starred").length;
  const selectedRepo = repositories.find((repo) => String(repo.repoId) === route.repo || repo.name === route.repo);

  let content = null;
  if (catalog) {
    if (route.view === "home") content = <HomeView catalog={catalog} onOpenRepo={openRepo} onOpenLibrary={openLibrary} onNavigate={navigate} />;
    else if (route.view === "inbox") content = <InboxView catalog={catalog} selectedRepoId={route.repo} onSelectRepo={(repo) => updateRoute({ repo: String(repo.repoId) })} onOpenRepo={openRepo} />;
    else if (route.view === "learning") content = <LearningView catalog={catalog} onOpenRepo={openRepo} onOpenLibrary={openLibrary} onOpenCuration={(repo) => navigate("inbox", { repo: String(repo.repoId) })} />;
    else if (route.view === "detail") content = selectedRepo ? <DetailView repo={selectedRepo} repositories={repositories} onBack={() => navigate("library")} onOpenRepo={openRepo} /> : <NotFoundView onBack={() => navigate("library")} />;
    else if (route.view === "about") content = <AboutView catalog={catalog} />;
    else content = <LibraryView catalog={catalog} route={route} onRouteChange={updateRoute} onOpenRepo={openRepo} />;
  }

  return (
    <div className="app-shell">
      <Header
        view={route.view}
        inboxCount={inboxCount}
        onNavigate={(view) => navigate(view)}
        query={route.q}
        onQueryChange={(q) => updateRoute({ q }, "replace")}
        onSearch={(event) => {
          event.preventDefault();
          navigate("library", { category: "all", stage: "all", type: "all", language: "all", tag: "all", source: "starred", archive: "active" });
        }}
      />
      {!catalog && !loadError && <main className="loading-layout" role="status" aria-label="正在装订项目特刊"><div className="loading-title" /><div className="loading-columns"><span /><span /><span /></div></main>}
      {loadError && <main className="load-error" role="alert"><span>DATA / ERROR</span><h1>项目目录没有装订成功</h1><p>{loadError}</p><button type="button" onClick={() => setLoadAttempt((value) => value + 1)}>重新读取</button></main>}
      {content}
    </div>
  );
}
