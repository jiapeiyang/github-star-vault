import { routeFromUrl, shouldHandleLink, urlForRoute } from "../domain/routing.js";

export function RepoLink({repoId, anchor = "", onOpen, children, ...props}) {
  const current = routeFromUrl(window.location.href);
  const href = urlForRoute({...current, view:"detail", repo:String(repoId), anchor}, window.location.href);
  return <a {...props} href={href} onClick={event => {
    if (onOpen && shouldHandleLink(event)) { event.preventDefault();onOpen(repoId, anchor); }
  }}>{children}</a>;
}
