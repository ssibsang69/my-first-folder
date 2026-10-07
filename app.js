/**
 * Cho Chul-Geun Personal Introduction Webpage
 * Interactive Logic & Dynamic Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeroParallax();
  initRamenLab();
  initGuestbook();
  initSmoothScroll();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const html = document.documentElement;
  const toggleIcon = themeToggleBtn.querySelector('.toggle-icon');

  // Check saved theme or default to dark
  const savedTheme = localStorage.getItem('chulgeun_theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, toggleIcon);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('chulgeun_theme', newTheme);
    updateThemeIcon(newTheme, toggleIcon);

    showToast(newTheme === 'dark' ? '🌙 다크 모드로 전환되었습니다.' : '☀️ 라이트 모드로 전환되었습니다.');
  });
}

function updateThemeIcon(theme, iconElem) {
  if (!iconElem) return;
  iconElem.textContent = theme === 'dark' ? '🌙' : '☀️';
}

/* ==========================================================================
   2. Hero Ticker 3D Parallax Tilt Effect
   ========================================================================== */
function initHeroParallax() {
  const ticker = document.querySelector('.hero-ticker');
  if (!ticker) return;

  // Only run if device supports fine mouse pointer
  if (!window.matchMedia('(pointer: fine)').matches) return;

  ticker.addEventListener('mousemove', (e) => {
    const rect = ticker.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    ticker.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
  });

  ticker.addEventListener('mouseleave', () => {
    ticker.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

/* ==========================================================================
   3. Interactive Ramen Lab (라면 연구소)
   ========================================================================== */
const RAMEN_RECIPES = {
  tired: {
    title: '현장 활력 부스터! 얼큰 열라면 국밥',
    emoji: '🔥',
    desc: '온몸이 쑤시고 땀을 한 바가지 흘린 날! 속을 뻥 뚫어주는 얼큰한 국물과 칼칼한 맛으로 피로를 단번에 날려버리는 처방전입니다.',
    secret: '물이 끓을 때 다진 마늘 반 스푼과 쌈장을 살짝 풀어보세요. 국물의 깊이가 3배는 진해집니다. 마지막에 찬밥 말아먹기는 필수!',
    stamina: '★★★★★ (100% 완충)',
    happy: '999+'
  },
  rainy: {
    title: '빗소리 감성 양은냄비 오징어짬뽕',
    emoji: '🌧️',
    desc: '비 오는 날 현장 천막 아래에서 빗소리를 들으며 후루룩 넘기는 뜨끈한 해물 라면! 쌀쌀한 날씨에 이만한 보약이 없습니다.',
    secret: '대파의 흰 부분을 넉넉히 썰어 넣고, 후춧가루를 톡톡 두 번 털어 넣으면 칼칼함과 시원함이 극대화됩니다.',
    stamina: '★★★★☆ (95% 든든함)',
    happy: '980'
  },
  hungry: {
    title: '대식가 철근 특제 라볶이 & 삼겹살 토핑',
    emoji: '🍖',
    desc: '배가 너무 고파서 멧돼지라도 잡을 것 같은 날! 떡과 어묵, 구운 삼겹살까지 올려 푸짐하게 먹는 초대형 에너지 폭탄 라면입니다.',
    secret: '라면스프 1개에 고추장 1스푼, 설탕 0.5스푼 조합! 남은 양념에 참기름 둘러 볶음밥까지 클리어하면 현장 전설이 됩니다.',
    stamina: '★★★★★ (120% 파워업)',
    happy: '1,000+'
  },
  spicy: {
    title: '스트레스 격파! 불닭 볶음면 + 청양고추',
    emoji: '🌶️',
    desc: '답답한 일이 있거나 머리가 복잡할 땐 눈물 핑 도는 매운맛이 정답입니다. 땀 한번 시원하게 흘리고 나면 멘탈이 강철처럼 단단해집니다.',
    secret: '매운 소스에 체다 치즈 한 장과 참기름 몇 방울을 둘러 매콤 고소하게 비벼 드세요. 매운맛과 감칠맛의 황금 밸런스!',
    stamina: '★★★★☆ (스트레스 0%)',
    happy: '990'
  }
};

function initRamenLab() {
  const moodChips = document.querySelectorAll('#mood-chips .chip');
  const textureChips = document.querySelectorAll('#texture-chips .chip');
  const toppingChips = document.querySelectorAll('#topping-chips .chip');
  const generateBtn = document.getElementById('btn-generate-ramen');

  let selectedMood = 'tired';
  let selectedTexture = 'crisp';
  let selectedTopping = 'egg-greenonion';

  // Helper chip selector
  function setupChipGroup(chips, onSelect) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        onSelect(chip.getAttribute('data-value'));
      });
    });
  }

  setupChipGroup(moodChips, (val) => { selectedMood = val; });
  setupChipGroup(textureChips, (val) => { selectedTexture = val; });
  setupChipGroup(toppingChips, (val) => { selectedTopping = val; });

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      generateRamenRecipe(selectedMood, selectedTexture, selectedTopping);
    });
  }
}

function generateRamenRecipe(mood, texture, topping) {
  const recipe = RAMEN_RECIPES[mood] || RAMEN_RECIPES.tired;
  const resultCard = document.getElementById('ramen-result-card');
  const resEmoji = document.getElementById('res-emoji');
  const resTitle = document.getElementById('res-title');
  const resDesc = document.getElementById('res-desc');
  const resSecret = document.getElementById('res-secret');
  const resStamina = document.getElementById('res-stamina');
  const resHappy = document.getElementById('res-happy');

  if (!resultCard) return;

  // Add click animation
  resultCard.style.opacity = '0.5';
  resultCard.style.transform = 'scale(0.98)';

  setTimeout(() => {
    let textureText = '';
    if (texture === 'crisp') textureText = '[면발: 철근 맞춤 꼬들면] ';
    else if (texture === 'normal') textureText = '[면발: 부드러운 표준] ';
    else textureText = '[면발: 국물 푹 밴 푹익힘] ';

    resEmoji.textContent = recipe.emoji;
    resTitle.textContent = textureText + recipe.title;
    resDesc.textContent = recipe.desc;
    resSecret.textContent = recipe.secret;
    resStamina.textContent = recipe.stamina;
    resHappy.textContent = recipe.happy;

    resultCard.style.opacity = '1';
    resultCard.style.transform = 'scale(1)';

    showToast('🍜 조철근의 맞춤 라면 처방전이 나왔습니다!');
  }, 200);
}

/* ==========================================================================
   4. Cheering Board & Guestbook (방명록)
   ========================================================================== */
const DEFAULT_GUESTBOOK_POSTS = [
  {
    id: 1,
    author: '현장 김 반장님',
    tag: '🏗️ 현장 파이팅',
    content: '철근아, 이번 신축 공사 현장 골조 파트에 네 자리 비워뒀다. 너처럼 듬직하고 일머리 좋은 청년은 언제나 환영이다!',
    time: '방금 전'
  },
  {
    id: 2,
    author: '성수동 라면 매니아',
    tag: '🍜 라면 한 그릇',
    content: '라면에 쌈장 반 스푼 넣는 비법 따라 해봤는데 진짜 국물 미쳤네요... 철근 님 쩝쩝박사 인정합니다!',
    time: '2시간 전'
  },
  {
    id: 3,
    author: '마을 이장님',
    tag: '🐗 사냥 레전드',
    content: '지난가을에 뒷산 멧돼지 침착하게 몰아내 주셔서 과수원 배 수확 무사히 끝냈네. 체력과 배짱은 자네가 전국 1등이야!',
    time: '어제'
  },
  {
    id: 4,
    author: '체육관 관장님',
    tag: '🔥 갓생 응원',
    content: '철근이 3대 운동 500 돌파한 지 얼마 안 됐는데 현장 일까지 마스터하면 천하무적이겠네. 부상 없이 건강 챙기자!',
    time: '3일 전'
  }
];

function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const feed = document.getElementById('guestbook-feed');
  const authorInput = document.getElementById('gb-author');
  const contentInput = document.getElementById('gb-content');
  const tagSelect = document.getElementById('gb-tag');
  const charCount = document.getElementById('char-count');

  if (!feed) return;

  // Load from local storage or set defaults
  let posts = [];
  try {
    const stored = localStorage.getItem('chulgeun_guestbook');
    posts = stored ? JSON.parse(stored) : DEFAULT_GUESTBOOK_POSTS;
  } catch (e) {
    posts = DEFAULT_GUESTBOOK_POSTS;
  }

  // Render initial posts
  renderPosts(posts, feed);

  // Character counter
  if (contentInput && charCount) {
    contentInput.addEventListener('input', () => {
      const len = contentInput.value.length;
      charCount.textContent = `${len} / 120자`;
    });
  }

  // Form submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const author = authorInput.value.trim();
      const content = contentInput.value.trim();
      const tag = tagSelect.value;

      if (!author || !content) {
        showToast('⚠️ 이름과 메시지를 입력해 주세요.');
        return;
      }

      const newPost = {
        id: Date.now(),
        author: author,
        tag: tag,
        content: content,
        time: '방금 전'
      };

      posts.unshift(newPost);
      try {
        localStorage.setItem('chulgeun_guestbook', JSON.stringify(posts));
      } catch (err) {
        console.error(err);
      }

      renderPosts(posts, feed);

      // Reset form
      authorInput.value = '';
      contentInput.value = '';
      if (charCount) charCount.textContent = '0 / 120자';

      showToast(`🎉 ${author}님의 따뜻한 응원이 조철근에게 전달되었습니다!`);
    });
  }
}

function renderPosts(posts, container) {
  container.innerHTML = '';
  posts.forEach(post => {
    const item = document.createElement('div');
    item.className = 'gb-item';
    item.innerHTML = `
      <div class="gb-item-header">
        <div class="gb-item-author">
          <span>${escapeHtml(post.author)}</span>
          <span class="gb-item-badge">${escapeHtml(post.tag)}</span>
        </div>
        <span class="gb-item-time">${escapeHtml(post.time)}</span>
      </div>
      <p class="gb-item-text">${escapeHtml(post.content)}</p>
    `;
    container.appendChild(item);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   5. Toast Notification System
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>💬</span><span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode === container) {
      container.removeChild(toast);
    }
  }, 3000);
}

/* ==========================================================================
   6. Smooth Scrolling for Navigation
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
