import { defaultRoute, shouldHandleLink, urlForRoute } from "../domain/routing.js";
export function TopicLink({topic="",onChange,children,...props}) {
  const route={...defaultRoute,view:"topics",topic};
  return <a {...props} href={urlForRoute(route,window.location.href)} onClick={event=>{
    if(onChange&&shouldHandleLink(event)){event.preventDefault();onChange(route);}
  }}>{children}</a>;
}
