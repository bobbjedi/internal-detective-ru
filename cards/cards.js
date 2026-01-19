const QUESTIONS_BASE = {
  q1: "1) Где это правило помогает?",
  q2: "2) Где оно мешает или становится опасным?",
  q4: "4) Что будет, если всегда ему следовать?",
  q5: "5) Какой апдейт (новое правило) ты бы придумал?",
};

function defaultQuestionsFor(category) {
  const q3ByCategory = {
    Эмоции: "3) Это про чувство или про поведение?",
    Поведение: "3) Это про безопасность/выбор — или про удобство для других?",
    Успех: "3) Помогает ли оно учиться — или мешает?",
    Границы: "3) Это больше про заботу о себе — или про угождение другим?",
    Контроль: "3) Это про безопасность — или про страх/контроль?",
    Мета: "3) Это мысль про меня — или про других людей?",
  };

  const q3 = q3ByCategory[category] ?? "3) О чём это правило на самом деле?";
  return [QUESTIONS_BASE.q1, QUESTIONS_BASE.q2, q3, QUESTIONS_BASE.q4, QUESTIONS_BASE.q5];
}

function card(category, text, questions = defaultQuestionsFor(category)) {
  return { category, text, questions };
}

const INTERNALS = [
  // 1) Про эмоции
  card("Эмоции", "«Злиться нельзя»"),
  card("Эмоции", "«Плакать стыдно»"),
  card("Эмоции", "«Хорошие дети не обижаются»"),
  card("Эмоции", "«Если мне грустно — со мной что-то не так»"),
  card("Эмоции", "«Сильные не боятся»"),
  card("Эмоции", "«Страх — это плохо»"),
  card("Эмоции", "«Нужно скрывать эмоции»"),
  card("Эмоции", "«Нельзя показывать слабость»"),
  card("Эмоции", "«Если я расстроен, значит я слабый»"),
  card("Эмоции", "«Надо всегда быть спокойным»"),

  // 2) Про поведение
  card("Поведение", "«Всегда слушай старших»", [
    QUESTIONS_BASE.q1,
    QUESTIONS_BASE.q2,
    "3) Это про уважение — или про подчинение?",
    QUESTIONS_BASE.q4,
    QUESTIONS_BASE.q5,
  ]),
  card("Поведение", "«Делай, как сказано»"),
  card("Поведение", "«Не спорь со взрослыми»"),
  card("Поведение", "«Если попросили — надо»"),
  card("Поведение", "«Нельзя отказывать»", [
    QUESTIONS_BASE.q1,
    QUESTIONS_BASE.q2,
    "3) Можно ли отказывать вежливо?",
    QUESTIONS_BASE.q4,
    QUESTIONS_BASE.q5,
  ]),
  card("Поведение", "«Не высовывайся»"),
  card("Поведение", "«Будь удобным»"),
  card("Поведение", "«Не задавай лишних вопросов»"),
  card("Поведение", "«Так принято — значит так надо»"),
  card("Поведение", "«Если правило есть, его нельзя менять»"),

  // 3) Про успех и результат
  card("Успех", "«Ошибаться нельзя»"),
  card("Успех", "«Нужно быть лучшим»"),
  card("Успех", "«Если не получилось — я плохой»"),
  card("Успех", "«Главное — результат»"),
  card("Успех", "«Старайся сильнее, даже если тяжело»"),
  card("Успех", "«Нельзя останавливаться»"),
  card("Успех", "«Если я не справился — это стыдно»"),
  card("Успех", "«Меня любят за успех»"),
  card("Успех", "«Нужно доказывать, что ты молодец»"),
  card("Успех", "«Отдых — для слабых»"),

  // 4) Про отношения и границы
  card("Границы", "«Всегда помогай другим»"),
  card("Границы", "«Нельзя думать о себе»"),
  card("Границы", "«Терпеть — значит быть хорошим»"),
  card("Границы", "«Если друг попросил — нельзя отказать»"),
  card("Границы", "«Не выноси сор из избы»"),
  card("Границы", "«Важно, что подумают другие»"),
  card("Границы", "«Нужно всем нравиться»"),
  card("Границы", "«Сохраняй лицо семьи / группы»"),
  card("Границы", "«Если мне плохо — надо молчать»"),
  card("Границы", "«Мои границы менее важны»"),

  // 5) Про контроль и “силу”
  card("Контроль", "«Должен быть сильным»"),
  card("Контроль", "«Контролируй себя всегда»"),
  card("Контроль", "«Нельзя расслабляться»"),
  card("Контроль", "«Если я устану — это моя проблема»"),
  card("Контроль", "«Просить помощи — стыдно»", [
    QUESTIONS_BASE.q1,
    QUESTIONS_BASE.q2,
    "3) У кого просить помощи безопасно?",
    QUESTIONS_BASE.q4,
    QUESTIONS_BASE.q5,
  ]),
  card("Контроль", "«Нужно терпеть»"),
  card("Контроль", "«Слабость — опасна»"),
  card("Контроль", "«Всегда будь собранным»"),
  card("Контроль", "«Если сорвусь — всё плохо»"),
  card("Контроль", "«Настоящие не ноют»"),

  // Мета-уровень
  card("Мета", "«Моё первое чувство — неправильное»"),
  card("Мета", "«Другие знают лучше меня»"),
  card("Мета", "«Я должен соответствовать»"),
  card("Мета", "«Со мной что-то не так»"),
  card("Мета", "«Если я неудобен — меня не примут»"),
];

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

function renderCard(item, bgUrl) {
  const bg = el("div", { class: "bg", "aria-hidden": "true" });
  bg.style.setProperty("--bg-image", `url("${bgUrl}")`);

  const meta = el("div", { class: "meta" }, [
    el("div", { class: "label", text: "Правило внутри" }),
    el("div", { class: "tag", text: item.category }),
  ]);

  const internal = el("div", { class: "internal", text: item.text });

  const questions = el("div", { class: "questions" });
  item.questions.forEach((q) => questions.appendChild(el("div", { class: "q", text: q })));

  return el("section", { class: "card" }, [bg, meta, internal, questions]);
}

function renderAll({ mountId, bgUrl }) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  const pages = chunk(INTERNALS, 6);
  pages.forEach((cards) => {
    const page = el("div", { class: "page" });
    cards.forEach((item) => page.appendChild(renderCard(item, bgUrl)));
    mount.appendChild(page);
  });
}

window.Cards = { renderAll };

