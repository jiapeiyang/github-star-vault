import { useEffect, useState } from "react";
import { Asterisk, List, MagnifyingGlass, X } from "@phosphor-icons/react";
import { assetUrl } from "../domain/catalog.js";

export function Header({ view, inboxCount, onNavigate, query, onQueryChange, onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);
  const navigate = (next) => { setMenuOpen(false); onNavigate(next); };
  const items = [["home", "首页"], ["library", "项目库"], ["inbox", `收件箱 ${inboxCount}`], ["learning", "学习"], ["about", "关于"]];

  return (
    <header className="magazine-header">
      <button className="wordmark" type="button" onClick={() => navigate("home")} aria-label="返回 Star Vault 首页"><span>STAR VAULT</span><Asterisk weight="bold" aria-hidden="true" /></button>
      <nav className={menuOpen ? "header-nav is-open" : "header-nav"} aria-label="主导航">
        {items.map(([id, label]) => <button className={view === id || (id === "library" && ["detail", "curation"].includes(view)) ? "is-current" : ""} type="button" onClick={() => navigate(id)} key={id}>{label}</button>)}
      </nav>
      <form className="masthead-search" onSubmit={onSearch}>
        <MagnifyingGlass size={20} aria-hidden="true" /><label className="sr-only" htmlFor="masthead-query">搜索项目</label>
        <input id="masthead-query" type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="搜索项目、标签或个人判断" /><kbd>⌘ K</kbd>
      </form>
      <div className="profile-lockup"><img src={assetUrl("assets/avatars/jiapeiyang.webp")} alt="jiapeiyang 的 GitHub 头像" /><div><strong>jiapeiyang</strong><span>个人开源年鉴</span></div></div>
      <button className="menu-toggle" type="button" onClick={() => setMenuOpen((current) => !current)} aria-expanded={menuOpen} aria-label={menuOpen ? "关闭导航" : "打开导航"}>{menuOpen ? <X size={22} aria-hidden="true" /> : <List size={23} aria-hidden="true" />}</button>
    </header>
  );
}
