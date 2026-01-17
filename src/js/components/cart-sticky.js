class CartSticky {
  constructor() {
    this.summary = document.querySelector(".summary");
    this.container = document.querySelector(".cart__container");
    this.cart = document.querySelector(".cart");
    this.isMobile = window.innerWidth <= 576;
    this.isFixed = false;
    this.isAbsolute = false;
    this.summaryHeight = 0;
    this.containerBottom = 0;

    if (!this.summary || !this.container) return;

    this.init();
  }

  init() {
    if (!this.isMobile) return;

    // Убираем CSS sticky, будем управлять через JS
    this.summary.style.position = "relative";
    this.summary.style.bottom = "auto";

    // Вычисляем размеры
    this.calculateDimensions();

    // Обработчик скролла
    window.addEventListener("scroll", () => this.handleScroll(), {
      passive: true,
    });
    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth <= 576;
      if (!this.isMobile) {
        this.resetStyles();
      } else {
        this.calculateDimensions();
        this.handleScroll();
      }
    });

    // Первоначальная проверка с небольшой задержкой для корректного расчета размеров
    setTimeout(() => {
      this.calculateDimensions();
      this.handleScroll();
    }, 100);
  }

  calculateDimensions() {
    if (!this.summary || !this.container) return;

    const summaryRect = this.summary.getBoundingClientRect();
    this.summaryHeight = summaryRect.height;

    const containerRect = this.container.getBoundingClientRect();
    const scrollY = window.scrollY;
    this.containerBottom = containerRect.bottom + scrollY - this.summaryHeight;
  }

  handleScroll() {
    if (!this.isMobile || !this.summary || !this.container) return;

    const scrollY = window.scrollY;
    const containerRect = this.container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Вычисляем позицию контейнера относительно документа
    const containerTop = containerRect.top + scrollY;
    const containerBottom = containerRect.bottom + scrollY;

    // Вычисляем позицию низа viewport
    const viewportBottom = scrollY + windowHeight;

    // Summary должен прилипать к низу экрана (fixed), если:
    // 1. Контейнер виден на экране (верх контейнера выше или равен низу viewport)
    // 2. И мы еще не доскроллили до конца контейнера (низ контейнера еще ниже низа viewport)
    const isContainerVisible = containerTop <= viewportBottom;
    // Контейнер еще не закончился - его низ должен быть ниже низа viewport
    const isContainerNotFinished = containerBottom > viewportBottom;

    const shouldBeFixed = isContainerVisible && isContainerNotFinished;

    if (shouldBeFixed) {
      if (this.isAbsolute) {
        // Если были в absolute, возвращаемся к fixed
        this.removeAbsolute();
      }
      if (!this.isFixed) {
        this.applyFixed();
      }
    } else {
      if (this.isFixed) {
        // Когда достигли конца контейнера, оставляем summary внизу контейнера
        this.applyAbsolute();
      }
    }
  }

  applyFixed() {
    if (!this.summary) return;

    this.isFixed = true;
    this.isAbsolute = false;
    this.summary.style.position = "fixed";
    this.summary.style.bottom = "0";
    this.summary.style.left = "0";
    this.summary.style.right = "0";
    this.summary.style.zIndex = "40";
    this.summary.style.width = "100%";
    this.summary.style.marginRight = "0";
    this.summary.style.marginLeft = "0";
  }

  applyAbsolute() {
    if (!this.summary || !this.container) return;

    this.isFixed = false;
    this.isAbsolute = true;

    // Устанавливаем абсолютное позиционирование относительно контейнера
    // Контейнер уже имеет position: relative в мобильной версии
    this.summary.style.position = "absolute";
    this.summary.style.bottom = "0";
    this.summary.style.left = "0";
    this.summary.style.right = "0";
    this.summary.style.zIndex = "40";
    this.summary.style.width = "";
    this.summary.style.marginRight = null;
    this.summary.style.marginLeft = null;
  }

  removeAbsolute() {
    if (!this.summary) return;

    this.isAbsolute = false;
    this.summary.style.position = "relative";
    this.summary.style.bottom = "auto";
    this.summary.style.left = "auto";
    this.summary.style.right = "auto";
    this.summary.style.width = "auto";
    this.summary.style.marginLeft = null;
    this.summary.style.marginRight = null;
    this.summary.style.paddingLeft = "";
    this.summary.style.paddingRight = "";
  }

  removeFixed() {
    if (!this.summary) return;

    this.isFixed = false;
    this.summary.style.position = "relative";
    this.summary.style.bottom = "auto";
    this.summary.style.left = "auto";
    this.summary.style.right = "auto";
    this.summary.style.width = "auto";
    this.summary.style.marginLeft = "";
    this.summary.style.marginRight = "";
    this.summary.style.paddingLeft = "";
    this.summary.style.paddingRight = "";
  }

  resetStyles() {
    if (!this.summary || !this.container) return;

    this.isFixed = false;
    this.isAbsolute = false;
    this.summary.style.position = "";
    this.summary.style.bottom = "";
    this.summary.style.left = "";
    this.summary.style.right = "";
    this.summary.style.zIndex = "";
    this.summary.style.width = "";
    this.summary.style.marginLeft = "";
    this.summary.style.marginRight = "";
    this.summary.style.paddingLeft = "";
    this.summary.style.paddingRight = "";
  }
}

// Инициализация при загрузке DOM и после полной загрузки
let cartStickyInstance = null;

function initCartSticky() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      cartStickyInstance = new CartSticky();
    });
  } else {
    cartStickyInstance = new CartSticky();
  }

  // Также инициализируем после полной загрузки страницы
  window.addEventListener("load", () => {
    if (cartStickyInstance && cartStickyInstance.isMobile) {
      cartStickyInstance.calculateDimensions();
      cartStickyInstance.handleScroll();
    }
  });
}

initCartSticky();
