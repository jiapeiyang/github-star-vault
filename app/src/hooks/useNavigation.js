import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { routeFromUrl, urlForRoute } from "../domain/routing.js";
const LEAVE_MESSAGE="还有未导出的资料修改。离开会丢失这些修改，确定离开吗？";
const leavesDraft=(a,b)=>a.view!==b.view||a.repo!==b.repo;
export function useNavigation(normalize) {
 const [route,setRoute]=useState(()=>routeFromUrl(window.location.href));
 const current=useRef(route), dirty=useRef(false), index=useRef(window.history.state?.starVaultIndex??0), restoring=useRef(false), normalizer=useRef(normalize), previousView=useRef(route.view);
 normalizer.current=normalize;
 const onDirtyChange=useCallback(value=>{dirty.current=value;},[]);
 const updateRoute=useCallback((patch,mode="push",scroll)=>{
   const resetsAnchor=["view","repo","q","topic"].some(key=>Object.hasOwn(patch,key));
   const next=normalizer.current({...current.current,...(resetsAnchor?{anchor:""}:{}),...patch});
   const leaving=leavesDraft(current.current,next);
   if(leaving&&dirty.current&&!window.confirm(LEAVE_MESSAGE))return false;
   if(leaving)dirty.current=false;
   const feedScroll=document.querySelector(".library-feed")?.scrollTop||0;
   const oldState={...window.history.state,starVaultIndex:index.current,starVaultScroll:window.scrollY,starVaultFeedScroll:feedScroll};
   window.history.replaceState(oldState,"");
   const origin=["detail","curation"].includes(next.view)?(["detail","curation"].includes(current.current.view)?oldState.starVaultReturn:{route:current.current,scroll:window.scrollY,feedScroll}):undefined;
   if(mode==="push")index.current+=1;
   const resetScroll=patch.view || Object.hasOwn(patch,"q");
   window.history[mode==="replace"?"replaceState":"pushState"]({starVaultIndex:index.current,starVaultScroll:scroll?.window??(resetScroll?0:window.scrollY),starVaultFeedScroll:scroll?.feed??(resetScroll?0:feedScroll),starVaultReturn:origin},"",urlForRoute(next,window.location.href));
   current.current=next;setRoute(next);return true;
 },[]);
 const returnToBrowse=useCallback(()=>{const saved=window.history.state?.starVaultReturn;updateRoute(saved?.route||{...current.current,view:current.current.topic?"topics":"library",repo:"",anchor:""},"push",{window:saved?.scroll||0,feed:saved?.feedScroll||0});},[updateRoute]);
 useLayoutEffect(()=>{
   if (!route.anchor) {
     window.scrollTo({top:window.history.state?.starVaultScroll||0,behavior:"instant"});
     document.querySelector(".library-feed")?.scrollTo({top:window.history.state?.starVaultFeedScroll||0,behavior:"instant"});
   }
   if(previousView.current!==route.view){const heading=document.querySelector("main h1");if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}previousView.current=route.view;}
 },[route]);
 useEffect(()=>{
   const previousRestoration=window.history.scrollRestoration;window.history.scrollRestoration="manual";
   window.history.replaceState({...window.history.state,starVaultIndex:index.current},"",urlForRoute(current.current,window.location.href));
   const restore=event=>{
     if(restoring.current){restoring.current=false;return;}
     const next=normalizer.current(routeFromUrl(window.location.href)), target=event.state?.starVaultIndex;
     if(leavesDraft(current.current,next)&&dirty.current&&!window.confirm(LEAVE_MESSAGE)){
       if(typeof target==="number"&&target!==index.current){restoring.current=true;window.history.go(index.current-target);}else window.history.replaceState({starVaultIndex:index.current},"",urlForRoute(current.current,window.location.href));
       return;
     }
     if(leavesDraft(current.current,next))dirty.current=false;
     index.current=target??index.current;current.current=next;
     window.history.replaceState({...window.history.state,starVaultIndex:index.current},"",urlForRoute(next,window.location.href));setRoute(next);
   };
   const beforeUnload=event=>{if(dirty.current){event.preventDefault();event.returnValue="";}};
   window.addEventListener("popstate",restore);window.addEventListener("beforeunload",beforeUnload);
   return()=>{window.history.scrollRestoration=previousRestoration;window.removeEventListener("popstate",restore);window.removeEventListener("beforeunload",beforeUnload);};
 },[]);
 return {route,updateRoute,onDirtyChange,returnToBrowse};
}
