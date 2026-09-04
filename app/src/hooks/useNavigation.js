import { useCallback, useEffect, useRef, useState } from "react";
import { routeFromUrl, urlForRoute } from "../domain/routing.js";

const LEAVE_MESSAGE = "还有未导出的策展修改。离开会丢失这些修改，确定离开吗？";
const leavesDraft = (from, to) => from.view !== to.view || from.repo !== to.repo;

export function useNavigation(normalize) {
  const [route, setRoute] = useState(() => routeFromUrl(window.location.href));
  const current = useRef(route);
  const dirty = useRef(false);
  const index = useRef(window.history.state?.starVaultIndex ?? 0);
  const restoring = useRef(false);
  const normalizeRef = useRef(normalize);
  normalizeRef.current = normalize;
  const onDirtyChange = useCallback((value) => { dirty.current = value; }, []);

  const updateRoute = useCallback((patch, mode = "push") => {
    const next = normalizeRef.current({ ...current.current, ...patch });
    const leaving = leavesDraft(current.current, next);
    if (leaving && dirty.current && !window.confirm(LEAVE_MESSAGE)) return false;
    if (leaving) dirty.current = false;
    if (mode === "push") index.current += 1;
    window.history[mode === "replace" ? "replaceState" : "pushState"]({ ...window.history.state, starVaultIndex: index.current }, "", urlForRoute(next, window.location.href));
    current.current = next;
    setRoute(next);
    if (patch.view) window.scrollTo({ top: 0, behavior: "auto" });
    return true;
  }, []);

  useEffect(() => {
    window.history.replaceState({ ...window.history.state, starVaultIndex: index.current }, "");
    const restore = (event) => {
      if (restoring.current) { restoring.current = false; return; }
      const next = normalizeRef.current(routeFromUrl(window.location.href));
      const targetIndex = event.state?.starVaultIndex;
      if (leavesDraft(current.current, next) && dirty.current && !window.confirm(LEAVE_MESSAGE)) {
        // popstate 已移动浏览器历史，取消时回到原条目，不新增假历史。
        if (typeof targetIndex === "number" && targetIndex !== index.current) {
          restoring.current = true;
          window.history.go(index.current - targetIndex);
        } else {
          window.history.replaceState({ starVaultIndex: index.current }, "", urlForRoute(current.current, window.location.href));
        }
        return;
      }
      if (leavesDraft(current.current, next)) dirty.current = false;
      index.current = targetIndex ?? index.current;
      window.history.replaceState({ ...window.history.state, starVaultIndex: index.current }, "", urlForRoute(next, window.location.href));
      current.current = next;
      setRoute(next);
    };
    const beforeUnload = (event) => {
      if (!dirty.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("popstate", restore);
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("popstate", restore);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, []);

  return { route, updateRoute, onDirtyChange };
}
