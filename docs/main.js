const { createApp } = Vue;

const GameCard = {
  props: ["card", "currentIndex", "total"],
  emits: ["prev", "next", "finish", "complete"],
  data() {
    return {
      showScrollHint: false,
    };
  },
  computed: {
    isLastCard() {
      return this.currentIndex >= this.total - 1;
    },
  },
  methods: {
    updateScrollHint() {
      const list = this.$refs.qList;
      if (!list) {
        return;
      }
      const hasOverflow = list.scrollHeight > list.clientHeight + 1;
      const remaining = list.scrollHeight - list.scrollTop - list.clientHeight;
      this.showScrollHint = hasOverflow && remaining > 2;
    },
    scrollToBottom() {
      const list = this.$refs.qList;
      if (!list) {
        return;
      }
      list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
    },
    handleNextOrComplete() {
      if (this.isLastCard) {
        this.$emit("complete");
      } else {
        this.$emit("next");
      }
    },
  },
  mounted() {
    this.$nextTick(this.updateScrollHint);
  },
  updated() {
    this.$nextTick(this.updateScrollHint);
  },
  template: `
    <div class="game">
      <div class="game__top">
        <button class="btn btn--ghost btn--compact" @click="$emit('finish')">Завершить</button>
        <div class="progress">
          <div class="progress__bar">
            <div class="progress__fill" :style="{ width: (currentIndex + 1) / total * 100 + '%' }"></div>
          </div>
          <div class="progress__text">{{ currentIndex + 1 }} / {{ total }}</div>
        </div>
        <div class="badge">{{ card.category }}</div>
      </div>

      <article class="card card--fullscreen">
        <div class="card__title">{{ card.text }}</div>
        <ol class="q" ref="qList" @scroll="updateScrollHint">
          <li v-for="q in card.questions" :key="q">{{ q }}</li>
        </ol>
        <button
          v-if="showScrollHint"
          class="scroll-hint"
          type="button"
          @click="scrollToBottom"
          aria-label="Прокрутить вниз"
        ></button>
      </article>

      <div class="nav-buttons nav-buttons--fullscreen">
        <button 
          class="btn btn--full" 
          @click="$emit('prev')"
          :disabled="currentIndex === 0"
        >
          Предыдущая
        </button>
        <button 
          class="btn btn--primary btn--full" 
          @click="handleNextOrComplete"
        >
          {{ isLastCard ? 'Завершить' : 'Следующая' }}
        </button>
      </div>
    </div>
  `,
};

const GameSettings = {
  props: ["categories", "selectedCategories", "count", "cardCount"],
  emits: ["update:selectedCategories", "update:count", "start"],
  methods: {
    toggleCategory(cat) {
      const newSet = new Set(this.selectedCategories);
      if (newSet.has(cat)) {
        newSet.delete(cat);
      } else {
        newSet.add(cat);
      }
      this.$emit("update:selectedCategories", Array.from(newSet));
    },
  },
  template: `
    <section class="panel panel--hero">
      <div class="hero">
        <div class="hero__left">
          <h1 class="hero__title">Начать игру</h1>
          <p class="hero__text">
            Тяни карточки, отвечай на вопросы и придумывай обновлённые правила.
          </p>
        </div>
        <div class="hero__right">
          <div class="stat">
            <div class="stat__title">Колода</div>
            <div class="stat__value">{{ cardCount }}</div>
            <div class="stat__hint">карточек</div>
          </div>
        </div>
      </div>

      <div class="controls">
        <div class="field">
          <label class="field__label" for="count">Сколько карточек в партии</label>
          <select 
            id="count" 
            class="field__control" 
            :value="count"
            @change="$emit('update:count', Number($event.target.value))"
          >
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="field">
          <div class="field__label">Категории</div>
          <div class="chips">
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              class="chip"
              :class="{ 'is-active': selectedCategories.includes(cat) }"
              @click="toggleCategory(cat)"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="field field--actions">
          <button class="btn btn--primary" @click="$emit('start')" type="button">Начать</button>
        </div>
      </div>
    </section>
  `,
};

const RulesSection = {
  props: ["title", "content"],
  template: `
    <section class="panel">
      <h2 class="h2">{{ title }}</h2>
      <div class="rules" v-html="content"></div>
    </section>
  `,
};

createApp({
  components: {
    GameCard,
    GameSettings,
    RulesSection,
  },
  data() {
    return {
      view: "play", // play, game, kids, parents
      cards: [],
      categories: [],
      selectedCategories: [],
      count: 5,
      deck: [],
      currentIndex: 0,
      loading: true,
      error: null,
      showSuccess: false,
    };
  },
  computed: {
    cardCount() {
      return this.cards.length;
    },
    filteredCards() {
      if (this.selectedCategories.length === 0) {
        return this.cards;
      }
      return this.cards.filter((card) => this.selectedCategories.includes(card.category));
    },
    currentCard() {
      return this.deck[this.currentIndex] || null;
    },
    kidsContent() {
      return `
        <p class="sub">Что это за игра и зачем она нужна (версия для ребёнка).</p>
        <p>Внутри нашей головы есть нарушители‑правила. Ты детектив - должен найти и разоблачить их!</p>

        <h3>Что такое интернал</h3>
        <div class="box">
          <p>
            <b>Интернал</b> — это мысль‑правило в голове, которая срабатывает сама, без проверки:
          </p>
          <ul>
            <li>«надо так»</li>
            <li>«нельзя вот так»</li>
            <li>«если сделаю иначе — будет плохо»</li>
          </ul>
          <p class="muted">
            Просто как автопилот: он быстро реагирует, пока ты ещё не подумал.
          </p>
        </div>

        <h3>Откуда берётся автопилот</h3>
        <div class="box">
          <p>Когда-то:</p>
          <ul>
            <li>взрослые так сказали</li>
            <li>кто-то показал пример</li>
            <li>ты так сделал — и тебя похвалили (или не поругали)</li>
          </ul>
          <p>
            И мозг решил: «О, значит так правильно. Запомню надолго».
          </p>
          <p class="muted">
            Потом автопилот включается сам, не спрашивает и не проверяет ситуацию.
          </p>
        </div>

        <h3>Как интернал работает</h3>
        <div class="box">
          <p><b>Схема:</b> Ситуация → мысль‑автомат → чувство → поступок</p>
          <p class="muted">
            Пример: Друг толкнул → «Если я покажу обиду — я слабый» → злость внутри → молчу и делаю вид, что всё ок.
          </p>
          <p>
            Важно: <b>ты не плохой и не глупый</b>. Просто автомат включился быстрее, чем ты успел подумать.
          </p>
        </div>

        <h3>Зачем эта игра</h3>
        <div class="box">
          <p>
            Потому что <b>не все правила подходят для всех ситуаций</b>. Некоторые правила были полезны раньше,
            а теперь мешают.
          </p>
          <p>
            Ты растёшь, начинаешь понимать более сложные вещи — и тебе уже можно не просто действовать «по указке»,
            а <b>думать и выбирать</b>, как лучше.
          </p>
          <p class="muted">
            Это как одежда, из которой ты вырос: когда-то она была в самый раз, а сейчас жмёт — но ты всё ещё пытаешься
            в неё влезть.
          </p>
          <p>Если автопилот не проверять, можно часто:</p>
          <ul>
            <li>злиться и не понимать почему</li>
            <li>обижаться, но молчать</li>
            <li>делать «потому что надо», а потом жалеть</li>
          </ul>
          <p>
            Интернал — <b>не враг</b>. Это просто старое правило, которое давно не обновляли.
          </p>
        </div>

        <h3>Что значит «проработать интернал»</h3>
        <div class="box">
          <p><b>Это не</b>: убрать, запретить, сломать.</p>
          <p><b>Это</b>: посмотреть на него и решить — он мне сейчас помогает или мешает?</p>
          <p>
            Мы не делим интерналы на «хорошие/плохие». Мы <b>перенастраиваем автопилот</b>, чтобы он стал более умным:
            учитывал ситуацию, безопасность и твои границы.
          </p>
          <p class="muted">
            Мы не удаляем правило. Мы делаем паузу и выбираем сами.
          </p>
          <p><b>Фраза игры:</b> «Автомат сказал одно. А я могу подумать и выбрать».</p>
        </div>
      `;
    },
    parentsContent() {
      return `
        <p class="sub">
          Короткая инструкция, чтобы играть без морализаторства и «правильных ответов».
        </p>

        <h3>Зачем игра</h3>
        <ul>
          <li><b>Замечать</b> внутренние правила (интерналы): «надо/нельзя/всегда…»</li>
          <li><b>Проверять</b>: где помогает, где мешает/опасно</li>
          <li><b>Обновлять</b> (апдейт): придумать более умное и безопасное правило</li>
        </ul>

        <h3>Как играть (процедура)</h3>
        <div class="box">
          <ul>
            <li><b>Короткая партия</b>: 3–5 карточек. <b>Обычная</b>: 6–10.</li>
            <li>Договоритесь о слове <b>«пауза»</b> (можно сменить карточку без объяснений).</li>
            <li>Ребёнок тянет карточку → отвечает на вопросы (в любом порядке).</li>
            <li>В конце — <b>апдейт</b>: 1–2 предложения нового правила.</li>
            <li>Финиш: выберите одно «правило дня» и где оно пригодится.</li>
          </ul>
        </div>

        <h3>Роль взрослого (самое важное)</h3>
        <div class="grid">
          <div class="box">
            <b>Нельзя</b>
            <ul>
              <li>оценивать («правильно/неправильно»)</li>
              <li>спорить и давить авторитетом</li>
              <li>читать лекции, «объяснять как надо»</li>
            </ul>
          </div>
          <div class="box">
            <b>Можно и нужно</b>
            <ul>
              <li>уточнять: «почему ты так думаешь?»</li>
              <li>расширять: «а бывает иначе?»</li>
              <li>мягко переформулировать, если ребёнку сложно</li>
              <li>следить за безопасностью апдейта</li>
            </ul>
          </div>
        </div>
        <p class="muted">
          Ключ: ты не учишь <b>что</b> думать — ты учишь <b>как</b> думать.
        </p>

        <h3>Формат вопросов (шаблон)</h3>
        <div class="box">
          <ul>
            <li>Где это правило помогает?</li>
            <li>Где мешает или становится опасным?</li>
            <li>Про что оно на самом деле (чувства/поведение/безопасность/угождение)?</li>
            <li>Что будет, если всегда ему следовать?</li>
            <li><b>Апдейт</b>: как звучит новая, более умная версия?</li>
          </ul>
        </div>

        <h3>Безопасность</h3>
        <ul>
          <li>Если тема стала тяжёлой — <b>пауза</b> и смена карточки.</li>
          <li>Не вытаскивайте личные секреты силой. Можно играть на примерах «как будто».</li>
          <li>Если ребёнок сильно тревожится/плачет — заканчивайте партию, вернитесь позже.</li>
        </ul>

        <h3>Если что-то пошло не так</h3>
        <div class="box">
          <ul>
            <li><b>Ребёнок молчит</b>: сократи до 2–3 вопросов, предложи «а если бы это было с другом?»</li>
            <li><b>Просит “как правильно”</b>: «в этой игре нет правильного — делаем версию, которая безопасна и удобна»</li>
            <li><b>Взрослый морализирует</b>: вернись к «где помогает / где мешает»</li>
          </ul>
        </div>

        <p class="muted">
          Памятки для печати: <a href="../parents.html">parents.html</a> и <a href="../kids.html">kids.html</a>.
        </p>
      `;
    },
  },
  methods: {
    shuffle(arr) {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },
    startGame() {
      if (this.filteredCards.length === 0) {
        alert("Нет карточек в выбранных категориях.");
        return;
      }
      this.deck = this.shuffle(this.filteredCards).slice(0, Math.min(this.count, this.filteredCards.length));
      this.currentIndex = 0;
      this.view = "game";
      document.body.classList.add("game-active");
    },
    finishGame() {
      if (confirm("Завершить партию и вернуться к началу?")) {
        this.view = "play";
        this.deck = [];
        this.currentIndex = 0;
        document.body.classList.remove("game-active");
        document.querySelector("#play")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    prevCard() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    nextCard() {
      if (this.currentIndex < this.deck.length - 1) {
        this.currentIndex++;
      }
    },
    completeGame() {
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
        this.view = "play";
        this.deck = [];
        this.currentIndex = 0;
        document.body.classList.remove("game-active");
        document.querySelector("#play")?.scrollIntoView({ behavior: "smooth" });
      }, 2500);
    },
    async loadCards() {
      try {
        const response = await fetch("cards.json");
        const data = await response.json();
        this.cards = data.cards || [];
        this.categories = [...new Set(this.cards.map((card) => card.category))];
        this.selectedCategories = [...this.categories]; // все по умолчанию
        this.loading = false;
      } catch (error) {
        this.error = "Не удалось загрузить колоду. Открой страницу через локальный сервер.";
        this.loading = false;
        console.error(error);
      }
    },
  },
  mounted() {
    this.loadCards();
  },
  template: `
    <div>
      <header class="top" v-if="view !== 'game'">
        <div class="wrap top__inner">
          <div class="brand">
            <div class="brand__title">Внутренний детектив</div>
            <div class="brand__sub">Весёлая игра с карточками</div>
          </div>
          <nav class="nav">
            <a class="nav__link nav__link--play" href="#" @click.prevent="view = 'play'">Играть</a>
            <a class="nav__link nav__link--kids" href="#" @click.prevent="view = 'kids'">Детям</a>
            <a class="nav__link nav__link--parents" href="#" @click.prevent="view = 'parents'">Родителям</a>
          </nav>
        </div>
      </header>

      <main class="wrap">
        <div v-if="loading" class="panel">Загружаю колоду…</div>
        <div v-else-if="error" class="panel">{{ error }}</div>
        <template v-else>
          <game-settings
            v-if="view === 'play'"
            id="play"
            :categories="categories"
            :selected-categories="selectedCategories"
            :count="count"
            :card-count="cardCount"
            @update:selectedCategories="selectedCategories = $event"
            @update:count="count = $event"
            @start="startGame"
          />

          <game-card
            v-if="view === 'game' && currentCard"
            :card="currentCard"
            :current-index="currentIndex"
            :total="deck.length"
            @prev="prevCard"
            @next="nextCard"
            @finish="finishGame"
            @complete="completeGame"
          />

          <rules-section
            v-if="view === 'kids'"
            title="Детям: что это за игра"
            :content="kidsContent"
          />

          <rules-section
            v-if="view === 'parents'"
            title="Родителям: правила игры"
            :content="parentsContent"
          />
        </template>
      </main>

      <div v-if="showSuccess" class="success-modal">
        <div class="success-modal__content">
          <div class="success-modal__emoji">
            <span>🌟</span>
            <span>✨</span>
            <span>⭐</span>
          </div>
          <div class="success-modal__title">УСПЕХ!</div>
          <div class="success-modal__text">Ты прошёл все карточки!</div>
        </div>
      </div>
    </div>
  `,
}).mount("#app");
