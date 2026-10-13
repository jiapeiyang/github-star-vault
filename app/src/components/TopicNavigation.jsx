import { RouteLink } from "./RouteLink.jsx";

export function TopicNavigation({ view, onChange }) {
  return <nav className="topic-navigation" aria-label="专题与任务">
    <RouteLink route={{ view: "topics" }} onChange={onChange} aria-current={view === "topics" ? "page" : undefined}>用途专题</RouteLink>
    <RouteLink route={{ view: "recipes" }} onChange={onChange} aria-current={view === "recipes" ? "page" : undefined}>任务配方</RouteLink>
  </nav>;
}
