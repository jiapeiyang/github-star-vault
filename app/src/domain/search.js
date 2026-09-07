import { contentOutline } from "./markdown.js";

// 人工维护的用途词；只扩展完整的查询词，不做推断或自动分类。
export const SEARCH_ALIASES = [
  ["ppt", "幻灯片", "演示文稿"], ["cli", "命令行"],
  ["ocr", "文字识别", "文本识别"], ["workflow", "工作流"],
  ["agent", "智能体"], ["font", "fonts", "字体"],
  ["screenshot", "截图"], ["terminal", "终端"],
];
export const normalizeText = (value = "") => String(value).normalize("NFKC").toLocaleLowerCase("zh-CN");
export const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function queryWords(query = "") { return [...new Set(normalizeText(query).trim().split(/\s+/).filter(Boolean))]; }
export function queryGroups(query) {
  const seen = new Set();
  return queryWords(query).flatMap(word => {
    const alternatives = SEARCH_ALIASES.find(group => group.includes(word)) || [word];
    const key = alternatives.join("|");
    if (seen.has(key)) return [];
    seen.add(key);
    return [{word, alternatives}];
  });
}
function includesAlternative(text, alternative, original) {
  if (alternative === original || !/^[a-z]+$/.test(alternative)) return text.includes(alternative);
  return new RegExp(`(^|[^a-z0-9])${escapeRegex(alternative)}([^a-z0-9]|$)`, "i").test(text);
}
export function groupMatches(text, group) {
  const normalized = normalizeText(text);
  return group.alternatives.some(term => includesAlternative(normalized, term, group.word));
}
export function scoreRepository(repo, groups, query) {
  if (!groups.length) return 0;
  const fields = [
    [repo.name, 240], [[...(repo.tags || []), ...(repo.topics || [])].join(" "), 130],
    [repo.summary, 110], [repo.description, 65],
    [[repo.owner, repo.language, repo.categoryLabel, repo.resourceType].join(" "), 40],
    [repo.contentMarkdown, 8],
  ].map(([value, weight]) => [normalizeText(value || ""), weight]);
  let score = 0;
  for (const group of groups) {
    const found = fields.find(([text]) => group.alternatives.some(term => includesAlternative(text, term, group.word)));
    if (!found) return -1;
    score += found[1];
  }
  const full = normalizeText(repo.name), leaf = full.split("/").at(-1), phrase = normalizeText(query).trim();
  if (full === phrase || leaf === phrase) score += 2000;
  else if (leaf.startsWith(phrase)) score += 300;
  return score;
}
export function highlightParts(text, query) {
  const groups = queryGroups(query);
  if (!groups.length) return [{text: String(text), matched: false}];
  const terms = [...new Set(groups.flatMap(g => g.alternatives))].sort((a,b) => b.length-a.length);
  const regex = new RegExp(terms.map(escapeRegex).join("|"), "gi");
  const value = String(text), pieces = []; let cursor = 0;
  for (const match of value.matchAll(regex)) {
    const term = match[0].toLowerCase();
    const direct = groups.some(g => g.word === term);
    const before = value[match.index-1] || "", after = value[match.index+match[0].length] || "";
    if (!direct && /^[a-z]+$/.test(term) && (/[a-z0-9]/i.test(before) || /[a-z0-9]/i.test(after))) continue;
    if (match.index > cursor) pieces.push({text:value.slice(cursor,match.index),matched:false});
    pieces.push({text:match[0],matched:true});cursor=match.index+match[0].length;
  }
  if (cursor < value.length) pieces.push({text:value.slice(cursor),matched:false});
  return pieces.length ? pieces : [{text:value,matched:false}];
}
function plainText(value) { return value.replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/[#*`>]/g,"").replace(/\s+/g," ").trim(); }
export function searchMatch(repo, query) {
  const groups = queryGroups(query), summary = repo.summary || repo.description || "";
  if (!groups.length) return {text:summary, anchor:"", section:""};
  const markdown = repo.contentMarkdown || "", outline = contentOutline(markdown);
  let section = {id:"",title:""}, outlineIndex = 0, fenced = false, best = null, paragraph = [];
  const flush = () => {
    const text = plainText(paragraph.join(" ")); paragraph = [];
    const count = groups.filter(g => groupMatches(text,g)).length;
    if (!count) return;
    if (!best || count > best.count) best = {text,count,anchor:section.id,section:section.title};
  };
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) { fenced=!fenced;continue; }
    if (!fenced && /^##\s+/.test(line)) { flush();section=outline[outlineIndex++] || {id:"",title:""};continue; }
    if (!line.trim()) flush(); else paragraph.push(line);
  }
  flush();
  if (!best) return {text:summary,anchor:"",section:""};
  const summaryHits = groups.filter(g=>groupMatches(summary,g)).length;
  const text = summaryHits >= best.count ? summary : best.text;
  const first = highlightParts(text,query); let matchIndex=0;
  for (const part of first) { if(part.matched)break;matchIndex+=part.text.length; }
  const start=Math.max(0,matchIndex-35);
  return {...best,text:`${start?"…":""}${text.slice(start,start+170)}${text.length>start+170?"…":""}`};
}
