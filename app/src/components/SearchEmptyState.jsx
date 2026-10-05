import { filterRecoveryOptions } from "../domain/filters.js";

export function SearchEmptyState({ repositories, route, onChange, history = false }) {
  const options = filterRecoveryOptions(repositories, route);
  return <section className="empty-state search-empty" aria-label="搜索调整建议">
    <h2>{history ? "这个范围没有收藏记录" : "没有匹配的项目"}</h2>
    <p>{options.length ? "保留关键词和其他条件，试着移除一个筛选：" : "单独移除一个筛选仍没有结果。可以缩短关键词，或逐项检查筛选条件。"}</p>
    {options.length > 0 && <ul className="filter-recovery-options">{options.map(option => <li key={option.key}>
      <button type="button" onClick={() => onChange(option.patch)} aria-label={`移除${option.label}，显示 ${option.count} 个项目`}>
        <span>移除{option.label}</span><strong>{option.count} 个项目</strong>
      </button>
    </li>)}</ul>}
  </section>;
}
