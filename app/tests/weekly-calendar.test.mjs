import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { weeklyCalendar } from "../src/domain/weekly-calendar.js";

const unfold = text => text.replaceAll("\r\n ", "");

test("calendar schedules the next Monday at 20:30 Beijing across week and year boundaries", () => {
  const cases = [
    ["2026-10-13T15:00:00Z", "2026-10-19T12:30:00.000Z"],
    ["2026-10-18T15:59:59Z", "2026-10-19T12:30:00.000Z"],
    ["2026-10-18T16:00:00Z", "2026-10-19T12:30:00.000Z"],
    ["2026-10-19T12:29:59Z", "2026-10-19T12:30:00.000Z"],
    ["2026-10-19T12:30:00Z", "2026-10-26T12:30:00.000Z"],
    ["2026-12-31T16:00:00Z", "2027-01-04T12:30:00.000Z"],
  ];
  for (const [now, expected] of cases) assert.equal(weeklyCalendar(new Date(now)).startsAt, expected);
  assert.throws(() => weeklyCalendar(new Date("invalid")), /提醒日期/);
});

test("calendar preserves UTF-8, CRLF, a stable UID, duration, alarm and a latest-issue URL", () => {
  const first = weeklyCalendar(new Date("2026-10-13T10:00:00Z"));
  const next = weeklyCalendar(new Date("2026-10-20T10:00:00Z"));
  assert.equal(first.filename, "star-vault-weekly.ics");
  assert.equal(first.text.replaceAll("\r\n", "").includes("\n"), false);
  assert.ok(first.text.split("\r\n").every(line => Buffer.byteLength(line, "utf8") <= 75));
  assert.ok(first.text.includes("\r\n "), "Chinese description should be folded");
  const source = unfold(first.text);
  assert.ok(source.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n"));
  assert.ok(source.endsWith("END:VEVENT\r\nEND:VCALENDAR\r\n"));
  assert.match(source, /DTSTART:20261019T123000Z\r\nDTEND:20261019T125000Z/);
  assert.match(source, /RRULE:FREQ=WEEKLY;BYDAY=MO/);
  assert.match(source, /TRIGGER:-PT10M/);
  assert.match(source, /URL:https:\/\/jiapeiyang.github.io\/github-star-vault\/\?view=weekly\r\n/);
  assert.ok(!source.includes("issue=") && !source.includes("localhost"));
  assert.ok(source.includes("\\n入口始终打开最近一期"));
  assert.equal(source.match(/^UID:.+$/m)[0], unfold(next.text).match(/^UID:.+$/m)[0]);
});

test("the exact editorial example produces the documented order in Node", { timeout: 1500 }, async () => {
  const article = readFileSync(new URL("../../content/weekly/2026-10-12.md", import.meta.url), "utf8");
  const example = article.match(/```js\n([\s\S]*?)\n```/)[1];
  const result = [];
  await new Promise(resolve => {
    runInNewContext(example, { Promise, queueMicrotask, setTimeout, console: { log(value) {
      result.push(value);
      if (value === "B：定时器") resolve();
    } } });
  });
  assert.deepEqual(result, ["A：同步开始", "E：同步结束", "C：Promise 回调", "D：追加的微任务", "B：定时器"]);
});
