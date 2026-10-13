import { Check, Plus } from "@phosphor-icons/react";

export function CandidateButton({ repo, basket }) {
  if (!basket) return null;
  const selected = basket.repoIds.includes(repo.repoId);
  return <button type="button" className="candidate-button" aria-pressed={selected}
    aria-label={`${selected ? "移出" : "加入"}候选：${repo.name}`} onClick={() => basket.toggle(repo)}>
    {selected ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
    {selected ? "已加入候选" : "加入候选"}
  </button>;
}
