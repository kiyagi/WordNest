(() => {
  const light = ["#f8d7da", "#fde2c5", "#fff1a8", "#d9f7be", "#c7f9e8", "#cceeff", "#dbeafe", "#e8dcff", "#f8d7ee", "#d8f0e5"];
  const dark = ["#3d0c11", "#5b2a00", "#5c4b00", "#1e4d2b", "#004b49", "#073763", "#1e3a8a", "#3b1d6d", "#701a45", "#243447"];
  const lightGradients = ["#ffd6e0|#ffe7b8", "#d6f5ff|#e3dcff", "#d8f7cf|#d4f1f4", "#ffe6bf|#ffd6d6", "#e8ddff|#d4efff", "#fff6b7|#dff7c9", "#d9f4ff|#f1dcff", "#ffe1ee|#ffe9c9", "#d9f4df|#d9e8ff", "#f9d7c8|#f8ecbe"];
  const darkGradients = ["#2c003e|#6a0572", "#001f3f|#005f73", "#3a0d0d|#7f1d1d", "#102a43|#243b53", "#0b3d2e|#14532d", "#4a1d0c|#7c2d12", "#1e1b4b|#312e81", "#3f0d2b|#831843", "#1c1917|#44403c", "#083344|#155e75"];
  const defaults = { background: "linear-gradient(135deg,#fbfdfb,#eef7f2)", button: "#f27961", text: "#183b36", card: "#ffffff" };
  const gradient = value => `linear-gradient(135deg,${value.replace("|", ",")})`;
  const darkBackground = value => dark.includes(value) || darkGradients.some(pair => value.includes(pair.split("|")[0])) || value.startsWith("url(");
  const init = () => {
    const user = localStorage.getItem("wordnest-active-user"), header = document.querySelector("header");
    if (!user || !header || document.querySelector(".style-trigger")) return;
    const key = `wordnest-style-${user}`; let current = { ...defaults };
    try { current = { ...defaults, ...JSON.parse(localStorage.getItem(key) || "{}") }; } catch {}
    const apply = () => { const root = document.documentElement, auto = darkBackground(current.background) ? "#fff" : "#000"; root.style.setProperty("--wn-bg", current.background); root.style.setProperty("--wn-button", current.button); root.style.setProperty("--wn-text", current.text); root.style.setProperty("--wn-card", current.card); root.style.setProperty("--ink", current.text); root.style.setProperty("--wn-auto", auto); };
    const save = () => { localStorage.setItem(key, JSON.stringify(current)); apply(); }; apply();
    const trigger = document.createElement("button"), panel = document.createElement("section"); trigger.className = "style-trigger"; trigger.type = "button"; trigger.textContent = "✦ 风格"; panel.className = "style-panel"; panel.hidden = true;
    const tiles = (values, field, isGradient = false, isTheme = false) => values.map((value, index) => { const actual = isGradient ? gradient(value) : value; return `<button type="button" class="style-swatch" data-value="${encodeURIComponent(actual)}" data-field="${field}" data-theme="${isTheme}" style="background:${actual}" title="预设 ${index + 1}"></button>`; }).join("");
    panel.innerHTML = `<div class="style-panel-head"><div><b>风格工坊</b><small>每个用户名独立保存</small></div><button class="style-close" type="button">×</button></div><div class="style-content"><p>主题 · 10 浅色纯色 + 10 深色纯色</p><div class="style-grid">${tiles(light,"background",false,true)}${tiles(dark,"background",false,true)}</div><p>主题 · 10 浅色渐变 + 10 深色渐变</p><div class="style-grid">${tiles(lightGradients,"background",true,true)}${tiles(darkGradients,"background",true,true)}</div><p>背景</p><div class="style-grid">${tiles(light.concat(dark),"background")}${tiles(lightGradients.concat(darkGradients),"background",true)}</div><p>按钮</p><div class="style-grid">${tiles(light.concat(dark),"button")}</div><p>文字</p><div class="style-grid">${tiles(light.concat(dark),"text")}</div><label class="skin-upload">上传自定义皮肤<input type="file" accept="image/*"></label><button class="style-reset" type="button">恢复默认风格</button></div>`;
    panel.querySelectorAll(".style-swatch").forEach(tile => tile.onclick = () => { const value = decodeURIComponent(tile.dataset.value); current = tile.dataset.theme === "true" ? { ...current, background: value, button: darkBackground(value) ? "#f7c66a" : "#245b4e", text: "#183b36", card: "rgba(255,255,255,.9)" } : { ...current, [tile.dataset.field]: value }; save(); });
    panel.querySelector("input").onchange = event => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { current = { ...current, background: `url("${reader.result}")` }; save(); }; reader.readAsDataURL(file); };
    panel.querySelector(".style-reset").onclick = () => { current = { ...defaults }; save(); }; panel.querySelector(".style-close").onclick = () => panel.hidden = true; trigger.onclick = () => panel.hidden = !panel.hidden; header.append(trigger); document.body.append(panel);
  };
  new MutationObserver(init).observe(document.body, { childList: true, subtree: true }); init();
})();
