// Shared likes are stored by Abacus. Browser storage only prevents repeat clicks.
(() => {
  const button = document.querySelector('.profile-like');
  if (!button) return;
  const countLabel = button.querySelector('.like-count');
  const feedback = document.querySelector('.like-feedback');
  const endpoint = 'https://abacus.jasoncameron.dev';
  const counter = 'xudongzhang.cn/homepage-likes';
  const storageKey = 'xudong-homepage-liked';
  const lockName = 'xudong-homepage-like';
  let count = null;
  let busy = false;

  function storedLike() {
    try { return localStorage.getItem(storageKey) === '1'; }
    catch { return false; }
  }
  let liked = storedLike();

  function render() {
    const total = count === null ? 'unavailable' : count.toLocaleString('en-US');
    countLabel.textContent = count === null ? '—' : new Intl.NumberFormat('en-US', {
      notation: count >= 1000 ? 'compact' : 'standard', maximumFractionDigits: 1
    }).format(count);
    button.setAttribute('aria-pressed', String(liked));
    button.setAttribute('aria-disabled', String(liked || busy));
    button.setAttribute('aria-busy', String(busy));
    button.setAttribute('aria-label', `${liked ? 'You liked this website' : 'Like this website'}. Total likes: ${total}.`);
    button.title = liked ? `Thanks for your like! Total likes: ${total}` : `Like this website. Total likes: ${total}`;
    button.disabled = busy;
  }

  function showFeedback(message) {
    feedback.textContent = message;
    feedback.hidden = !message;
  }

  async function requestCount(operation) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(`${endpoint}/${operation}/${counter}`, {
        signal: controller.signal, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer'
      });
      // An unused counter has no likes yet. Only a read may interpret 404 as zero.
      if (operation === 'get' && response.status === 404) return 0;
      if (!response.ok) throw new Error(`Counter request failed: ${response.status}`);
      const data = await response.json();
      if (!Number.isSafeInteger(data.value) || data.value < 0) throw new Error('Invalid counter value');
      return data.value;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function refreshCount() {
    if (busy) return;
    busy = true;
    render();
    try {
      count = await requestCount('get');
      showFeedback('');
    } catch {
      showFeedback('Likes are temporarily unavailable. Please try again later.');
    } finally {
      busy = false;
      render();
    }
  }

  async function submitLike() {
    // Check again inside the cross-tab lock before changing the shared counter.
    if (liked || storedLike()) {
      liked = true;
      render();
      return;
    }
    count = await requestCount('hit');
    liked = true;
    try { localStorage.setItem(storageKey, '1'); }
    catch { /* Still remember the successful like for this page session. */ }
    showFeedback('Thank you!');
  }

  button.addEventListener('click', async () => {
    if (busy || liked) return;
    busy = true;
    showFeedback('');
    render();
    try {
      if (navigator.locks && typeof navigator.locks.request === 'function') {
        await navigator.locks.request(lockName, submitLike);
      } else {
        await submitLike();
      }
    } catch {
      // Do not claim success or automatically retry a potentially completed write.
      showFeedback('Could not confirm your like. Please try again later.');
    } finally {
      busy = false;
      render();
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key === storageKey && event.newValue === '1') {
      liked = true;
      render();
      void refreshCount();
    }
  });
  window.addEventListener('online', () => { void refreshCount(); });
  button.hidden = false;
  render();
  void refreshCount();
})();
