import { formatDate } from "../domain/catalog.js";
export function SourceNotice({repo}) {
  const status=repo.sourceCheck?.status;
  return <>
    {repo.guideStatus==="limited"&&<p className="guide-status-notice">资料受限 · {repo.guideLimitation}</p>}
    {["changed","unavailable"].includes(status)&&<p className="source-review-notice">{status==="changed"?"README 与已读版本不同，介绍等待复核。":"本次未能读取 README，尚不能判断介绍是否有变化。"}{repo.sourceCheck.checked_at&&` 检查于 ${formatDate(repo.sourceCheck.checked_at)}。`}</p>}
  </>;
}
