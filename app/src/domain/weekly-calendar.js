const WEEKLY_URL = "https://jiapeiyang.github.io/github-star-vault/?view=weekly";
const textValue = value => value.replaceAll("\\", "\\\\").replace(/\r?\n/g, "\\n").replaceAll(";", "\\;").replaceAll(",", "\\,");
const stamp = date => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

// RFC 5545：按 UTF-8 字节数折行，续行空格计入 75 字节上限。
function fold(line) {
  const encoder = new TextEncoder();
  let length = 0, result = "";
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (length + size > 75) { result += "\r\n "; length = 1; }
    result += char; length += size;
  }
  return result;
}

export function weeklyCalendar(now = new Date()) {
  if (!Number.isFinite(now.getTime())) throw new Error("无法确定提醒日期，请检查设备时间");
  const beijing = new Date(now.getTime() + 8 * 3600000);
  const days = (8 - beijing.getUTCDay()) % 7;
  const start = new Date(Date.UTC(beijing.getUTCFullYear(), beijing.getUTCMonth(), beijing.getUTCDate() + days, 12, 30));
  if (start <= now) start.setUTCDate(start.getUTCDate() + 7);
  const end = new Date(start.getTime() + 20 * 60000);
  const description = `给自己 20 分钟，重新翻开一份收藏。\n入口始终打开最近一期；定时出刊可能延迟。\n${WEEKLY_URL}\n导入后可在日历中调整时间或删除整个重复事项。`;
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Star Vault//Weekly Reading//ZH-CN", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", "UID:weekly-reading@jiapeiyang.github.io", `DTSTAMP:${stamp(now)}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    "RRULE:FREQ=WEEKLY;BYDAY=MO", "TRANSP:TRANSPARENT", `SUMMARY:${textValue("重读一份收藏 · Star Vault")}`,
    `DESCRIPTION:${textValue(description)}`, `URL:${WEEKLY_URL}`, "BEGIN:VALARM", "TRIGGER:-PT10M", "ACTION:DISPLAY",
    `DESCRIPTION:${textValue("准备翻开本周收藏特刊")}`, "END:VALARM", "END:VEVENT", "END:VCALENDAR"];
  return { filename: "star-vault-weekly.ics", text: lines.map(fold).join("\r\n") + "\r\n", startsAt: start.toISOString() };
}
