class VideoPlayer {
  constructor(container) {
    this.container = container;
    this.video = null;
    this.isPlaying = false;
    this.isDragging = false;
    this.hideControlsTimeout = null;
    this.init();
  }

  init() {
    this.createMarkup();
    this.video = this.container.querySelector(".video-player__video");
    this.attachEvents();
    this.loadVideoSource();
  }

  createMarkup() {
    this.container.innerHTML = `
      <div class="video-player">
        <video class="video-player__video" preload="metadata" playsinline>
          <source src="" type="video/mp4">
        </video>

        <div class="video-player__controls">
          <div class="video-player__progress-wrapper">
            <div class="video-player__progress">
              <div class="video-player__progress-filled"></div>
              <div class="video-player__progress-buffer"></div>
              <div class="video-player__progress-handle"></div>
            </div>
          </div>

          <div class="video-player__bottom-controls">
            <div class="video-player__left">
              <button class="video-player__btn video-player__btn_play" aria-label="Воспроизвести">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="video-player__icon-pause">
                  <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                  <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                </svg>
              </button>

              <div class="video-player__volume">
                <button class="video-player__btn video-player__btn_volume" aria-label="Громкость">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="video-player__icon-volume"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M2.9 9h4l5-6v18l-5-5h-5V9h1zM15.5 19.5a7.3 7.3 0 0 0 7-7.5 7.3 7.3 0 0 0-7-7.5"/><path d="M15.5 15a3 3 0 0 0 0-6"/></g></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" class="video-player__icon-mute"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m22 10-2 2m0 0-2 2m2-2-2-2m2 2 2 2M8.5 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h5.5l6.5 5V3L8.5 8Z"/></svg>
                </button>
                <div class="video-player__volume-slider">
                  <input type="range" class="video-player__volume-range" min="0" max="100" value="100" step="1">
                </div>
              </div>

              <div class="video-player__time">
                <span class="video-player__time-current">0:00</span>
                <span class="video-player__time-separator">/</span>
                <span class="video-player__time-total">0:00</span>
              </div>
            </div>

            <div class="video-player__right">
              <button class="video-player__btn video-player__btn_fullscreen" aria-label="Полноэкранный режим">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="video-player__icon-fullscreen">
                  <path d="M3,15 L3.11662113,15.0067277 C3.57570299,15.0600494 3.93995063,15.424297 3.99327227,15.8833789 L4,16 L4,20 L8,20 L8.11662113,20.0067277 C8.61395981,20.0644928 9,20.4871642 9,21 C9,21.5128358 8.61395981,21.9355072 8.11662113,21.9932723 L8,22 L3,22 L2.88337887,21.9932723 C2.42429701,21.9399506 2.06004937,21.575703 2.00672773,21.1166211 L2,21 L2,16 L2.00672773,15.8833789 C2.06004937,15.424297 2.42429701,15.0600494 2.88337887,15.0067277 L3,15 Z M21,15 C21.5128358,15 21.9355072,15.3860402 21.9932723,15.8833789 L22,16 L22,21 C22,21.5128358 21.6139598,21.9355072 21.1166211,21.9932723 L21,22 L16,22 C15.4477153,22 15,21.5522847 15,21 C15,20.4871642 15.3860402,20.0644928 15.8833789,20.0067277 L16,20 L20,20 L20,16 C20,15.4871642 20.3860402,15.0644928 20.8833789,15.0067277 L21,15 Z M8,2 C8.55228475,2 9,2.44771525 9,3 C9,3.51283584 8.61395981,3.93550716 8.11662113,3.99327227 L8,4 L4,4 L4,8 C4,8.51283584 3.61395981,8.93550716 3.11662113,8.99327227 L3,9 C2.48716416,9 2.06449284,8.61395981 2.00672773,8.11662113 L2,8 L2,3 C2,2.48716416 2.38604019,2.06449284 2.88337887,2.00672773 L3,2 L8,2 Z M21,2 L21.1166211,2.00672773 C21.575703,2.06004937 21.9399506,2.42429701 21.9932723,2.88337887 L22,3 L22,8 L21.9932723,8.11662113 C21.9399506,8.57570299 21.575703,8.93995063 21.1166211,8.99327227 L21,9 L20.8833789,8.99327227 C20.424297,8.93995063 20.0600494,8.57570299 20.0067277,8.11662113 L20,8 L20,4 L16,4 L15.8833789,3.99327227 C15.3860402,3.93550716 15,3.51283584 15,3 C15,2.48716416 15.3860402,2.06449284 15.8833789,2.00672773 L16,2 L21,2 Z" fill="currentColor"/>
                </svg>
                <svg fill="currentColor" height="24" width="24" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 385.331 385.331" xml:space="preserve" class="video-player__icon-exit-fullscreen">
                  <path d="M264.943,156.665h108.273c6.833,0,11.934-5.39,11.934-12.211c0-6.833-5.101-11.85-11.934-11.838h-96.242V36.181
                      c0-6.833-5.197-12.03-12.03-12.03s-12.03,5.197-12.03,12.03v108.273c0,0.036,0.012,0.06,0.012,0.084
                      c0,0.036-0.012,0.06-0.012,0.096C252.913,151.347,258.23,156.677,264.943,156.665z"/>
                  <path d="M120.291,24.247c-6.821,0-11.838,5.113-11.838,11.934v96.242H12.03c-6.833,0-12.03,5.197-12.03,12.03
                      c0,6.833,5.197,12.03,12.03,12.03h108.273c0.036,0,0.06-0.012,0.084-0.012c0.036,0,0.06,0.012,0.096,0.012
                      c6.713,0,12.03-5.317,12.03-12.03V36.181C132.514,29.36,127.124,24.259,120.291,24.247z"/>
                  <path d="M120.387,228.666H12.115c-6.833,0.012-11.934,5.39-11.934,12.223c0,6.833,5.101,11.85,11.934,11.838h96.242v96.423
                      c0,6.833,5.197,12.03,12.03,12.03c6.833,0,12.03-5.197,12.03-12.03V240.877c0-0.036-0.012-0.06-0.012-0.084
                      c0-0.036,0.012-0.06,0.012-0.096C132.418,233.983,127.1,228.666,120.387,228.666z"/>
                  <path d="M373.3,228.666H265.028c-0.036,0-0.06,0.012-0.084,0.012c-0.036,0-0.06-0.012-0.096-0.012
                      c-6.713,0-12.03,5.317-12.03,12.03v108.273c0,6.833,5.39,11.922,12.223,11.934c6.821,0.012,11.838-5.101,11.838-11.922v-96.242
                      H373.3c6.833,0,12.03-5.197,12.03-12.03S380.134,228.678,373.3,228.666z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="video-player__skip-indicator video-player__skip-indicator_left">
          <span class="video-player__skip-text">-10 сек</span>
        </div>
        <div class="video-player__skip-indicator video-player__skip-indicator_right">
          <span class="video-player__skip-text">+10 сек</span>
        </div>
      </div>
    `;
  }

  loadVideoSource() {
    const file = this.container.dataset.videoFile ||
                 new URLSearchParams(window.location.search).get("file") ||
                 (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
                   ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                   : "");

    const poster = this.container.dataset.videoPoster || "";

    if (file) {
      this.video.src = file;
      if (poster) {
        this.video.poster = poster;
      }
    }
  }

  attachEvents() {
    const playBtn = this.container.querySelector(".video-player__btn_play");
    const volumeBtn = this.container.querySelector(".video-player__btn_volume");
    const volumeRange = this.container.querySelector(".video-player__volume-range");
    const progress = this.container.querySelector(".video-player__progress");
    const fullscreenBtn = this.container.querySelector(".video-player__btn_fullscreen");
    const player = this.container.querySelector(".video-player");

    // Play/Pause
    playBtn.addEventListener("click", () => this.togglePlay());
    this.video.addEventListener("click", () => this.togglePlay());
    this.video.addEventListener("play", () => this.updatePlayState(true));
    this.video.addEventListener("pause", () => this.updatePlayState(false));

    // Progress
    this.video.addEventListener("timeupdate", () => this.updateProgress());
    this.video.addEventListener("loadedmetadata", () => this.updateDuration());
    this.video.addEventListener("progress", () => this.updateBuffer());

    progress.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.startSeek(e);
    });
    progress.addEventListener("click", (e) => {
      if (!this.isDragging) {
        this.seek(e);
      }
    });

    const handleMouseMove = (e) => {
      if (this.isDragging) {
        e.preventDefault();
        this.seek(e);
      }
    };

    const handleMouseUp = () => {
      this.stopSeek();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Volume
    volumeBtn.addEventListener("click", () => this.toggleMute());
    volumeRange.addEventListener("input", (e) => this.setVolume(e.target.value));
    this.video.volume = 1;

    // Fullscreen
    fullscreenBtn.addEventListener("click", () => this.toggleFullscreen());
    document.addEventListener("fullscreenchange", () => this.updateFullscreenIcon());
    document.addEventListener("webkitfullscreenchange", () => this.updateFullscreenIcon());
    document.addEventListener("mozfullscreenchange", () => this.updateFullscreenIcon());
    document.addEventListener("MSFullscreenChange", () => this.updateFullscreenIcon());

    // Double click skip
    this.video.addEventListener("dblclick", (e) => this.handleDoubleClick(e));

    // Controls visibility
    player.addEventListener("mousemove", () => this.showControls());
    player.addEventListener("mouseleave", () => this.hideControls());
    this.video.addEventListener("play", () => this.hideControls());

    // Keyboard
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  updatePlayState(playing) {
    this.isPlaying = playing;
    const playBtn = this.container.querySelector(".video-player__btn_play");
    const player = this.container.querySelector(".video-player");

    if (playing) {
      playBtn.classList.add("video-player__btn_playing");
      player.classList.add("video-player_playing");
    } else {
      playBtn.classList.remove("video-player__btn_playing");
      player.classList.remove("video-player_playing");
    }
  }

  updateProgress() {
    const progress = this.container.querySelector(".video-player__progress-filled");
    const handle = this.container.querySelector(".video-player__progress-handle");
    const currentTime = this.container.querySelector(".video-player__time-current");

    if (!this.isDragging && this.video.duration) {
      const percent = (this.video.currentTime / this.video.duration) * 100;
      progress.style.width = `${percent}%`;
      handle.style.left = `${percent}%`;
    }

    currentTime.textContent = this.formatTime(this.video.currentTime);
  }

  updateDuration() {
    const totalTime = this.container.querySelector(".video-player__time-total");
    totalTime.textContent = this.formatTime(this.video.duration);
  }

  updateBuffer() {
    const buffer = this.container.querySelector(".video-player__progress-buffer");
    if (this.video.buffered.length > 0 && this.video.duration) {
      const bufferedEnd = this.video.buffered.end(this.video.buffered.length - 1);
      const percent = (bufferedEnd / this.video.duration) * 100;
      buffer.style.width = `${percent}%`;
    }
  }

  startSeek(e) {
    this.isDragging = true;
    this.seek(e);
  }

  stopSeek() {
    this.isDragging = false;
  }

  seek(e) {
    if (!this.isDragging && e.type !== "click") return;

    const progress = this.container.querySelector(".video-player__progress");
    const rect = progress.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (this.video.duration) {
      this.video.currentTime = percent * this.video.duration;
    }
  }

  toggleMute() {
    this.video.muted = !this.video.muted;
    const volumeBtn = this.container.querySelector(".video-player__btn_volume");
    const volumeRange = this.container.querySelector(".video-player__volume-range");

    if (this.video.muted) {
      volumeBtn.classList.add("video-player__btn_muted");
      volumeRange.value = 0;
    } else {
      volumeBtn.classList.remove("video-player__btn_muted");
      volumeRange.value = this.video.volume * 100;
    }
  }

  setVolume(value) {
    const volume = value / 100;
    this.video.volume = volume;
    this.video.muted = volume === 0;

    const volumeBtn = this.container.querySelector(".video-player__btn_volume");
    if (volume === 0) {
      volumeBtn.classList.add("video-player__btn_muted");
    } else {
      volumeBtn.classList.remove("video-player__btn_muted");
    }
  }

  toggleFullscreen() {
    const player = this.container.querySelector(".video-player");

    if (!document.fullscreenElement && !document.webkitFullscreenElement &&
        !document.mozFullScreenElement && !document.msFullscreenElement) {
      if (player.requestFullscreen) {
        player.requestFullscreen();
      } else if (player.webkitRequestFullscreen) {
        player.webkitRequestFullscreen();
      } else if (player.mozRequestFullScreen) {
        player.mozRequestFullScreen();
      } else if (player.msRequestFullscreen) {
        player.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  updateFullscreenIcon() {
    const fullscreenBtn = this.container.querySelector(".video-player__btn_fullscreen");
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement ||
                           document.mozFullScreenElement || document.msFullscreenElement);

    if (isFullscreen) {
      fullscreenBtn.classList.add("video-player__btn_fullscreen-active");
    } else {
      fullscreenBtn.classList.remove("video-player__btn_fullscreen-active");
    }
  }

  handleDoubleClick(e) {
    const rect = this.video.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const videoWidth = rect.width;
    const skipIndicator = this.container.querySelector(
      clickX < videoWidth / 2
        ? ".video-player__skip-indicator_left"
        : ".video-player__skip-indicator_right"
    );

    if (clickX < videoWidth / 2) {
      this.video.currentTime = Math.max(0, this.video.currentTime - 10);
    } else {
      this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
    }

    skipIndicator.classList.add("video-player__skip-indicator_active");
    setTimeout(() => {
      skipIndicator.classList.remove("video-player__skip-indicator_active");
    }, 600);
  }

  showControls() {
    const controls = this.container.querySelector(".video-player__controls");
    controls.classList.add("video-player__controls_visible");

    if (this.hideControlsTimeout) {
      clearTimeout(this.hideControlsTimeout);
    }

    this.hideControlsTimeout = setTimeout(() => {
      if (this.isPlaying) {
        controls.classList.remove("video-player__controls_visible");
      }
    }, 3000);
  }

  hideControls() {
    const controls = this.container.querySelector(".video-player__controls");
    if (this.isPlaying) {
      controls.classList.remove("video-player__controls_visible");
    }
  }

  handleKeyboard(e) {
    const player = this.container.querySelector(".video-player");
    if (!player.contains(document.activeElement) && document.activeElement !== document.body) {
      return;
    }

    switch (e.code) {
      case "Space":
        e.preventDefault();
        this.togglePlay();
        break;
      case "ArrowLeft":
        e.preventDefault();
        this.video.currentTime = Math.max(0, this.video.currentTime - 10);
        break;
      case "ArrowRight":
        e.preventDefault();
        this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.setVolume(Math.min(100, this.video.volume * 100 + 10));
        break;
      case "ArrowDown":
        e.preventDefault();
        this.setVolume(Math.max(0, this.video.volume * 100 - 10));
        break;
      case "KeyF":
        e.preventDefault();
        this.toggleFullscreen();
        break;
      case "KeyM":
        e.preventDefault();
        this.toggleMute();
        break;
    }
  }

  formatTime(seconds) {
    if (!isFinite(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
}

// Инициализация
(function initVideoPlayer() {
  const container = document.querySelector(".video-sec__video");
  if (container) {
    new VideoPlayer(container);
  }
})();
