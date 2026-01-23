import gsap from "gsap";
import { ScrambleTextPlugin, ScrollTrigger, SplitText } from "gsap/all";

gsap.registerPlugin(SplitText, ScrollTrigger, ScrambleTextPlugin);

// Общие настройки для анимаций
const defaultEase = "power3.out";
const defaultDuration = 0.8;

// Инициализация анимаций после загрузки шрифтов
document.fonts.ready.then(() => {
  initHeaderAnimation();
  initHeroAnimation();
  initShowcaseAnimation();
  initTakeAnimation();
  initCatalogAnimation();
  initFindAnimation();
  initPacksAnimation();
  initBenefitsAnimation();
  initGuideAnimation();
  initFaqAnimation();
  initCtaAnimation();
  initFooterAnimation();

  if (window.innerWidth > 576) {
    initConsultAnimation();
  }
});

// Анимация хедера
function initHeaderAnimation() {
  const header = document.querySelector(".header");
  if (!header) return;

  gsap.from(".header__logo", {
    duration: 0.6,
    y: -30,
    opacity: 0,
    ease: defaultEase,
  });

  gsap.from(".nav__item", {
    duration: 0.5,
    y: -20,
    opacity: 0,
    stagger: 0.05,
    ease: defaultEase,
    delay: 0.2,
  });

  gsap.from(".header__button", {
    duration: 0.5,
    scale: 0,
    opacity: 0,
    stagger: 0.1,
    ease: "back.out(1.7)",
    delay: 0.3,
  });
}

// Анимация hero секции
function initHeroAnimation() {
  const containerHero = document.querySelector(".hero__container");
  const titleHero = document.querySelector(".hero__title");
  const descHero = document.querySelector(".hero__desc");
  if (!titleHero || !descHero) return;

  const timeline = gsap.timeline();

  let splitTitle = SplitText.create(titleHero, {
    type: "words, lines",
    mask: "lines",
    autoSplit: true,
  });
  let splitDesc = SplitText.create(descHero, {
    type: "words, lines",
    mask: "lines",
    autoSplit: true,
  });

  timeline
    .from(splitTitle.lines, {
      duration: 0.8,
      yPercent: 100,
      opacity: 0,
      stagger: 0.2,
      ease: "expo.out",
    })
    .from(
      splitDesc.lines,
      {
        duration: 0.8,
        yPercent: -100,
        opacity: 0,
        stagger: 0.2,
        ease: "expo.out",
      },
      "-=0.2"
    )
    .from(
      ".hero__btn",
      {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        ease: defaultEase,
      },
      "-=0.3"
    );

  gsap.to(containerHero, {
    yPercent: 30,

    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      scrub: 0.5,
    },
  });
  gsap.to(".hero__img", {
    yPercent: 10,

    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      scrub: 0.5,
    },
  });
}

// Анимация showcase секции
function initShowcaseAnimation() {
  const showcase = document.querySelector(".showcase");
  const covers = document.querySelector(".showcase__covers");
  if (!showcase || !covers) return;

  const items = document.querySelectorAll(".showcase__item");
  const decor = document.querySelectorAll(".showcase__decor");
  const allElements = [...items, ...decor];

  if (allElements.length === 0) return;

  // Вычисляем центр контейнера
  const coversRect = covers.getBoundingClientRect();
  const centerX = coversRect.width / 2;
  const centerY = coversRect.height / 2;

  // Вычисляем смещения от центра для каждого элемента
  const offsets = new Map();
  allElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const elementCenterX = rect.left - coversRect.left + el.offsetWidth / 2;
    const elementCenterY = rect.top - coversRect.top + el.offsetHeight / 2;

    offsets.set(el, {
      x: centerX - elementCenterX,
      y: centerY - elementCenterY,
    });
  });

  // Timeline для разлета элементов при скролле
  const showcaseTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: showcase,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  // Разлет элементов из центра на свои места через gsap.from
  allElements.forEach((el, index) => {
    const offset = offsets.get(el);
    showcaseTimeline.from(
      el,
      {
        x: offset.x,
        y: offset.y,
        scale: 0.6,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
      },
      index * 0.1
    );
  });

  // Анимация шатания (постоянная, после разлета)
  const wiggleAnimations = new Map();
  let isSectionVisible = false;

  // Проверка видимости секции
  function checkSectionVisibility() {
    const rect = showcase.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibilityPercent = (visibleHeight / rect.height) * 100;
    const wasVisible = isSectionVisible;
    isSectionVisible = visibilityPercent >= 5;

    // Останавливаем или возобновляем анимации в зависимости от видимости
    if (wasVisible !== isSectionVisible) {
      wiggleAnimations.forEach((anim) => {
        if (isSectionVisible) {
          anim.resume();
        } else {
          anim.pause();
        }
      });
    }
  }

  // Слушаем скролл для проверки видимости
  window.addEventListener("scroll", checkSectionVisibility, { passive: true });
  checkSectionVisibility();

  showcaseTimeline.call(() => {
    allElements.forEach((el) => {
      const randomDelay = Math.random() * 0.5;
      const randomDuration = 3 + Math.random() * 2;
      // Увеличиваем силу покачивания (было 1-2.5, теперь 2-4)
      const randomRotation = 2 + Math.random() * 2;

      const anim = gsap.to(el, {
        rotationZ: `+=${randomRotation}`,
        rotationY: `+=${randomRotation * 0.5}`,
        rotationX: `+=${randomRotation * 0.3}`,
        duration: randomDuration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: randomDelay,
        paused: !isSectionVisible, // Пауза если секция не видна
      });

      wiggleAnimations.set(el, anim);
    });
  });

  // Анимация контента
  gsap.from(".showcase__title", {
    scrollTrigger: {
      trigger: showcase,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: defaultDuration,
    y: 50,
    opacity: 0,
    ease: defaultEase,
  });

  gsap.from(".showcase__desc li", {
    scrollTrigger: {
      trigger: showcase,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: 0.6,
    x: -30,
    opacity: 0,
    stagger: 0.15,
    ease: defaultEase,
    delay: 0.2,
  });
}

// Анимация take секции
function initTakeAnimation() {
  const take = document.querySelector(".take");
  if (!take) return;
  const takeItems = document.querySelectorAll(".take__item");

  gsap.from(".take__title", {
    scrollTrigger: {
      trigger: take,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: defaultDuration,
    y: 40,
    opacity: 0,
    ease: defaultEase,
  });

  gsap.from(takeItems, {
    scrollTrigger: {
      trigger: take,
      start: "top 75%",
      toggleActions: "play none none none",
    },
    duration: 0.7,
    y: 60,
    opacity: 0,
    scale: 0.9,
    stagger: {
      amount: 0.4,
      from: "start",
    },
    ease: "power2.out",
    delay: 0.2,

    onComplete: () => {
      takeItems.forEach((item, idx) => {
        item.style.setProperty('--highlight', '1')
        item.style.setProperty('--delay', idx * 100 + 'ms')
      })
    }
  });
}

// Анимация catalog секции
function initCatalogAnimation() {
  const catalog = document.querySelector(".catalog");
  if (!catalog) return;

  gsap.from(".catalog__title", {
    scrollTrigger: {
      trigger: catalog,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: defaultDuration,
    y: 40,
    opacity: 0,
    ease: defaultEase,
  });

  gsap.from(".catalog__desc", {
    scrollTrigger: {
      trigger: catalog,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: 0.6,
    y: 20,
    opacity: 0,
    ease: defaultEase,
    delay: 0.15,
  });

  gsap.from(".catalog__btn", {
    scrollTrigger: {
      trigger: catalog,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: 0.6,
    scale: 0.8,
    opacity: 0,
    ease: "back.out(1.7)",
    delay: 0.3,
  });

  gsap.from(".catalog__item", {
    scrollTrigger: {
      trigger: catalog,
      start: "top 70%",
      toggleActions: "play none none none",
    },
    duration: 0.7,
    y: 80,
    opacity: 0,
    stagger: {
      amount: 0.5,
      from: "start",
    },
    ease: "power2.out",
    delay: 0.4,
  });
}

// Анимация find секции
function initFindAnimation() {
  const find = document.querySelector(".find");
  if (!find) return;

  gsap.from(".find__title", {
    scrollTrigger: {
      trigger: find,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: defaultDuration,
    y: 50,
    opacity: 0,
    ease: defaultEase,
  });

  gsap.from(".find__desc", {
    scrollTrigger: {
      trigger: find,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: 0.6,
    y: 30,
    opacity: 0,
    ease: defaultEase,
    delay: 0.2,
  });

  gsap.from(".find-form", {
    scrollTrigger: {
      trigger: find,
      start: "top 75%",
      toggleActions: "play none none none",
    },
    duration: 0.8,
    y: 60,
    opacity: 0,
    ease: "power2.out",
    delay: 0.4,
  });

  gsap.from(".find__video", {
    scrollTrigger: {
      trigger: find,
      start: "top 75%",
      toggleActions: "play none none none",
    },
    duration: 0.8,
    scale: 0.95,
    opacity: 0,
    ease: defaultEase,
    delay: 0.5,
  });
}

// Анимация packs секции
function initPacksAnimation() {
  const packs = document.querySelector(".packs");
  if (!packs) return;

  // Анимация заголовка
  gsap.from(".packs__title", {
    scrollTrigger: {
      trigger: packs,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: defaultDuration,
    y: 50,
    opacity: 0,
    ease: defaultEase,
  });

  // Анимация карточек (слайдов)
  gsap.from(".pack", {
    scrollTrigger: {
      trigger: packs,
      start: "top 75%",
      toggleActions: "play none none none",
    },
    duration: 0.8,
    y: 80,
    opacity: 0,
    scale: 0.92,
    stagger: {
      amount: 0.5,
      from: "start",
    },
    ease: "power2.out",
    delay: 0.2,
  });

  // Анимация изображений в карточках
  gsap.from(".pack__img", {
    scrollTrigger: {
      trigger: packs,
      start: "top 75%",
      toggleActions: "play none none none",
    },
    duration: 0.9,
    scale: 1.1,
    opacity: 0,
    stagger: {
      amount: 0.5,
      from: "start",
    },
    ease: "power2.out",
    delay: 0.3,
  });

  // Анимация контента карточек
  gsap.from(".pack__title", {
    scrollTrigger: {
      trigger: packs,
      start: "top 75%",
      toggleActions: "play none none none",
    },
    duration: 0.7,
    y: 30,
    opacity: 0,
    stagger: {
      amount: 0.5,
      from: "start",
    },
    ease: defaultEase,
    delay: 0.5,
  });

  gsap.from(".pack__desc", {
    scrollTrigger: {
      trigger: packs,
      start: "top 75%",
      toggleActions: "play none none none",
    },
    duration: 0.6,
    y: 20,
    opacity: 0,
    stagger: {
      amount: 0.5,
      from: "start",
    },
    ease: defaultEase,
    delay: 0.65,
  });

  gsap.from(".pack__prices", {
    scrollTrigger: {
      trigger: packs,
      start: "top 75%",
      toggleActions: "play none none none",
    },
    duration: 0.6,
    x: -30,
    opacity: 0,
    stagger: {
      amount: 0.5,
      from: "start",
    },
    ease: defaultEase,
    delay: 0.8,
  });

  gsap.from(".pack__btn", {
    scrollTrigger: {
      trigger: packs,
      start: "top 75%",
      toggleActions: "play none none none",
    },
    duration: 0.5,
    y: 20,
    opacity: 0,
    scale: 0.9,
    stagger: {
      amount: 0.3,
      from: "start",
    },
    ease: "back.out(1.5)",
    delay: 0.95,
  });
}

// Анимация benefits секции с эффектом наложения
function initBenefitsAnimation() {
  const benefits = document.querySelector(".benefits");
  if (!benefits) return;

  // Устанавливаем начальное состояние - секция ниже своего места
  // gsap.set(benefits, {
  //   y: 200,
  // });

  // Анимация "наезжания" секции наверх с эффектом наложения
  gsap.from(benefits, {
    y: 400,
    ease: "power3.out",
    scrollTrigger: {
      trigger: benefits,
      start: "top 120%",
      end: "top 50%",
      scrub: 1.2,
    },
  });

  // Анимация появления контента внутри секции через timeline
  const benefitsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: benefits,
      start: "top 75%",
      toggleActions: "play none none none",
    },
  });

  benefitsTimeline
    .from(".benefits__title", {
      duration: defaultDuration,
      y: 40,
      opacity: 0,
      ease: defaultEase,
    })
    .from(
      ".benefits__item",
      {
        duration: 0.7,
        x: -50,
        opacity: 0,
        stagger: {
          amount: 0.6,
          from: "start",
        },
        ease: "power2.out",
      },
      "-=0.3"
    )
    .from(
      ".benefits__img",
      {
        duration: 1,
        y: 100,
        opacity: 0,
        ease: "power2.out",
      },
      "-=0.4"
    )
    .from(
      ".benefits__socials",
      {
        duration: 0.6,
        y: 30,
        opacity: 0,
        ease: defaultEase,
      },
      "-=0.3"
    );
}

// Анимация guide секции с clip-path
function initGuideAnimation() {
  const guide = document.querySelector(".guide");
  if (!guide) return;

  const guideItems = guide.querySelectorAll(".guide__item");
  const guideImg = guide.querySelector(".guide__img");

  // Анимация заголовка
  gsap.from(".guide__title", {
    scrollTrigger: {
      trigger: guide,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: defaultDuration,
    y: 40,
    opacity: 0,
    ease: defaultEase,
  });

  // Timeline для последовательного раскрытия clip-path карточек
  const guideTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: guide,
      start: "top 75%",
      toggleActions: "play none none none",
    },
  });

  // Последовательно раскрываем каждую карточку через clip-path
  guideItems.forEach((item, index) => {
    guideTimeline.to(
      item,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.6,
        ease: "power2.out",
      },
      index === 0 ? 0.2 : "-=0.3"
    );
  });

  // Раскрываем изображение после карточек
  if (guideImg) {
    guideTimeline.to(
      guideImg,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.2"
    );
  }

  // Анимация контента внутри карточек
  gsap.from(".guide__item-capture", {
    scrollTrigger: {
      trigger: guide,
      start: "top 75%",
      toggleActions: "play none none none",
    },
    duration: 0.6,
    y: 20,
    opacity: 0,
    stagger: {
      amount: 0.8,
      from: "start",
    },
    ease: defaultEase,
    delay: 0.4,
  });

  gsap.from(".guide__item-icon", {
    scrollTrigger: {
      trigger: guide,
      start: "top 75%",
      toggleActions: "play none none none",
    },
    duration: 0.5,
    scale: 0,
    opacity: 0,
    stagger: {
      amount: 0.8,
      from: "start",
    },
    ease: "back.out(1.7)",
    delay: 0.6,
  });
}

// Анимация consult секции с эффектом наложения
function initConsultAnimation() {
  const consult = document.querySelector(".consult");
  if (!consult) return;

  // Анимация "наезжания" секции наверх с эффектом наложения
  gsap.from(consult, {
    y: 400,
    ease: "power3.out",
    scrollTrigger: {
      trigger: consult,
      start: "top 120%",
      end: "top 50%",
      scrub: 1.2,
    },
  });

  // Анимация появления контента внутри секции через timeline
  const consultTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: consult,
      start: "top 75%",
      toggleActions: "play none none none",
    },
  });

  consultTimeline
    .from(".consult__title", {
      duration: defaultDuration,
      y: 40,
      opacity: 0,
      ease: defaultEase,
    })
    .from(
      ".consult__desc",
      {
        duration: 0.7,
        y: 30,
        opacity: 0,
        ease: defaultEase,
      },
      "-=0.3"
    )
    .from(
      ".consult__btn",
      {
        duration: 0.6,
        scale: 0.9,
        opacity: 0,
        ease: "back.out(1.7)",
      },
      "-=0.2"
    )
    .from(
      ".consult__img",
      {
        duration: 1,
        y: 100,
        opacity: 0,
        ease: "power2.out",
      },
      "-=0.4"
    );
}

// Анимация FAQ секции
function initFaqAnimation() {
  const faq = document.querySelector(".faq");
  if (!faq) return;

  // Анимация заголовка
  gsap.from(".faq__title", {
    scrollTrigger: {
      trigger: faq,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: defaultDuration,
    y: 40,
    opacity: 0,
    ease: defaultEase,
  });

  // Анимация карточек FAQ через timeline
  const faqTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: faq,
      start: "top 75%",
      toggleActions: "play none none none",
    },
  });

  faqTimeline.to(".faq__item", {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    duration: 0.7,
    stagger: {
      amount: 1,
      from: "start",
    },
    ease: "power2.out",
    delay: 0.2,
  });
}

// Анимация CTA секции
function initCtaAnimation() {
  const cta = document.querySelector(".cta");
  if (!cta) return;

  // Timeline для контента CTA
  const ctaTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: cta,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  ctaTimeline
    .from(".cta__title", {
      duration: defaultDuration,
      y: 50,
      opacity: 0,
      ease: defaultEase,
    })
    .from(
      ".cta__btn",
      {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: {
          amount: 0.3,
          from: "start",
        },
        ease: "power2.out",
      },
      "-=0.3"
    )

}

// Анимация Footer секции
function initFooterAnimation() {
  const footer = document.querySelector(".footer");
  if (!footer) return;

  // Timeline для элементов футера
  const footerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: footer,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  // footerTimeline
  //   .from(".footer__logo", {
  //     duration: 0.6,
  //     y: -20,
  //     opacity: 0,
  //     ease: defaultEase,
  //   })
  //   .from(
  //     ".footer__socials .socials__item",
  //     {
  //       duration: 0.5,
  //       scale: 0,
  //       opacity: 0,
  //       stagger: 0.1,
  //       ease: "back.out(1.7)",
  //     },
  //     "-=0.2"
  //   )
  //   .from(
  //     ".footer__nav ul",
  //     {
  //       duration: 0.6,
  //       x: -30,
  //       opacity: 0,
  //       stagger: {
  //         amount: 0.4,
  //         from: "start",
  //       },
  //       ease: defaultEase,
  //     },
  //     "-=0.3"
  //   )
  //   .from(
  //     ".footer__right .footer__item",
  //     {
  //       duration: 0.5,
  //       y: 20,
  //       opacity: 0,
  //       stagger: 0.15,
  //       ease: defaultEase,
  //     },
  //     "-=0.4"
  //   );
}
