import { contentOutline } from "./markdown.js";

const text = value => typeof value === "string" && !!value.trim();
const date = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const instant = value => text(value) && Number.isFinite(Date.parse(value));

// 特刊是附加内容；坏档案不应阻止用户搜索原有项目库。
export function getWeeklyCatalog(catalog) {
  const issues = catalog?.weeklyIssues;
  if (issues === undefined) return { issues: [], error: "" };
  const invalid = { issues: [], error: "特刊资料暂不可用，仍可浏览收藏时间线和项目库。" };
  if (!Array.isArray(issues)) return invalid;
  const ids = new Set(), numbers = new Set();
  for (const issue of issues) {
    if (!issue || !date(issue.id) || new Date(issue.id).getUTCDay() !== 1 || ids.has(issue.id)
      || !Number.isSafeInteger(issue.number) || issue.number < 1 || numbers.has(issue.number)
      || !date(issue.weekEnd) || Date.parse(issue.weekEnd) - Date.parse(issue.id) !== 6 * 86400000
      || !instant(issue.generatedAt) || !instant(issue.factsCheckedAt) || issue.selectionVersion !== 1
      || !issue.editorial || !["id", "title", "intro", "question"].every(key => text(issue.editorial[key]))
      || !Array.isArray(issue.entries) || !issue.entries.length || issue.entries.length > 5) return invalid;
    const repos = new Set();
    for (const [index, entry] of issue.entries.entries()) {
      const selection = entry?.selection;
      if (!entry || !Number.isSafeInteger(entry.repoId) || entry.repoId <= 0 || repos.has(entry.repoId)
        || !["lead", "theme", "discovery"].includes(entry.slot) || (entry.slot === "lead") !== (index === 0)
        || !selection || ![selection.name, selection.category, selection.categoryLabel].every(text)
        || !instant(selection.starredAt) || !Number.isSafeInteger(selection.ageDays) || selection.ageDays < 0
        || !(selection.lastFeaturedWeek === null || date(selection.lastFeaturedWeek))) return invalid;
      repos.add(entry.repoId);
    }
    ids.add(issue.id); numbers.add(issue.number);
  }
  return { issues: [...issues].sort((a, b) => b.id.localeCompare(a.id)), error: "" };
}

export function issueEntries(issue, repositories) {
  const byId = new Map(repositories.map(repo => [repo.repoId, repo]));
  return issue.entries.map(entry => {
    const repo = byId.get(entry.repoId);
    const unavailable = !repo ? "此仓库已不在当前目录，保留当期编选记录。" : repo.personalArchived ? "此仓库已个人归档，保留编选记录，不再展示解读。" : "";
    const status = repo?.archived ? "上游现已归档，以下为历史入选内容。" : repo?.sourceStatus === "missing" ? "目前已退出公开 Stars，以下为历史入选内容。" : "";
    return { ...entry, repo: unavailable ? null : repo, unavailable, status };
  });
}

export const issueNumber = issue => String(issue.number).padStart(3, "0");
export const issuePeriod = issue => `${issue.id.replaceAll("-", ".")} — ${issue.weekEnd.slice(5).replaceAll("-", ".")}`;
export function selectionReason(entry) {
  const { ageDays, lastFeaturedWeek } = entry.selection;
  return `${ageDays >= 90 ? "旧收藏重访" : "本期补充"} · 入选时已收藏 ${ageDays} 天 · ${lastFeaturedWeek ? `上次入选 ${lastFeaturedWeek}` : "首次入选特刊"}`;
}

export function issueIsPast(issue, now = new Date()) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  return today > issue.weekEnd;
}

const readingPrompts = {
  "它是什么": "先回想：你会在什么情况下想起它？",
  "适合什么场景": "再判断：它适合解决什么，又有哪些边界？",
  "如何开始": "往前走一步：开始前需要准备什么？",
  "一个使用示例": "读一个例子：输入、关键步骤和结果分别是什么？",
};

// 只摘取原文完整章节，保持“未执行”等证据限定和代码块；不生成新结论。
export function guideReadingSections(markdown = "") {
  const outline = contentOutline(markdown);
  const sections = [];
  let current = null, fence = null, headingIndex = 0;
  for (const line of markdown.split("\n")) {
    const fenceMatch = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1];
      else if (fenceMatch[1][0] === fence[0] && fenceMatch[1].length >= fence.length) fence = null;
      if (current) current.lines.push(line);
      continue;
    }
    if (!fence && /^##\s+/.test(line)) {
      current = { ...outline[headingIndex++], lines: [] };
      sections.push(current);
    } else if (!fence && /^#\s+/.test(line)) {
      current = null;
    } else if (current) current.lines.push(line);
  }
  return sections.filter(section => readingPrompts[section.title] && section.lines.join("\n").trim())
    .map(({ lines, ...section }) => ({ ...section, prompt: readingPrompts[section.title], markdown: lines.join("\n").trim() }));
}
