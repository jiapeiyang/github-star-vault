import { RouteLink } from "./RouteLink.jsx";

export function HistoryNavigation({ view, onChange }) {
  return <nav className="topic-navigation history-navigation" aria-label="收藏回顾方式">
    <RouteLink route={{ view: "weekly" }} onChange={onChange} aria-current={view === "weekly" ? "page" : undefined}>每周特刊</RouteLink>
    <RouteLink route={{ view: "history", source: "all" }} onChange={onChange} aria-current={view === "history" ? "page" : undefined}>收藏时间线</RouteLink>
  </nav>;
}
