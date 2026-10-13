import { useEffect, useState } from "react";
import { basketStorageKey, emptyBasket, readBasket, STORAGE_WARNING, TASK_BRIEF_LIMIT, toggleCandidate } from "../domain/candidate-basket.js";

export function useCandidateBasket() {
  const key = basketStorageKey(import.meta.env.BASE_URL);
  const [state, setState] = useState(() => ({ ...readBasket(() => window.sessionStorage, key), changed: false, message: "", error: "" }));

  useEffect(() => {
    // 不在首次渲染覆盖损坏或未知版本，用户开始新操作后才写入。
    if (!state.changed || !state.storageAvailable) return;
    try { window.sessionStorage.setItem(key, JSON.stringify(state.basket)); }
    catch { setState(current => ({ ...current, warning: STORAGE_WARNING, storageAvailable: false })); }
  }, [key, state.basket, state.changed, state.storageAvailable]);

  const toggle = repo => setState(current => {
    const { basket, error } = toggleCandidate(current.basket, repo.repoId);
    if (error) return { ...current, error, message: "" };
    return { ...current, basket, changed: true, error: "", warning: current.storageAvailable ? "" : current.warning,
      message: `${basket.repoIds.includes(repo.repoId) ? "已加入" : "已移除"} ${repo.name || `项目 ${repo.repoId}`}。当前 ${basket.repoIds.length} 个候选。` };
  });
  const changeBrief = value => setState(current => {
    if (value.length > TASK_BRIEF_LIMIT) return { ...current, error: "任务说明最多 2,000 字符。" };
    return { ...current, basket: { ...current.basket, taskBrief: value }, changed: true, error: "", warning: current.storageAvailable ? "" : current.warning };
  });
  const clear = () => setState(current => ({ ...current, basket: emptyBasket(), changed: true, error: "", message: "已清空候选与任务说明。", warning: current.storageAvailable ? "" : current.warning }));

  return { ...state.basket, warning: state.warning, error: state.error, message: state.message, toggle, changeBrief, clear };
}
