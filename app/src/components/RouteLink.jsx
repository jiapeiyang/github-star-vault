import { defaultRoute, shouldHandleLink, urlForRoute } from "../domain/routing.js";

export function RouteLink({ route, onChange, children, ...props }) {
  const target = { ...defaultRoute, ...route };
  return <a {...props} href={urlForRoute(target, window.location.href)} onClick={event => {
    if (onChange && shouldHandleLink(event)) { event.preventDefault(); onChange(target); }
  }}>{children}</a>;
}
