import { useEffect, useState } from "react";
import { Header } from "./components/Header.jsx";
import { loadCatalog } from "./domain/catalog.js";
import { defaultRoute } from "./domain/routing.js";
import { getInboxState } from "./domain/inbox.js";
import { useNavigation } from "./hooks/useNavigation.js";
import { CurationView } from "./views/CurationView.jsx";
import { AboutView } from "./views/AboutView.jsx";
import { DetailView } from "./views/DetailView.jsx";
import { HomeView } from "./views/HomeView.jsx";
import { InboxView } from "./views/InboxView.jsx";
import { HistoryView } from "./views/HistoryView.jsx";
import { LibraryView } from "./views/LibraryView.jsx";
import { TopicsView } from "./views/TopicsView.jsx";
import { NotFoundView } from "./views/NotFoundView.jsx";

export function App() {
  const [catalog, setCatalog] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const { route, updateRoute, onDirtyChange, returnToBrowse } = useNavigation((next) => catalog && next.view === "inbox" ? getInboxState(catalog.repositories, next).route : next);

  useEffect(() => {
    let active = true;
    setLoadError("");
    loadCatalog().then((value) => active && setCatalog(value)).catch((error) => active && setLoadError(error.message));
    return () => { active = false; };
  }, [loadAttempt]);

  useEffect(() => {
    if (catalog && route.view === "inbox") {
      const normalized = getInboxState(catalog.repositories, route).route;
      if (JSON.stringify(normalized) !== JSON.stringify(route)) updateRoute(normalized, "replace");
    }
  }, [catalog, route, updateRoute]);

  useEffect(() => {
    if (catalog && route.anchor) document.getElementById(route.anchor)?.scrollIntoView({behavior:"instant"});
  }, [catalog, route]);

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

  const navigate = (view, patch = {}) => updateRoute({ ...defaultRoute, view, ...(view === "history" ? { source: "all" } : {}), ...patch });
  const openRepo = (repoOrId, anchor = "") => {
    const repoId = typeof repoOrId === "object" ? repoOrId.repoId : repoOrId;
    updateRoute({ view: "detail", repo: String(repoId), anchor });
  };
  const openCuration = (repo) => updateRoute({ view: "curation", repo: String(repo.repoId) });
  const openLibrary = (patch = {}) => navigate("library", { ...defaultRoute, view: "library", ...patch });

  const repositories = catalog?.repositories || [];
  const selectedRepo = repositories.find((repo) => String(repo.repoId) === route.repo || repo.name === route.repo);

  useEffect(() => {
    const pageTitles={home:"收藏资料库",library:route.q?`搜索：${route.q}`:"项目库",history:"收藏回顾",topics:catalog?.topics?.find(t=>t.id===route.topic)?.title||"用途专题",about:"关于",inbox:"资料维护"};
    const title=["detail","curation"].includes(route.view) ? selectedRepo?.name||"仓库详情" : pageTitles[route.view];
    document.title=`${title || "收藏资料库"} · Star Vault`;
  },[catalog,route.view,route.repo,route.q,route.topic,selectedRepo?.name]);

  let content = null;
  if (catalog) {
    if (route.view === "home") content = <HomeView catalog={catalog} onOpenRepo={openRepo} onOpenLibrary={openLibrary} onNavigate={navigate} />;
    else if (route.view === "inbox") content = <InboxView catalog={catalog} route={route} onRouteChange={updateRoute} onOpenRepo={openRepo} onDirtyChange={onDirtyChange} />;
    else if (route.view === "topics") content = <TopicsView catalog={catalog} route={route} onRouteChange={updateRoute} onOpenRepo={openRepo}/>;
    else if (route.view === "history") content = <HistoryView catalog={catalog} route={route} onRouteChange={updateRoute} onOpenRepo={openRepo} />;
    else if (route.view === "detail") content = selectedRepo ? <DetailView repo={selectedRepo} query={route.q} repositories={repositories} onBack={returnToBrowse} onOpenRepo={openRepo} onOpenCuration={openCuration} /> : <NotFoundView onBack={() => navigate("library")} />;
    else if (route.view === "curation") content = selectedRepo ? <CurationView repo={selectedRepo} catalog={catalog} onOpenRepo={openRepo} onDirtyChange={onDirtyChange} /> : <NotFoundView onBack={() => navigate("library")} />;
    else if (route.view === "about") content = <AboutView catalog={catalog} onNavigate={navigate} />;
    else content = <LibraryView catalog={catalog} route={route} onRouteChange={updateRoute} onOpenRepo={openRepo} />;
  }

  return (
    <div className="app-shell">
      <Header
        view={route.view}
        onNavigate={(view) => navigate(view)}
        query={route.q}
        onQueryChange={(q) => updateRoute({ q }, "replace")}
        onSearch={(event) => {
          event.preventDefault();
          if (!["library", "history"].includes(route.view)) navigate("library", { q: route.q });
        }}
      />
      {!catalog && !loadError && <main className="loading-layout" role="status" aria-label="正在装订项目特刊"><div className="loading-title" /><div className="loading-columns"><span /><span /><span /></div></main>}
      {loadError && <main className="load-error" role="alert"><span>DATA / ERROR</span><h1>项目目录没有装订成功</h1><p>{loadError}</p><button type="button" onClick={() => setLoadAttempt((value) => value + 1)}>重新读取</button></main>}
      {content}
    </div>
  );
}
