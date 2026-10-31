const CONFIG = {
  relationshipStartDate: '2022-11-01',
  secretQuestion: 'What is our special date?',
  secretAnswer: '11.01.22',
  // Add a local track such as 'assets/music/our-song.mp3' to use your own music.
  musicSource: 'assets/music/herewithme.mp3',
  memories: [
    // Replace these sample image paths and captions with your own photos and memories.
    { src: 'assets/images/dem5.jpg', alt: 'A couple holding hands while walking across a hillside', caption: 'pa ingong tag lodge memorable', date: '12.14.22', tone: 'is-mono', note: 'the beginning' },
    { src: 'assets/images/dem6.jpg', alt: 'A golden sunrise over a quiet hillside', caption: 'My graduation nya naa akong special girl', date: '06.16.26', tone: 'is-warm', note: 'one of those quiet days' },
    { src: 'assets/images/dem7.jpg', alt: 'A close-up of bright orange poppies', caption: 'Ur graduation nya naa imong uyab na cute', date: '06.21.25', tone: 'is-warm', note: 'the little things' },
    { src: 'assets/images/dem8.jpg', alt: 'A smiling woman in a red top against a dark background', caption: 'first time nagdate sa diwanag nya mo uli nako pagka ugma', date: '12.14.22', tone: 'is-mono', note: 'you, always' },
    { src: 'assets/images/dem9.jpg', alt: 'Two flower-decorated chairs in a sunlit garden', caption: 'ligog dagat with adlay liners', date: '07.12.25', tone: 'is-mono', note: 'room for all our tomorrows' },
    { src: 'assets/images/dem10.jpg', alt: 'A couple holding hands while walking across a hillside', caption: 'mao man guro ni first time ta nag esmeringhoy', date: '11.02.22', tone: 'is-warm', note: 'and all the days after' }
  ],
  timeline: [
    { date: '01 NOVEMBER 2022', title: 'The first date', copy: 'The memorable na moment satoa kay mao maning first time ta ga date bag o pa kaayo ta nagkita nag jorge town nata thankful kayko karon layo na kayta og literal na layo nakayta LLDR na pero karon 4years nata mil kasal nalang kulang.', image: 'assets/images/dem1.jpg', alt: 'A couple holding hands while walking across a hillside', caption: 'the day everything changed', tone: 'is-mono', note: 'I would find you again.' },
    { date: '21 JUNE 2025', title: 'A little achievements', copy: 'Graduation nimo support rako pirmi nimo og proud kayko ani na time sa imoha wa damha graduate na og naa pajud ko bahalag wala kasulod nag effort man sad kog decorate sa imohang banner sa inyong balay maong proud kayko sa imong na achieve that day.', image: 'assets/images/dem12.jpg', alt: 'A golden sunrise over a quiet hillside', caption: 'gold on the horizon', tone: 'is-warm' },
    { date: '27 JUNE 2023', title: 'The everyday magic', copy: 'A thousand small things, none of them small to me.', textOnly: true, note: 'the laughs that lasted longer than the night ♡' },
    { date: '16 JUNE 2026', title: 'A little achievements', copy: 'the day na ning apas nalang mong bulandat sa graduation kay di ta maigo sa motor nya daghan kaytag ganap pag uli thankful og blessed sad kayko ato na time kay naa ka og special day sad nako completo tanan mao sad na akong memorable na mga moment.', image: 'assets/images/dem13.jpg', alt: 'Two flower-decorated chairs in a sunlit garden', caption: 'a place for two', tone: 'is-mono' }
  ]
};

const coverScreen = document.querySelector('#coverScreen');
const gateScreen = document.querySelector('#gateScreen');
const gatePaper = document.querySelector('#gatePaper');
const secretQuestion = document.querySelector('#secretQuestion');
const secretForm = document.querySelector('#secretForm');
const secretAnswer = document.querySelector('#secretAnswer');
const gateFeedback = document.querySelector('#gateFeedback');
const siteContent = document.querySelector('#siteContent');
const galleryBoard = document.querySelector('#galleryBoard');
const timeline = document.querySelector('#timeline');
const memoryFilm = document.querySelector('#memoryFilm');
const filmScene = document.querySelector('#filmScene');
const filmImage = document.querySelector('#filmImage');
const filmDate = document.querySelector('#filmDate');
const filmCaption = document.querySelector('#filmCaption');
const filmNote = document.querySelector('#filmNote');
const filmCounter = document.querySelector('#filmCounter');
const filmProgress = document.querySelector('#filmProgress');
const filmProgressTrack = document.querySelector('#filmProgressTrack');
const filmPlayback = document.querySelector('#filmPlayback');
const lightbox = document.querySelector('#lightbox');
const lightboxPrint = document.querySelector('#lightboxPrint');
const localSong = document.querySelector('#localSong');
const musicToggle = document.querySelector('#musicToggle');
const musicLabel = document.querySelector('.music-label');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let activePhoto = 0;
let slideshowTimer = null;
let slideshowPlaying = true;
let audioContext = null;
let musicMaster = null;
let musicOscillators = [];
let musicPlaying = false;
let chordTimer = null;
let touchStartX = null;
let filmIndex = 0;
let filmPlaying = false;
let filmElapsed = 0;
let filmStartedAt = 0;
let filmTimer = null;
const FILM_FRAME_DURATION = 5200;

function normalizeAnswer(value) {
  return value.trim().toLocaleLowerCase().replace(/[^a-z0-9]/g, '');
}

function startExperience() {
  coverScreen.classList.add('is-hidden');
  gateScreen.classList.remove('is-hidden');
  secretQuestion.textContent = CONFIG.secretQuestion;
  secretAnswer.focus({ preventScroll: true });
}

function unlockExperience(event) {
  event.preventDefault();
  if (normalizeAnswer(secretAnswer.value) !== normalizeAnswer(CONFIG.secretAnswer)) {
    gateFeedback.textContent = 'Not quite. Take another little guess.';
    gatePaper.classList.remove('shake');
    void gatePaper.offsetWidth;
    gatePaper.classList.add('shake');
    secretAnswer.select();
    return;
  }
  gateScreen.classList.add('is-hidden');
  siteContent.classList.remove('is-hidden');
  document.body.classList.add('is-unlocked');
  updateDateDetails();
  renderGallery();
  renderTimeline();
  observeReveals();
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
}

function updateDateDetails() {
  const [year, month, day] = CONFIG.relationshipStartDate.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  document.querySelector('#coverYear').textContent = String(year);
  document.querySelector('#openingYear').textContent = String(year);
  document.querySelector('#dateDay').textContent = String(day).padStart(2, '0');
  document.querySelector('#dateMonth').textContent = date.toLocaleDateString('en', { month: 'long' }).toUpperCase();
  document.querySelector('#dateYear').textContent = String(year);
  document.querySelector('#dateWeekday').textContent = `${date.toLocaleDateString('en', { weekday: 'long' }).toUpperCase()}, OUR FIRST PAGE`;
  const elapsed = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
  document.querySelector('#daysTogether').textContent = `${elapsed.toLocaleString()} DAYS AND COUNTING`;
}

function renderGallery() {
  galleryBoard.replaceChildren();
  CONFIG.memories.forEach((memory, index) => {
    const card = document.createElement('figure');
    const baseTilt = [-4, 3, -2, 4, -3, 2][index % 6];
    const tilt = baseTilt + (Math.random() * 2 - 1);
    card.className = `polaroid reveal ${memory.tone || ''}`;
    card.style.setProperty('--rotation', `${tilt.toFixed(1)}deg`);
    card.style.setProperty('--float-delay', `${(index % 4) * -1.1}s`);
    card.style.setProperty('--float-duration', `${6 + (index % 4)}s`);
    card.innerHTML = `
      <button class="polaroid-button" type="button" data-photo="${index}" aria-label="Open photo: ${memory.caption}, ${memory.date}">
        <img src="${memory.src}" alt="${memory.alt}" loading="lazy" />
      </button>
      <figcaption><span class="polaroid-caption">${memory.caption}</span><span class="polaroid-date">${memory.date}</span></figcaption>
    `;
    galleryBoard.append(card);
    card.querySelector('button').addEventListener('click', () => openPhoto(index));
  });
}

function renderTimeline() {
  timeline.replaceChildren();
  CONFIG.timeline.forEach((moment, index) => {
    const entry = document.createElement('article');
    entry.className = `timeline-entry reveal${moment.textOnly ? ' text-only' : ''}`;
    const note = moment.note ? `<span class="timeline-note">${moment.note}</span>` : '';
    const copy = `<div class="timeline-copy"><span class="timeline-date">${moment.date}</span><h3>${moment.title}</h3><p>${moment.copy}</p>${note}</div>`;
    const visual = moment.image ? `<figure class="timeline-visual ${moment.tone || ''}" style="--timeline-tilt:${index % 2 ? '-3deg' : '3deg'}"><img src="${moment.image}" alt="${moment.alt}" loading="lazy" /><figcaption>${moment.caption}</figcaption></figure>` : '';
    entry.innerHTML = `${copy}${visual}`;
    timeline.append(entry);
  });
}

function openPhoto(index) {
  activePhoto = index;
  slideshowPlaying = !reducedMotion;
  renderLightboxPhoto();
  lightbox.showModal();
  updateSlideshowButton();
  startSlideshow();
}

function renderLightboxPhoto() {
  const memory = CONFIG.memories[activePhoto];
  lightboxPrint.innerHTML = `<img src="${memory.src}" alt="${memory.alt}" class="${memory.tone || ''}" /><figcaption>${memory.caption} <span>·</span> ${memory.date}</figcaption>`;
  lightboxPrint.className = `lightbox-print ${memory.tone || ''}`;
  lightboxPrint.style.animation = 'none';
  void lightboxPrint.offsetWidth;
  lightboxPrint.style.animation = '';
  document.querySelector('#lightboxCount').textContent = `${String(activePhoto + 1).padStart(2, '0')} / ${String(CONFIG.memories.length).padStart(2, '0')}`;
  document.querySelector('#lightboxNote').textContent = CONFIG.memories[activePhoto].note || 'A MOMENT KEPT CLOSE';
}

function movePhoto(direction) {
  activePhoto = (activePhoto + direction + CONFIG.memories.length) % CONFIG.memories.length;
  renderLightboxPhoto();
  if (slideshowPlaying) startSlideshow();
}

function startSlideshow() {
  window.clearInterval(slideshowTimer);
  if (!slideshowPlaying) return;
  slideshowTimer = window.setInterval(() => movePhoto(1), 5200);
}

function toggleSlideshow() {
  slideshowPlaying = !slideshowPlaying;
  updateSlideshowButton();
  if (slideshowPlaying) startSlideshow();
  else window.clearInterval(slideshowTimer);
}

function updateSlideshowButton() {
  const button = document.querySelector('#slideshowToggle');
  button.setAttribute('aria-pressed', String(slideshowPlaying));
  button.innerHTML = slideshowPlaying ? 'Ⅱ &nbsp; PAUSE' : '▶ &nbsp; PLAY';
}

function closeLightbox() {
  window.clearInterval(slideshowTimer);
  if (lightbox.open) lightbox.close();
}

function updateFilmProgress() {
  const totalScenes = CONFIG.memories.length + 1;
  const sceneProgress = filmIndex + Math.min(filmElapsed / FILM_FRAME_DURATION, 1);
  const percent = Math.min(100, (sceneProgress / totalScenes) * 100);
  filmProgress.style.width = `${percent}%`;
  filmProgressTrack.setAttribute('aria-valuenow', String(Math.round(percent)));
}

function updateFilmPlaybackButton() {
  filmPlayback.setAttribute('aria-pressed', String(filmPlaying));
  filmPlayback.textContent = filmPlaying ? 'Ⅱ  PAUSE FILM' : filmIndex === CONFIG.memories.length ? '↻  REPLAY FILM' : '▶  PLAY FILM';
}

function renderFilmScene() {
  const isFinalScene = filmIndex === CONFIG.memories.length;
  const memory = CONFIG.memories[Math.min(filmIndex, CONFIG.memories.length - 1)];
  filmImage.src = memory.src;
  filmImage.alt = memory.alt;
  filmDate.textContent = isFinalScene ? 'ALWAYS, STILL' : memory.date;
  filmCaption.textContent = isFinalScene ? 'Still my favorite story.' : memory.caption;
  filmNote.textContent = isFinalScene
    ? 'Happy anniversary, my love. Here is to every day still waiting for us.'
    : memory.note;
  filmCounter.textContent = isFinalScene
    ? 'A NOTE FROM THE HEART'
    : `${String(filmIndex + 1).padStart(2, '0')} / ${String(CONFIG.memories.length + 1).padStart(2, '0')}`;
  filmScene.classList.toggle('is-finale', isFinalScene);
  filmScene.classList.remove('scene-change');
  void filmScene.offsetWidth;
  filmScene.classList.add('scene-change');
  updateFilmProgress();
}

function startFilmPlayback() {
  window.clearInterval(filmTimer);
  filmPlaying = true;
  filmStartedAt = performance.now() - filmElapsed;
  filmTimer = window.setInterval(() => {
    filmElapsed = performance.now() - filmStartedAt;
    if (filmElapsed >= FILM_FRAME_DURATION) {
      if (filmIndex < CONFIG.memories.length) {
        filmIndex += 1;
        filmElapsed = 0;
        renderFilmScene();
        filmStartedAt = performance.now();
      } else {
        filmElapsed = FILM_FRAME_DURATION;
        filmPlaying = false;
        window.clearInterval(filmTimer);
        filmTimer = null;
      }
    }
    updateFilmProgress();
    updateFilmPlaybackButton();
  }, 80);
  updateFilmPlaybackButton();
}

function openMemoryFilm() {
  filmIndex = 0;
  filmElapsed = 0;
  renderFilmScene();
  memoryFilm.showModal();
  startFilmPlayback();
  if (!musicPlaying) void toggleMusic();
}

function closeMemoryFilm() {
  window.clearInterval(filmTimer);
  filmTimer = null;
  filmPlaying = false;
  filmElapsed = 0;
  updateFilmPlaybackButton();
  if (memoryFilm.open) memoryFilm.close();
}

function toggleFilmPlayback() {
  if (filmPlaying) {
    filmElapsed = Math.min(FILM_FRAME_DURATION, performance.now() - filmStartedAt);
    filmPlaying = false;
    window.clearInterval(filmTimer);
    filmTimer = null;
    updateFilmProgress();
    updateFilmPlaybackButton();
    return;
  }
  if (filmIndex === CONFIG.memories.length) {
    filmIndex = 0;
    filmElapsed = 0;
    renderFilmScene();
  }
  startFilmPlayback();
}

function moveFilmScene(direction) {
  const totalScenes = CONFIG.memories.length + 1;
  filmIndex = (filmIndex + direction + totalScenes) % totalScenes;
  filmElapsed = 0;
  renderFilmScene();
  if (filmPlaying) filmStartedAt = performance.now();
  updateFilmPlaybackButton();
}

function revealLetter() {
  const message = document.querySelector('#finalMessage');
  const button = document.querySelector('#revealLetter');
  const willExpand = message.classList.contains('is-hidden');
  message.classList.toggle('is-hidden', !willExpand);
  button.setAttribute('aria-expanded', String(willExpand));
  button.innerHTML = willExpand ? 'KEEP THIS NOTE <span aria-hidden="true">♡</span>' : 'READ THE REST <span aria-hidden="true">↓</span>';
}

function replayExperience() {
  closeLightbox();
  document.querySelector('#finalMessage').classList.add('is-hidden');
  document.querySelector('#revealLetter').setAttribute('aria-expanded', 'false');
  document.querySelector('#revealLetter').innerHTML = 'READ THE REST <span aria-hidden="true">↓</span>';
  siteContent.classList.add('is-hidden');
  gateScreen.classList.add('is-hidden');
  coverScreen.classList.remove('is-hidden');
  document.body.classList.remove('is-unlocked');
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
}

const chordSet = [
  [261.63, 329.63, 392.00],
  [220.00, 261.63, 329.63],
  [174.61, 220.00, 261.63],
  [196.00, 246.94, 293.66]
];

function updateMusicButton() {
  musicToggle.setAttribute('aria-pressed', String(musicPlaying));
  musicToggle.setAttribute('aria-label', musicPlaying ? 'Pause music' : 'Play music');
  musicLabel.textContent = musicPlaying ? 'SOUND ON' : 'SOUND OFF';
}

async function toggleMusic() {
  if (CONFIG.musicSource) {
    if (!localSong.src) localSong.src = CONFIG.musicSource;
    try {
      if (localSong.paused) await localSong.play();
      else localSong.pause();
      musicPlaying = !localSong.paused;
      updateMusicButton();
    } catch {
      musicLabel.textContent = 'ADD YOUR SONG';
    }
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    musicLabel.textContent = 'MUSIC UNAVAILABLE';
    return;
  }
  if (!audioContext) {
    audioContext = new AudioContextClass();
    musicMaster = audioContext.createGain();
    musicMaster.gain.value = 0;
    musicMaster.connect(audioContext.destination);
    chordSet[0].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const voice = audioContext.createGain();
      oscillator.type = index === 0 ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      voice.gain.value = index === 0 ? .2 : .075;
      oscillator.connect(voice);
      voice.connect(musicMaster);
      oscillator.start();
      musicOscillators.push(oscillator);
    });
  }
  if (audioContext.state === 'suspended') await audioContext.resume();
  musicPlaying = !musicPlaying;
  musicMaster.gain.setTargetAtTime(musicPlaying ? .22 : 0, audioContext.currentTime, .9);
  if (musicPlaying && !chordTimer) {
    let chordIndex = 0;
    chordTimer = window.setInterval(() => {
      chordIndex = (chordIndex + 1) % chordSet.length;
      chordSet[chordIndex].forEach((frequency, index) => {
        musicOscillators[index].frequency.setTargetAtTime(frequency, audioContext.currentTime, 1.5);
      });
    }, 7000);
  }
  if (!musicPlaying && chordTimer) {
    window.clearInterval(chordTimer);
    chordTimer = null;
  }
  updateMusicButton();
}

function observeReveals() {
  const items = document.querySelectorAll('.reveal:not(.is-visible)');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -35px 0px' });
  items.forEach((item) => observer.observe(item));
}

document.querySelector('#beginStory').addEventListener('click', startExperience);
secretForm.addEventListener('submit', unlockExperience);
document.querySelector('#previousPhoto').addEventListener('click', () => movePhoto(-1));
document.querySelector('#nextPhoto').addEventListener('click', () => movePhoto(1));
document.querySelector('#closeLightbox').addEventListener('click', closeLightbox);
document.querySelector('#slideshowToggle').addEventListener('click', toggleSlideshow);
document.querySelector('#revealLetter').addEventListener('click', revealLetter);
document.querySelector('#replayExperience').addEventListener('click', replayExperience);
document.querySelector('#playMemoryFilm').addEventListener('click', openMemoryFilm);
document.querySelector('#closeMemoryFilm').addEventListener('click', closeMemoryFilm);
document.querySelector('#previousFilmScene').addEventListener('click', () => moveFilmScene(-1));
document.querySelector('#nextFilmScene').addEventListener('click', () => moveFilmScene(1));
filmPlayback.addEventListener('click', toggleFilmPlayback);
musicToggle.addEventListener('click', toggleMusic);
memoryFilm.addEventListener('click', (event) => { if (event.target === memoryFilm) closeMemoryFilm(); });
memoryFilm.addEventListener('close', () => {
  window.clearInterval(filmTimer);
  filmTimer = null;
  filmPlaying = false;
  updateFilmPlaybackButton();
});
memoryFilm.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); moveFilmScene(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); moveFilmScene(1); }
  if (event.key === ' ') { event.preventDefault(); toggleFilmPlayback(); }
});
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
lightbox.addEventListener('close', () => window.clearInterval(slideshowTimer));
lightbox.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); movePhoto(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); movePhoto(1); }
});
lightbox.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
lightbox.addEventListener('touchend', (event) => {
  if (touchStartX === null) return;
  const difference = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(difference) > 45) movePhoto(difference > 0 ? -1 : 1);
  touchStartX = null;
}, { passive: true });
memoryFilm.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
memoryFilm.addEventListener('touchend', (event) => {
  if (touchStartX === null) return;
  const difference = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(difference) > 45) moveFilmScene(difference > 0 ? -1 : 1);
  touchStartX = null;
}, { passive: true });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && memoryFilm.open) {
    event.preventDefault();
    closeMemoryFilm();
    return;
  }
  if (event.key === 'Escape' && lightbox.open) closeLightbox();
});

document.querySelectorAll('.site-nav a, .wordmark[href="#top"], .underlined-link').forEach((link) => {
  link.addEventListener('click', () => {
    window.setTimeout(observeReveals, 80);
  });
});
