const INTERNALS = [
  // 1) Про эмоции
  { category: "Эмоции", text: "«Злиться нельзя»" },
  { category: "Эмоции", text: "«Плакать стыдно»" },
  { category: "Эмоции", text: "«Хорошие дети не обижаются»" },
  { category: "Эмоции", text: "«Если мне грустно — со мной что-то не так»" },
  { category: "Эмоции", text: "«Сильные не боятся»" },
  { category: "Эмоции", text: "«Страх — это плохо»" },
  { category: "Эмоции", text: "«Нужно скрывать эмоции»" },
  { category: "Эмоции", text: "«Нельзя показывать слабость»" },
  { category: "Эмоции", text: "«Если я расстроен, значит я слабый»" },
  { category: "Эмоции", text: "«Надо всегда быть спокойным»" },

  // 2) Про поведение
  { category: "Поведение", text: "«Всегда слушай старших»" },
  { category: "Поведение", text: "«Делай, как сказано»" },
  { category: "Поведение", text: "«Не спорь со взрослыми»" },
  { category: "Поведение", text: "«Если попросили — надо»" },
  { category: "Поведение", text: "«Нельзя отказывать»" },
  { category: "Поведение", text: "«Не высовывайся»" },
  { category: "Поведение", text: "«Будь удобным»" },
  { category: "Поведение", text: "«Не задавай лишних вопросов»" },
  { category: "Поведение", text: "«Так принято — значит так надо»" },
  { category: "Поведение", text: "«Если правило есть, его нельзя менять»" },

  // 3) Про успех и результат
  { category: "Успех", text: "«Ошибаться нельзя»" },
  { category: "Успех", text: "«Нужно быть лучшим»" },
  { category: "Успех", text: "«Если не получилось — я плохой»" },
  { category: "Успех", text: "«Главное — результат»" },
  { category: "Успех", text: "«Старайся сильнее, даже если тяжело»" },
  { category: "Успех", text: "«Нельзя останавливаться»" },
  { category: "Успех", text: "«Если я не справился — это стыдно»" },
  { category: "Успех", text: "«Меня любят за успех»" },
  { category: "Успех", text: "«Нужно доказывать, что ты молодец»" },
  { category: "Успех", text: "«Отдых — для слабых»" },

  // 4) Про отношения и границы
  { category: "Границы", text: "«Всегда помогай другим»" },
  { category: "Границы", text: "«Нельзя думать о себе»" },
  { category: "Границы", text: "«Терпеть — значит быть хорошим»" },
  { category: "Границы", text: "«Если друг попросил — нельзя отказать»" },
  { category: "Границы", text: "«Не выноси сор из избы»" },
  { category: "Границы", text: "«Важно, что подумают другие»" },
  { category: "Границы", text: "«Нужно всем нравиться»" },
  { category: "Границы", text: "«Сохраняй лицо семьи / группы»" },
  { category: "Границы", text: "«Если мне плохо — надо молчать»" },
  { category: "Границы", text: "«Мои границы менее важны»" },

  // 5) Про контроль и “силу”
  { category: "Контроль", text: "«Должен быть сильным»" },
  { category: "Контроль", text: "«Контролируй себя всегда»" },
  { category: "Контроль", text: "«Нельзя расслабляться»" },
  { category: "Контроль", text: "«Если я устану — это моя проблема»" },
  { category: "Контроль", text: "«Просить помощи — стыдно»" },
  { category: "Контроль", text: "«Нужно терпеть»" },
  { category: "Контроль", text: "«Слабость — опасна»" },
  { category: "Контроль", text: "«Всегда будь собранным»" },
  { category: "Контроль", text: "«Если сорвусь — всё плохо»" },
  { category: "Контроль", text: "«Настоящие не ноют»" },

  // Мета-уровень
  { category: "Мета", text: "«Моё первое чувство — неправильное»" },
  { category: "Мета", text: "«Другие знают лучше меня»" },
  { category: "Мета", text: "«Я должен соответствовать»" },
  { category: "Мета", text: "«Со мной что-то не так»" },
  { category: "Мета", text: "«Если я неудобен — меня не примут»" },
];

const QUESTIONS_BASE = {
  q1: "1) Где это правило помогает?",
  q2: "2) Где оно мешает или становится опасным?",
  q4: "4) Что будет, если всегда ему следовать?",
  q5: "5) Какой апдейт (новое правило) ты бы придумал?",
};

const Q3_BY_CATEGORY = {
  Эмоции: "3) Это про чувство или про поведение?",
  Поведение: "3) Это про безопасность/выбор — или про удобство для других?",
  Успех: "3) Помогает ли оно учиться — или мешает?",
  Границы: "3) Это больше про заботу о себе — или про угождение другим?",
  Контроль: "3) Это про безопасность — или про страх/контроль?",
  Мета: "3) Это мысль про меня — или про других людей?",
};

const QUESTIONS_OVERRIDE_BY_TEXT = {
  "«Всегда слушай старших»": [
    QUESTIONS_BASE.q1,
    QUESTIONS_BASE.q2,
    "3) Это про уважение — или про подчинение?",
    QUESTIONS_BASE.q4,
    QUESTIONS_BASE.q5,
  ],
  "«Нельзя отказывать»": [
    QUESTIONS_BASE.q1,
    QUESTIONS_BASE.q2,
    "3) Можно ли отказывать вежливо?",
    QUESTIONS_BASE.q4,
    QUESTIONS_BASE.q5,
  ],
  "«Просить помощи — стыдно»": [
    QUESTIONS_BASE.q1,
    QUESTIONS_BASE.q2,
    "3) У кого просить помощи безопасно?",
    QUESTIONS_BASE.q4,
    QUESTIONS_BASE.q5,
  ],
};

function getQuestions(item) {
  const override = QUESTIONS_OVERRIDE_BY_TEXT[item.text];
  if (override) return override;

  const q3 = Q3_BY_CATEGORY[item.category] ?? "3) О чём это правило на самом деле?";
  return [QUESTIONS_BASE.q1, QUESTIONS_BASE.q2, q3, QUESTIONS_BASE.q4, QUESTIONS_BASE.q5];
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

function renderCard(item, bgUrl) {
  const bg = el("div", { class: "bg", "aria-hidden": "true" });
  bg.style.setProperty("--bg-image", `url("${bgUrl}")`);

  const meta = el("div", { class: "meta" }, [
    el("div", { class: "label", text: "Правило внутри" }),
    el("div", { class: "tag", text: item.category }),
  ]);

  const internal = el("div", { class: "internal", text: item.text });

  const questions = el("div", { class: "questions" });
  getQuestions(item).forEach((q) =>
    questions.appendChild(el("div", { class: "q", text: q })),
  );

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

