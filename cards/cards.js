async function loadJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Не смог загрузить ${url}: ${res.status}`);
  return await res.json();
}

function chunk(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) node.appendChild(c);
  return node;
}

function renderCard(item, meta) {
  const bg = el("div", { class: "bg", "aria-hidden": "true" });
  if (meta?.backgroundImage) {
    bg.style.setProperty("--bg-image", `url("${meta.backgroundImage}")`);
  }

  const metaNode = el("div", { class: "meta" }, [
    el("div", { class: "label", text: "Правило внутри" }),
    el("div", { class: "tag", text: item.category }),
  ]);

  const internal = el("div", { class: "internal", text: item.text });

  const questions = el("div", { class: "questions" });
  item.questions.forEach((q) => questions.appendChild(el("div", { class: "q", text: q })));

  return el("section", { class: "card" }, [bg, metaNode, internal, questions]);
}

async function renderAll({ mountId, dataUrl }) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  let data;
  try {
    data = await loadJson(dataUrl);
  } catch (e) {
    mount.textContent =
      "Не удалось загрузить cards.json. Открой print.html через локальный сервер (не file://).";
    return;
  }

  const meta = data.meta ?? {};
  if (typeof meta.bgOpacity === "number") {
    document.documentElement.style.setProperty("--bg-opacity", String(meta.bgOpacity));
  }

  const cards = Array.isArray(data.cards) ? data.cards : [];
  const perPage = meta?.layout?.perPage ?? 6;
  const pages = chunk(cards, perPage);
  pages.forEach((pageCards) => {
    const page = el("div", { class: "page" });
    pageCards.forEach((item) => page.appendChild(renderCard(item, meta)));
    mount.appendChild(page);
  });
}

window.Cards = { renderAll };

