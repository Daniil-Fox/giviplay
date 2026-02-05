function initVideoEmbed() {
  const container = document.querySelector(".video-sec__video");
  if (!container) return;

  // Берём src для iframe из data-атрибута этого div.
  // Ожидаем, что backend/шаблон положит в data-video-file полноценный URL,
  // например: https://kinescope.io/embed/ID
  const src = container.dataset.videoFile;
  if (!src) return;

  // Очищаем контейнер и встраиваем iframe
  container.innerHTML = "";

  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.allow =
    "autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;";
  iframe.frameBorder = "0";
  iframe.setAttribute("allowfullscreen", "true");

  // Базовый размер; через CSS контейнера можно переопределить под адаптив
  iframe.width = "1920";
  iframe.height = "1080";

  // На всякий случай на всю ширину контейнера
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  container.appendChild(iframe);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVideoEmbed);
} else {
  initVideoEmbed();
}
