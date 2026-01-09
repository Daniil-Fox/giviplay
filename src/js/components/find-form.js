class FindForm {
  constructor(form) {
    this.form = form;
    this.slider = form.querySelector(".find-form__slider");
    this.wrapper = form.querySelector(".find-form__wrapper");
    this.slides = form.querySelectorAll(".find-form__slide");
    this.btnNext = form.querySelector(".find-form__btn_next");
    this.btnPrev = form.querySelector(".find-form__btn_prev");

    this.currentSlide = 0;
    this.isAnimating = false;

    this.init();
  }

  init() {
    if (!this.slides.length) return;

    // Устанавливаем высоту по самому длинному слайду
    this.setMaxHeight();

    // Инициализируем первый слайд
    this.updateSlides();

    // Обработчики событий
    this.btnNext?.addEventListener("click", (e) => this.handleNext(e));
    this.btnPrev?.addEventListener("click", (e) => this.handlePrev(e));

    // Отключаем отправку формы
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    // Следим за изменениями в инпутах
    this.slides.forEach((slide, index) => {
      const inputs = slide.querySelectorAll(
        'input[type="checkbox"], input[type="radio"]'
      );
      inputs.forEach((input) => {
        input.addEventListener("change", () => {
          this.updateButtonsState();
        });
      });
    });

    this.updateButtonsState();
  }

  setMaxHeight() {
    // Находим максимальную высоту среди всех слайдов
    let maxHeight = 0;

    // Временно показываем все слайды для измерения
    const originalDisplays = [];
    this.slides.forEach((slide, index) => {
      originalDisplays[index] = slide.style.display;
      slide.style.display = "block";
      slide.style.visibility = "hidden";
      slide.style.position = "absolute";
    });

    // Измеряем высоту каждого слайда
    this.slides.forEach((slide) => {
      const height = slide.offsetHeight;
      if (height > maxHeight) {
        maxHeight = height;
      }
    });

    // Восстанавливаем исходное состояние
    this.slides.forEach((slide, index) => {
      slide.style.display =
        originalDisplays[index] || (index === 0 ? "block" : "none");
      slide.style.visibility = "";
      slide.style.position = "";
    });

    // Устанавливаем высоту для wrapper
    if (maxHeight > 0) {
      this.wrapper.style.minHeight = `${maxHeight}px`;
    }
  }

  updateSlides() {
    this.slides.forEach((slide, index) => {
      if (index === this.currentSlide) {
        slide.style.display = "block";
      } else {
        slide.style.display = "none";
      }
    });
  }

  isSlideValid(slideIndex) {
    const slide = this.slides[slideIndex];
    if (!slide) return false;

    const allCheckboxes = slide.querySelectorAll('input[type="checkbox"]');
    const checkedCheckboxes = slide.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    const allRadios = slide.querySelectorAll('input[type="radio"]');
    const checkedRadios = slide.querySelectorAll('input[type="radio"]:checked');

    // Для слайда с чекбоксами - хотя бы один должен быть выбран
    if (allCheckboxes.length > 0) {
      return checkedCheckboxes.length > 0;
    }

    // Для слайда с радиокнопками - одна должна быть выбрана
    if (allRadios.length > 0) {
      return checkedRadios.length === 1;
    }

    return false;
  }

  validateCurrentSlide() {
    return this.isSlideValid(this.currentSlide);
  }

  validateAllPreviousSlides() {
    for (let i = 0; i < this.currentSlide; i++) {
      if (!this.isSlideValid(i)) {
        return false;
      }
    }
    return true;
  }

  updateButtonsState() {
    // Кнопка "Далее" активна только если текущий слайд валиден
    if (this.btnNext) {
      const isValid = this.validateCurrentSlide();
      this.btnNext.disabled = !isValid;

      if (isValid) {
        this.btnNext.style.opacity = "1";
        this.btnNext.style.cursor = "pointer";
      } else {
        this.btnNext.style.opacity = "0.5";
        this.btnNext.style.cursor = "not-allowed";
      }
    }

    // Кнопка "Назад" скрыта на первом слайде
    if (this.btnPrev) {
      if (this.currentSlide === 0) {
        this.btnPrev.style.opacity = "0";
        this.btnPrev.style.pointerEvents = "none";
      } else {
        this.btnPrev.style.opacity = "1";
        this.btnPrev.style.cursor = "pointer";
        this.btnPrev.disabled = false;
        this.btnPrev.style.pointerEvents = "all";
      }
    }
  }

  handleNext(e) {
    e.preventDefault();

    if (this.isAnimating) return;

    // Проверяем валидность текущего слайда
    if (!this.validateCurrentSlide()) {
      return;
    }

    // Проверяем все предыдущие слайды
    if (!this.validateAllPreviousSlides()) {
      return;
    }

    if (this.currentSlide < this.slides.length - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  handlePrev(e) {
    e.preventDefault();

    if (this.isAnimating) return;

    if (this.currentSlide > 0) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  goToSlide(targetIndex) {
    if (
      this.isAnimating ||
      targetIndex < 0 ||
      targetIndex >= this.slides.length
    ) {
      return;
    }

    this.isAnimating = true;
    const currentSlideEl = this.slides[this.currentSlide];
    const targetSlideEl = this.slides[targetIndex];

    // Анимация "пленки": качнуться вниз, затем вверх
    // Шаг 1: Качнуться вниз
    this.wrapper.style.transition =
      "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    this.wrapper.style.transform = `translateY(15px)`;

    setTimeout(() => {
      // Шаг 2: Переключаем слайды
      this.currentSlide = targetIndex;
      this.updateSlides();
      // Обновляем состояние кнопок сразу при переключении слайда
      this.updateButtonsState();

      // Шаг 3: Поднимаемся вверх (возвращаемся в исходное положение)
      this.wrapper.style.transition =
        "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
      this.wrapper.style.transform = `translateY(0)`;

      setTimeout(() => {
        this.isAnimating = false;
        this.wrapper.style.transition = "";
      }, 400);
    }, 300);
  }
}

// Инициализация всех форм на странице
document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".find-form");
  forms.forEach((form) => {
    new FindForm(form);
  });
});
