export function NotFoundView({ onBack }) {
  return <main className="load-error"><span>404 / NOT FOUND</span><h1>没有找到这个项目</h1><p>它可能已改名、退出公开 Stars，或 URL 中的 repo_id 不存在。</p><button type="button" onClick={onBack}>返回项目库</button></main>;
}
