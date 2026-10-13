import { useState } from "react";
import { CalendarBlank } from "@phosphor-icons/react";
import { weeklyCalendar } from "../domain/weekly-calendar.js";

export function WeeklyReminder() {
  const [status, setStatus] = useState("");
  const download = () => {
    let url;
    try {
      const file = weeklyCalendar();
      url = URL.createObjectURL(new Blob([file.text], { type: "text/calendar;charset=utf-8" }));
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = file.filename;
      document.body.append(anchor); anchor.click(); anchor.remove();
      setStatus("日历文件已准备，请打开下载文件并确认导入；这一步不会自动添加到你的日历。");
    } catch { setStatus("未能下载日历文件，请重试并检查设备时间与下载设置。"); }
    finally { if (url) setTimeout(() => URL.revokeObjectURL(url), 1000); }
  };
  return <section className="weekly-reminder" id="weekly-reminder" aria-labelledby="weekly-reminder-title">
    <h3 id="weekly-reminder-title">每周，给自己留 20 分钟</h3>
    <p>每周一 20:30（北京时间），提前 10 分钟提醒。提醒中的链接始终打开最近一期；新一期尚未发布时，可以重读上一期。</p>
    <button className="secondary-action" type="button" onClick={download}><CalendarBlank size={18}/>下载每周阅读提醒 (.ics)</button>
    <p className="weekly-reminder-help">下载后在日历中确认导入，可调整时间或删除整个重复事项。提醒是否弹出取决于日历设置；重复导入可能产生重复事项。</p>
    <p className="weekly-reminder-status" role="status">{status}</p>
  </section>;
}
