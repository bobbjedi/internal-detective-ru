const { createApp } = Vue;

const GameCard = {
  props: ["card", "currentIndex", "total"],
  emits: ["prev", "next", "finish", "complete"],
  computed: {
    isLastCard() {
      return this.currentIndex >= this.total - 1;
    },
  },
  methods: {
    handleNextOrComplete() {
      if (this.isLastCard) {
        this.$emit("complete");
      } else {
        this.$emit("next");
      }
    },
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
        <ol class="q">
          <li v-for="q in card.questions" :key="q">{{ q }}</li>
        </ol>
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
      <div v-html="content"></div>
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
        <p><b>Интернал</b> — это мысль‑правило в голове, которая срабатывает сама, без проверки:</p>
        <ul>
          <li>«надо так»</li>
          <li>«нельзя вот так»</li>
          <li>«если сделаю иначе — будет плохо»</li>
        </ul>
        <p class="muted">Это как автопилот: он реагирует быстро, пока ты ещё не подумал.</p>
        <p>В игре мы учимся замечать автопилот, проверять правило и делать его умнее.
        Ты растёшь и можешь <b>думать и выбирать</b>, а не действовать только "по указке".</p>
        <p class="muted">Фраза игры: «Автопилот сказал одно. А я могу подумать и выбрать».</p>
      `;
    },
    parentsContent() {
      return `
        <ul>
          <li><b>Цель</b>: заметить правило, проверить, обновить.</li>
          <li><b>Без оценок</b>: без «правильно/неправильно» и без лекций.</li>
          <li><b>Вопросы</b>: «почему ты так думаешь?», «где помогает/мешает?»</li>
          <li><b>Апдейт</b>: финалом — 1–2 предложения нового правила.</li>
          <li><b>Пауза</b>: карточку можно сменить без объяснений.</li>
        </ul>
        <p class="muted">Памятки для печати: <a href="../parents.html">parents.html</a> и <a href="../kids.html">kids.html</a>.</p>
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
        const response = await fetch("../cards/cards.json");
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
            <a class="nav__link" href="#" @click.prevent="view = 'play'">Играть</a>
            <a class="nav__link" href="#" @click.prevent="view = 'kids'">Детям</a>
            <a class="nav__link" href="#" @click.prevent="view = 'parents'">Родителям</a>
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
