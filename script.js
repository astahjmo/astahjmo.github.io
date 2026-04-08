/* ============================================
   [ ASTAROTH ] - TUI Blog Engine
   ============================================ */

// =============================================
// APPLY SAVED THEME IMMEDIATELY (before boot)
// =============================================
try {
  if (localStorage.getItem('astaroth-theme') === 'light') {
    document.body.classList.add('theme-light');
  }
} catch(e) {}

// =============================================
// BOOT SEQUENCE
// =============================================
(function() {
  const bootScreen = document.getElementById('boot-screen');
  const bootLog = document.getElementById('boot-log');
  const progressWrap = document.getElementById('boot-progress-wrap');
  const progressFill = document.getElementById('boot-progress-fill');
  const progressPct = document.getElementById('boot-progress-pct');
  const modeSelect = document.getElementById('mode-select');
  const matrixCanvas = document.getElementById('boot-matrix');

  if (!bootScreen || !bootLog) return;

  // Standard Galactic Alphabet (Minecraft enchantment table)
  const SGA = {
    'a':'ᔑ','b':'ʖ','c':'ᓵ','d':'↸','e':'ᒷ','f':'⎓','g':'⊣',
    'h':'⍑','i':'╎','j':'⋮','k':'ꖌ','l':'ꖎ','m':'ᒲ',
    'n':'リ','o':'𝙹','p':'!¡','q':'ᑑ','r':'∷','s':'ᓭ',
    't':'ℸ ̈','u':'⚍','v':'⊬','w':'∴','x':'̇/','y':'||','z':'⨅',
    'A':'ᔑ','B':'ʖ','C':'ᓵ','D':'↸','E':'ᒷ','F':'⎓','G':'⊣',
    'H':'⍑','I':'╎','J':'⋮','K':'ꖌ','L':'ꖎ','M':'ᒲ',
    'N':'リ','O':'𝙹','P':'!¡','Q':'ᑑ','R':'∷','S':'ᓭ',
    'T':'ℸ ̈','U':'⚍','V':'⊬','W':'∴','X':'̇/','Y':'||','Z':'⨅'
  };

  function toSGA(text) {
    return text.split('').map(c => SGA[c] || c).join('');
  }

  // SGA Matrix Rain background
  const sgaChars = Object.values(SGA).filter((v, i, a) => a.indexOf(v) === i);
  let matrixInterval = null;

  if (matrixCanvas) {
    const mCtx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const isLight = document.body.classList.contains('theme-light');
    const matrixColor = isLight ? '#006b1f' : '#00ff41';
    const matrixHighlight = isLight ? '#004410' : '#ffffff';
    const matrixFade = isLight ? 'rgba(232, 232, 232, 0.06)' : 'rgba(0, 0, 0, 0.06)';

    const fontSize = 16;
    const cols = Math.floor(matrixCanvas.width / fontSize);
    const drops = Array(cols).fill(0).map(() => Math.random() * -50 | 0);

    function drawMatrix() {
      mCtx.fillStyle = matrixFade;
      mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      mCtx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = sgaChars[Math.floor(Math.random() * sgaChars.length)];
        mCtx.fillStyle = Math.random() > 0.95 ? matrixHighlight : matrixColor;
        mCtx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    matrixInterval = setInterval(drawMatrix, 50);
  }

  const lines = [
    { text: `${toSGA('BIOS')} v3.66.1 - ${toSGA('ASTAROTH SYSTEMS')}`, cls: 'line-info', ms: 60 },
    { text: `${toSGA('Copyright')} (C) 2004-2026 ${toSGA('Astaroth Corp')}`, cls: 'line-info', ms: 40 },
    { text: '', cls: 'line-info', ms: 30 },
    { text: `${toSGA('Detecting hardware')}...`, cls: 'line-white', ms: 200 },
    { text: `  CPU: ${toSGA('Ryzen')} 9 9950X ............. [OK]`, cls: 'line-ok', ms: 100 },
    { text: `  RAM: 32768 MB DDR5 ................. [OK]`, cls: 'line-ok', ms: 80 },
    { text: `  GPU: ${toSGA('RTX')} 5090 .................. [OK]`, cls: 'line-ok', ms: 90 },
    { text: `  ${toSGA('NVMe')}: 2TB SSD .................. [OK]`, cls: 'line-ok', ms: 70 },
    { text: '', cls: 'line-info', ms: 30 },
    { text: `${toSGA('Loading kernel')}... vmlinuz-6.19.9`, cls: 'line-white', ms: 200 },
    { text: `[  0.00] ${toSGA('Linux version')} 6.19.9`, cls: 'line-info', ms: 60 },
    { text: `[  0.10] ${toSGA('Mounting root filesystem')}...`, cls: 'line-info', ms: 80 },
    { text: '', cls: 'line-info', ms: 20 },
    { text: `${toSGA('Starting services')}...`, cls: 'line-white', ms: 150 },
    { text: `  ${toSGA('journald')} ...................... [OK]`, cls: 'line-ok', ms: 60 },
    { text: `  ${toSGA('networkd')} ...................... [OK]`, cls: 'line-ok', ms: 50 },
    { text: `  ${toSGA('sshd')} .......................... [OK]`, cls: 'line-ok', ms: 50 },
    { text: `  ${toSGA('firewalld')} ..................... [OK]`, cls: 'line-ok', ms: 50 },
    { text: `  ${toSGA('nginx')} ......................... [OK]`, cls: 'line-ok', ms: 60 },
    { text: '', cls: 'line-info', ms: 20 },
    { text: `> ${toSGA('Initializing TUI interface')}...`, cls: 'line-accent', ms: 300 },
    { text: '__PROGRESS__', cls: '', ms: 0 },
    { text: '', cls: 'line-info', ms: 100 },
    { text: `${toSGA('System ready')}.`, cls: 'line-ok', ms: 200 },
    { text: '__DONE__', cls: '', ms: 0 },
  ];

  function addLine(text, cls) {
    const el = document.createElement('div');
    el.className = `line ${cls}`;
    el.textContent = text;
    bootLog.appendChild(el);
    bootLog.scrollTop = bootLog.scrollHeight;
  }

  function showProgress() {
    return new Promise(resolve => {
      progressWrap.style.display = 'block';
      let pct = 0;
      const iv = setInterval(() => {
        pct = Math.min(pct + Math.random() * 10 + 3, 100);
        progressFill.style.width = pct + '%';
        progressPct.textContent = Math.floor(pct) + '%';
        if (pct >= 100) {
          clearInterval(iv);
          progressPct.textContent = '100% ── DONE';
          setTimeout(resolve, 200);
        }
      }, 50);
    });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function runBoot() {
    for (const line of lines) {
      if (line.text === '__PROGRESS__') { await showProgress(); continue; }
      if (line.text === '__DONE__') { break; }
      addLine(line.text, line.cls);
      if (line.ms) await sleep(line.ms);
    }

    await sleep(400);
    if (typeof matrixInterval !== 'undefined') clearInterval(matrixInterval);
    bootScreen.classList.add('boot-done');
    await sleep(600);
    bootScreen.style.display = 'none';
    modeSelect.classList.remove('hidden');
    initModeSelect();
  }

  runBoot();
})();


// =============================================
// MODE SELECT
// =============================================
function initModeSelect() {
  const screen = document.getElementById('mode-select');
  const options = screen.querySelectorAll('.mode-option');
  const tui = document.getElementById('tui');
  let selected = 0;

  function render() {
    options.forEach((opt, i) => {
      opt.classList.toggle('selected', i === selected);
      opt.querySelector('.mode-marker').textContent = i === selected ? '▸' : ' ';
    });
  }

  function confirm() {
    const mode = options[selected].dataset.mode;
    screen.classList.add('fade-out');
    setTimeout(() => {
      screen.style.display = 'none';
      tui.classList.remove('hidden');
      initTUI(mode);
    }, 500);
  }

  function handler(e) {
    const key = e.key;
    if (key === 'ArrowUp' || key === 'k') { selected = 0; render(); e.preventDefault(); }
    else if (key === 'ArrowDown' || key === 'j') { selected = 1; render(); e.preventDefault(); }
    else if (key === 'Enter') { document.removeEventListener('keydown', handler); confirm(); }
    else if (key === '1') { selected = 0; render(); document.removeEventListener('keydown', handler); confirm(); }
    else if (key === '2') { selected = 1; render(); document.removeEventListener('keydown', handler); confirm(); }
  }

  options.forEach((opt, i) => {
    opt.addEventListener('click', () => {
      selected = i;
      render();
      document.removeEventListener('keydown', handler);
      confirm();
    });
  });

  document.addEventListener('keydown', handler);
  render();
}


/* ============================================
   [ ASTAROTH ] - TUI Engine v2
   Pane Manager + Nav Stack + Vim Motor
   ============================================ */

function initTUI(inputMode) {

// =============================================
// NAV STACK - navigation as a graph
// =============================================
const navStack = {
  stack: [{ view: 'home', data: null }],
  push(view, data) {
    this.stack.push({ view, data });
    this.render();
  },
  pop() {
    if (this.stack.length > 1) {
      this.stack.pop();
      vim.clearBlockSelection();
      if (vim.mode === 'VISUAL') vim.setMode('NORMAL');
      this.render();
      return true;
    }
    return false;
  },
  current() { return this.stack[this.stack.length - 1]; },
  depth() { return this.stack.length; },
  render() {
    const { view, data } = this.current();
    contentViews.show(view, data);
    vim.updateStatus();
  },
  reset(view) {
    this.stack = [{ view: view || 'home', data: null }];
    vim.clearBlockSelection();
    if (vim.mode === 'VISUAL') vim.setMode('NORMAL');
    this.render();
  }
};

// =============================================
// PANE MANAGER
// =============================================
const panes = {
  list: [
    { id: 'panel-left', name: 'PROFILE', el: document.getElementById('panel-left') },
    { id: 'panel-content', name: 'CONTENT', el: document.getElementById('panel-content') },
    { id: 'panel-right', name: 'SHOUTBOX', el: document.getElementById('panel-right') },
  ],
  active: 1,
  floating: null, // currently open floating pane

  focus(idx) {
    if (idx < 0 || idx >= this.list.length) return;
    this.active = idx;
    this.list.forEach((p, i) => {
      if (p.el) p.el.classList.toggle('panel-focus', i === idx);
    });
    vim.updateStatus();
  },

  focusLeft() { this.focus(Math.max(0, this.active - 1)); },
  focusRight() { this.focus(Math.min(this.list.length - 1, this.active + 1)); },

  getScrollable() {
    const p = this.list[this.active];
    return p && p.el ? p.el.querySelector('.tui-panel-body') : null;
  },

  scroll(amount) {
    const el = this.getScrollable();
    if (el) el.scrollTop += amount;
  },

  // Floating pane management
  openFloat(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('hidden');
    this.floating = id;
    // Init drag
    this._initDrag(el);
  },

  closeFloat() {
    if (this.floating) {
      const el = document.getElementById(this.floating);
      if (el) el.classList.add('hidden');
      this.floating = null;
      document.body.focus();
    }
  },

  isFloatOpen() { return this.floating !== null; },

  _initDrag(el) {
    const header = el.querySelector('.search-header, .float-header');
    if (!header || header._dragInit) return;
    header._dragInit = true;
    header.style.cursor = 'move';

    let dragging = false, startX, startY, origX, origY;

    header.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.position = 'fixed';
      el.style.left = (origX + dx) + 'px';
      el.style.top = (origY + dy) + 'px';
      el.style.transform = 'none';
    });

    window.addEventListener('mouseup', () => { dragging = false; });
  }
};

// Click to focus panes
panes.list.forEach((p, i) => {
  if (p.el) p.el.addEventListener('mousedown', () => panes.focus(i));
});

// =============================================
// VIM ENGINE
// =============================================
const vim = {
  mode: 'NORMAL',    // NORMAL | INSERT | COMMAND | SEARCH
  isVimNav: inputMode === 'vim',
  countBuf: '',       // for 5j etc
  keyBuf: '',         // for gg etc
  keyTimer: null,
  selectedPost: 0,
  selectedBlock: -1,  // current block cursor inside a post
  visualAnchor: -1,   // start of visual selection

  // DOM refs
  modeEl: document.getElementById('vim-mode'),
  fileEl: document.getElementById('vim-file'),
  posEl: document.getElementById('vim-pos'),
  modeTypeEl: document.getElementById('vim-mode-type'),
  cmdLine: document.getElementById('tui-commandline'),
  cmdInput: document.getElementById('cmd-input'),
  msgEl: document.getElementById('vim-command'),

  setMode(mode) {
    this.mode = mode;
    this.modeEl.textContent = mode;
    this.modeEl.className = 'vim-mode mode-' + mode.toLowerCase();
  },

  showMsg(msg, duration) {
    this.msgEl.textContent = msg;
    clearTimeout(this._msgTimer);
    this._msgTimer = setTimeout(() => { this.msgEl.textContent = ''; }, duration || 3000);
  },

  updateStatus() {
    const cur = navStack.current();
    const tabFiles = { home: 'posts.md', about: 'about.md', links: 'links.md', guestbook: 'guestbook.md', post: 'post.md' };
    const panelNames = ['~/profile', null, '~/shoutbox'];
    if (panes.active === 1) {
      const depth = navStack.depth() > 1 ? ` [${navStack.depth()}]` : '';
      this.fileEl.textContent = `~/blog/${tabFiles[cur.view] || 'posts.md'}${depth}`;
    } else {
      this.fileEl.textContent = panelNames[panes.active] || '';
    }
    const el = panes.getScrollable();
    const ln = el ? Math.max(1, Math.ceil(el.scrollTop / 20) + 1) : 1;
    this.posEl.textContent = `Ln ${ln}`;
  },

  getCount() {
    const n = parseInt(this.countBuf) || 1;
    this.countBuf = '';
    return n;
  },

  // Post selection
  getPostEls() { return document.querySelectorAll('#post-list .tui-post'); },

  selectPost(idx) {
    const els = this.getPostEls();
    if (idx < 0 || idx >= els.length) return;
    this.selectedPost = idx;
    els.forEach((p, i) => p.classList.toggle('post-selected', i === idx));
    els[idx].scrollIntoView({ block: 'nearest', behavior: 'auto' });
  },

  // Search result selection
  searchIdx: 0,
  selectSearchResult(idx) {
    const results = document.querySelectorAll('#search-results .search-result');
    if (!results.length) return;
    idx = Math.max(0, Math.min(idx, results.length - 1));
    this.searchIdx = idx;
    results.forEach((r, i) => r.classList.toggle('search-selected', i === idx));
    results[idx].scrollIntoView({ block: 'nearest', behavior: 'auto' });
  },

  // Block navigation inside posts
  getBlocks() {
    const rendered = document.getElementById('post-rendered');
    if (!rendered) return [];
    return Array.from(rendered.querySelectorAll('p, h1, h2, h3, h4, pre, ul, ol, blockquote, .latex-block, table, hr'));
  },

  selectBlock(idx) {
    const blocks = this.getBlocks();
    if (!blocks.length) return;
    idx = Math.max(0, Math.min(idx, blocks.length - 1));
    this.selectedBlock = idx;
    this._renderBlockHighlights();
    blocks[idx].scrollIntoView({ block: 'nearest', behavior: 'auto' });
  },

  _renderBlockHighlights() {
    const blocks = this.getBlocks();
    blocks.forEach(b => b.classList.remove('block-cursor', 'block-visual'));

    if (this.selectedBlock < 0) return;

    if (this.mode === 'VISUAL' && this.visualAnchor >= 0) {
      // Highlight range from anchor to cursor
      const lo = Math.min(this.visualAnchor, this.selectedBlock);
      const hi = Math.max(this.visualAnchor, this.selectedBlock);
      for (let i = lo; i <= hi; i++) {
        if (blocks[i]) blocks[i].classList.add('block-visual');
      }
      this.showMsg(`-- VISUAL -- ${hi - lo + 1} blocks (y to yank)`);
    } else {
      // Just a dim cursor in NORMAL mode
      blocks[this.selectedBlock].classList.add('block-cursor');
    }
  },

  clearBlockSelection() {
    this.getBlocks().forEach(b => b.classList.remove('block-cursor', 'block-visual'));
    this.selectedBlock = -1;
    this.visualAnchor = -1;
  },

  getSelectedText() {
    const blocks = this.getBlocks();
    if (this.mode === 'VISUAL' && this.visualAnchor >= 0) {
      const lo = Math.min(this.visualAnchor, this.selectedBlock);
      const hi = Math.max(this.visualAnchor, this.selectedBlock);
      return blocks.slice(lo, hi + 1).map(b => b.innerText || b.textContent).join('\n\n');
    }
    const block = blocks[this.selectedBlock];
    return block ? (block.innerText || block.textContent) : '';
  },

  yankBlock() {
    const text = this.getSelectedText();
    if (!text) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.showMsg(`Yanked ${text.length} chars`);
      }).catch(() => {
        this._fallbackCopy(text);
      });
    } else {
      this._fallbackCopy(text);
    }
  },

  _fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      this.showMsg(`Yanked ${text.length} chars`);
    } catch(e) {
      this.showMsg('Yank failed - use mouse to copy');
    }
    document.body.removeChild(ta);
  },

  // Hop labels for f-find
  hopActive: false,
  hopLabels: 'abcdefghijklmnopqrstuvwxyz',

  startBlockHop() {
    const blocks = this.getBlocks();
    if (!blocks.length) return;

    this.hopActive = true;
    this.showMsg('-- HOP -- type label to jump');

    // Add labels to each block
    blocks.forEach((b, i) => {
      const label = i < 26 ? this.hopLabels[i] : this.hopLabels[Math.floor(i / 26) - 1] + this.hopLabels[i % 26];
      const tag = document.createElement('span');
      tag.className = 'hop-label';
      tag.textContent = label;
      tag.dataset.hopIdx = i;
      b.style.position = 'relative';
      b.insertBefore(tag, b.firstChild);
    });

    // Listen for label keypress
    const self = this;
    let buf = '';

    function hopHandler(e) {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        cleanup();
        return;
      }

      if (e.key.length === 1 && /[a-z]/.test(e.key)) {
        buf += e.key;

        // Find matching block
        const match = Array.from(document.querySelectorAll('.hop-label')).find(el => {
          const idx = parseInt(el.dataset.hopIdx);
          const expected = idx < 26 ? self.hopLabels[idx] : self.hopLabels[Math.floor(idx / 26) - 1] + self.hopLabels[idx % 26];
          return expected === buf;
        });

        if (match) {
          const idx = parseInt(match.dataset.hopIdx);
          cleanup();
          self.selectedBlock = idx;
          self.visualAnchor = idx;
          self.setMode('VISUAL');
          self._renderBlockHighlights();
          self.getBlocks()[idx].scrollIntoView({ block: 'nearest', behavior: 'auto' });
          return;
        }

        // Check if any label starts with current buf
        const possible = Array.from(document.querySelectorAll('.hop-label')).some(el => {
          const idx = parseInt(el.dataset.hopIdx);
          const expected = idx < 26 ? self.hopLabels[idx] : self.hopLabels[Math.floor(idx / 26) - 1] + self.hopLabels[idx % 26];
          return expected.startsWith(buf);
        });

        if (!possible) {
          cleanup();
        }
      }
    }

    function cleanup() {
      self.hopActive = false;
      document.querySelectorAll('.hop-label').forEach(el => el.remove());
      window.removeEventListener('keydown', hopHandler, true);
      self.showMsg('');
    }

    window.addEventListener('keydown', hopHandler, true);
  },

  // Main key handler
  handleKey(e) {
    if (this.hopActive) return; // hop handler takes over

    const key = e.key;

    // --- FLOATING PANE (search) ---
    if (panes.isFloatOpen()) {
      if (key === 'Escape') {
        e.preventDefault(); e.stopPropagation();
        panes.closeFloat();
        this.setMode('NORMAL');
        return;
      }
      if (this.mode === 'SEARCH') {
        const totalResults = document.querySelectorAll('#search-results .search-result').length;

        // Navigate results: Arrow keys, Tab, Ctrl+j/k, Ctrl+n/p
        if (key === 'ArrowDown' || (key === 'n' && e.ctrlKey) || (key === 'j' && e.ctrlKey)) {
          e.preventDefault();
          this.selectSearchResult(this.searchIdx + 1);
          return;
        }
        if (key === 'ArrowUp' || (key === 'p' && e.ctrlKey) || (key === 'k' && e.ctrlKey)) {
          e.preventDefault();
          this.selectSearchResult(this.searchIdx - 1);
          return;
        }
        if (key === 'Tab') {
          e.preventDefault();
          if (e.shiftKey) {
            this.selectSearchResult(this.searchIdx - 1);
          } else {
            this.selectSearchResult((this.searchIdx + 1) % (totalResults || 1));
          }
          return;
        }

        // Open selected result
        if (key === 'Enter') {
          e.preventDefault(); e.stopPropagation();
          const results = document.querySelectorAll('#search-results .search-result');
          if (results[this.searchIdx]) {
            panes.closeFloat();
            this.setMode('NORMAL');
            postSystem.open(results[this.searchIdx].dataset.id);
          }
          return;
        }
      }
      return; // let input handle other keys
    }

    // --- COMMAND MODE ---
    if (this.mode === 'COMMAND') {
      if (key === 'Escape') {
        e.preventDefault(); e.stopPropagation();
        this.exitCommand();
        return;
      }
      if (key === 'Enter') {
        e.preventDefault(); e.stopPropagation();
        this.executeCommand(this.cmdInput.value);
        this.exitCommand();
        return;
      }
      return;
    }

    // --- INSERT MODE ---
    if (this.mode === 'INSERT') {
      if (key === 'Escape') {
        e.preventDefault(); e.stopPropagation();
        this.setMode('NORMAL');
        if (document.activeElement) document.activeElement.blur();
        document.body.focus();
        this.showMsg('');
        return;
      }
      return;
    }

    // --- NORMAL MODE ---

    // Block browser defaults for vim keys
    if (this.isVimNav && /^[hjklgGiIfvyY/:1234zxc]$/.test(key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Blur inputs in normal mode
    const tag = (document.activeElement || {}).tagName || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      document.activeElement.blur();
      document.body.focus();
    }

    // Tab: toggle vim/friendly
    if (key === 'Tab') {
      e.preventDefault();
      this.isVimNav = !this.isVimNav;
      this.modeTypeEl.textContent = this.isVimNav ? 'VIM' : 'FRIENDLY';
      this.modeTypeEl.classList.toggle('friendly-mode', !this.isVimNav);
      this.showMsg(`-- ${this.isVimNav ? 'VIM' : 'FRIENDLY'} MODE --`);
      return;
    }

    // Escape: exit visual, clear block selection, or pop nav stack
    if (key === 'Escape') {
      e.preventDefault();
      if (this.mode === 'VISUAL') {
        this.setMode('NORMAL');
        this.clearBlockSelection();
        this.showMsg('');
        return;
      }
      if (this.selectedBlock >= 0) {
        this.clearBlockSelection();
        return;
      }
      if (navStack.depth() > 1) {
        navStack.pop();
        this.showMsg(`-- BACK (depth: ${navStack.depth()}) --`);
      }
      return;
    }

    // F keys (both modes)
    if (key === 'F1') { e.preventDefault(); navStack.reset('home'); return; }
    if (key === 'F2') { e.preventDefault(); navStack.reset('about'); return; }
    if (key === 'F3') { e.preventDefault(); navStack.reset('links'); return; }
    if (key === 'F4') { e.preventDefault(); navStack.reset('guestbook'); return; }

    if (!this.isVimNav) return;

    // Count buffer (digits before commands)
    if (/^[0-9]$/.test(key) && (this.countBuf || key !== '0')) {
      // Only accumulate if we already have digits, or it's not 0
      // But 1-4 without prior count = tab switch
      if (!this.countBuf && '1234'.includes(key)) {
        const tabMap = { '1': 'home', '2': 'about', '3': 'links', '4': 'guestbook' };
        navStack.reset(tabMap[key]);
        return;
      }
      this.countBuf += key;
      this.showMsg(this.countBuf, 2000);
      return;
    }

    const count = this.getCount();

    // : -> COMMAND
    if (key === ':') {
      this.setMode('COMMAND');
      this.cmdLine.classList.remove('hidden');
      this.cmdInput.value = '';
      setTimeout(() => this.cmdInput.focus(), 10);
      return;
    }

    // / -> SEARCH
    if (key === '/') {
      search.open();
      return;
    }

    // i -> INSERT
    if (key === 'i') {
      this.setMode('INSERT');
      this.showMsg('-- INSERT --');
      const cur = navStack.current();
      if (cur.view === 'guestbook') {
        const inp = document.getElementById('gb-name');
        if (inp) setTimeout(() => inp.focus(), 10);
      }
      return;
    }

    // f -> FIND (hop to block with labels, like hop.nvim/easymotion)
    if (key === 'f') {
      if (navStack.current().view === 'post') {
        this.startBlockHop();
      }
      return;
    }

    // v -> VISUAL (select block range)
    if (key === 'v') {
      if (navStack.current().view === 'post') {
        if (this.mode === 'VISUAL') {
          // Exit visual
          this.setMode('NORMAL');
          this.visualAnchor = -1;
          this._renderBlockHighlights();
          this.showMsg('');
        } else {
          // Enter visual - anchor at current cursor
          this.setMode('VISUAL');
          if (this.selectedBlock < 0) this.selectedBlock = 0;
          this.visualAnchor = this.selectedBlock;
          this._renderBlockHighlights();
        }
      }
      return;
    }

    // y -> yank (copy selected blocks)
    if (key === 'y') {
      if (this.selectedBlock >= 0) {
        this.yankBlock();
        this.setMode('NORMAL');
        this.visualAnchor = -1;
        setTimeout(() => {
          this._renderBlockHighlights();
        }, 500);
      }
      return;
    }

    // j/ArrowDown - scroll / next post / move block cursor (only in VISUAL)
    if (key === 'j' || key === 'ArrowDown') {
      const cur = navStack.current();
      for (let i = 0; i < count; i++) {
        if (cur.view === 'post' && this.mode === 'VISUAL') {
          // VISUAL mode: navigate blocks
          const blocks = this.getBlocks();
          if (blocks.length) {
            this.selectBlock(Math.max(0, this.selectedBlock) + 1);
          }
        } else if (cur.view === 'home') {
          panes.scroll(60);
          const els = this.getPostEls();
          if (this.selectedPost < els.length - 1) this.selectPost(this.selectedPost + 1);
        } else {
          // NORMAL in post or any other view: just scroll
          panes.scroll(60);
        }
      }
      this.updateStatus();
      return;
    }

    // k/ArrowUp - scroll / prev post / move block cursor (only in VISUAL)
    if (key === 'k' || key === 'ArrowUp') {
      const cur = navStack.current();
      for (let i = 0; i < count; i++) {
        if (cur.view === 'post' && this.mode === 'VISUAL') {
          // VISUAL mode: navigate blocks
          if (this.selectedBlock > 0) {
            this.selectBlock(this.selectedBlock - 1);
          }
        } else if (cur.view === 'home') {
          panes.scroll(-60);
          if (this.selectedPost > 0) this.selectPost(this.selectedPost - 1);
        } else {
          panes.scroll(-60);
        }
      }
      this.updateStatus();
      return;
    }

    // h/ArrowLeft - focus left pane
    if (key === 'h' || key === 'ArrowLeft') {
      panes.focusLeft();
      this.showMsg(`-- ${panes.list[panes.active].name} --`);
      return;
    }

    // l/ArrowRight - focus right pane
    if (key === 'l' || key === 'ArrowRight') {
      panes.focusRight();
      this.showMsg(`-- ${panes.list[panes.active].name} --`);
      return;
    }

    // Enter - go deeper (open post)
    if (key === 'Enter') {
      const cur = navStack.current();
      if (cur.view === 'home') {
        const els = this.getPostEls();
        const sel = els[this.selectedPost];
        if (sel && sel.dataset.postId) {
          postSystem.open(sel.dataset.postId);
        }
      }
      return;
    }

    // gg - top
    if (key === 'g') {
      if (this.keyBuf === 'g') {
        clearTimeout(this.keyTimer);
        this.keyBuf = '';
        const el = panes.getScrollable();
        if (el) el.scrollTop = 0;
        if (navStack.current().view === 'home' && this.getPostEls().length) this.selectPost(0);
        this.updateStatus();
        this.showMsg('-- TOP --');
      } else {
        this.keyBuf = 'g';
        this.keyTimer = setTimeout(() => { this.keyBuf = ''; }, 600);
      }
      return;
    }

    // G - bottom
    if (key === 'G') {
      this.keyBuf = '';
      const el = panes.getScrollable();
      if (el) el.scrollTop = el.scrollHeight;
      const postEls = this.getPostEls();
      if (navStack.current().view === 'home' && postEls.length) this.selectPost(postEls.length - 1);
      this.updateStatus();
      this.showMsg('-- BOTTOM --');
      return;
    }

    // Ctrl+d/u half page
    if (key === 'd' && e.ctrlKey) { panes.scroll(400); this.updateStatus(); return; }
    if (key === 'u' && e.ctrlKey) { panes.scroll(-400); this.updateStatus(); return; }

    // z/x/c music
    if (key === 'z') { music.prev(); return; }
    if (key === 'x') { music.toggle(); return; }
    if (key === 'c') { music.next(); return; }
  },

  exitCommand() {
    this.setMode('NORMAL');
    this.cmdLine.classList.add('hidden');
    this.cmdInput.value = '';
    document.body.focus();
  },

  executeCommand(cmd) {
    cmd = cmd.trim().toLowerCase();
    const cmds = {
      'q': () => this.showMsg('E37: No write since last change -- use :q!'),
      'quit': () => this.showMsg('E37: No write since last change -- use :q!'),
      'q!': () => { document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#00ff41;font-family:monospace;font-size:16px;">Session terminated.</div>'; },
      'w': () => this.showMsg('"posts.md" -- saved (not really)'),
      'help': () => this.showMsg(':q :theme dark/light :tabs :version'),
      'theme': () => {
        const cur = document.body.classList.contains('theme-light') ? 'light' : 'dark';
        this.showMsg(`Current: ${cur} | :theme dark | :theme light`);
      },
      'theme dark': () => { document.body.classList.remove('theme-light'); try{localStorage.setItem('astaroth-theme','dark')}catch(e){} this.showMsg('Theme: dark'); },
      'theme light': () => { document.body.classList.add('theme-light'); try{localStorage.setItem('astaroth-theme','light')}catch(e){} this.showMsg('Theme: light'); },
      'theme white': () => { document.body.classList.add('theme-light'); try{localStorage.setItem('astaroth-theme','light')}catch(e){} this.showMsg('Theme: light'); },
      'tabs': () => this.showMsg('1:Home 2:About 3:Links 4:Guestbook'),
      'version': () => this.showMsg('ASTAROTH TUI Blog v2.0 -- Pane+NavStack+Vim Engine'),
    };

    if (cmd.startsWith('tab ')) {
      const n = parseInt(cmd.split(' ')[1]);
      const map = { 1: 'home', 2: 'about', 3: 'links', 4: 'guestbook' };
      if (map[n]) navStack.reset(map[n]);
      return;
    }

    (cmds[cmd] || (() => this.showMsg(`E492: Not a valid command: ${cmd}`)))();
  }
};

// Init vim display
vim.setMode('NORMAL');
if (!vim.isVimNav) {
  vim.modeTypeEl.textContent = 'FRIENDLY';
  vim.modeTypeEl.classList.add('friendly-mode');
}

// Toggle mode on click
vim.modeTypeEl.addEventListener('click', () => {
  vim.isVimNav = !vim.isVimNav;
  vim.modeTypeEl.textContent = vim.isVimNav ? 'VIM' : 'FRIENDLY';
  vim.modeTypeEl.classList.toggle('friendly-mode', !vim.isVimNav);
  vim.showMsg(`-- ${vim.isVimNav ? 'VIM' : 'FRIENDLY'} MODE --`);
  document.body.focus();
});

// Global key handler
document.body.setAttribute('tabindex', '-1');
document.body.style.outline = 'none';
document.body.focus();

window.addEventListener('keydown', (e) => vim.handleKey(e), true);

// Click refocus
document.addEventListener('click', (e) => {
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
    if (vim.mode === 'NORMAL') document.body.focus();
  }
});

// =============================================
// CONTENT VIEWS
// =============================================
const contentBody = document.getElementById('content-body');
const contentTitle = document.getElementById('content-title');
const tabEls = document.querySelectorAll('.tui-tab');
const tabContents = document.querySelectorAll('.tab-content');

const contentViews = {
  show(view, data) {
    // Update tab highlight
    const tabMap = { home: 'home', about: 'about', links: 'links', guestbook: 'guestbook', post: null };
    tabEls.forEach(t => t.classList.toggle('active', t.dataset.tab === tabMap[view]));
    tabContents.forEach(tc => tc.classList.toggle('active', tc.dataset.tab === (view === 'post' ? 'post' : view)));

    const titles = { home: 'POSTS', about: 'ABOUT', links: 'LINKS', guestbook: 'GUESTBOOK', post: data ? data.title || 'POST' : 'POST' };
    const depth = navStack.depth();
    contentTitle.textContent = `┤ ${titles[view] || view.toUpperCase()}${depth > 1 ? ' [' + depth + ']' : ''} ├`;

    if (view === 'post' && data) {
      postSystem.render(data);
    }

    contentBody.scrollTop = 0;
  }
};

// Tab clicks
tabEls.forEach(t => {
  t.addEventListener('click', () => {
    navStack.reset(t.dataset.tab);
    document.body.focus();
  });
});

// =============================================
// POST SYSTEM (Markdown + LaTeX)
// =============================================
const POSTS_FALLBACK = [{"id":"karma-do-desejo","title":"O Karma do Desejo","date":"2026-03-29","tags":["filosofia","psicologia","karma"],"file":"posts/karma-do-desejo.md","draft":true}];

const postSystem = {
  all: [],

  load() {
    fetch('posts.json')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(posts => { this.all = posts.filter(p => !p.draft); this.renderList(); })
      .catch(() => { this.all = POSTS_FALLBACK.filter(p => !p.draft); this.renderList(); });
  },

  renderList() {
    const container = document.getElementById('post-list');
    if (!this.all.length) {
      container.innerHTML = '<p class="hl-dim">No posts yet.</p>';
      return;
    }
    container.innerHTML = this.all.map((p, i) =>
      `<div class="tui-post" data-index="${i}" data-post-id="${p.id}">
        <div class="post-head">
          <span class="post-idx hl-dim">[${String(i + 1).padStart(2, '0')}]</span>
          <span class="post-title hl-green">${p.title}</span>
        </div>
        <div class="post-meta hl-dim">${p.date} | ${p.tags.map(t => '#' + t).join(' ')}</div>
      </div>` +
      (i < this.all.length - 1 ? '<div class="tui-separator-full">─────────────────────────────────────────────────</div>' : '')
    ).join('');

    container.querySelectorAll('.tui-post').forEach(el => {
      el.addEventListener('click', () => this.open(el.dataset.postId));
    });

    if (this.all.length) vim.selectPost(0);
  },

  open(id) {
    const post = this.all.find(p => p.id === id);
    if (!post) return;
    navStack.push('post', { id: post.id, title: post.title, file: post.file });
  },

  render(data) {
    const post = this.all.find(p => p.id === data.id);
    if (!post) return;

    const self = this;
    this._fetch(post.file, function(md) {
      const rendered = document.getElementById('post-rendered');
      rendered.innerHTML = typeof marked !== 'undefined' ? marked.parse(md) : md.replace(/\n/g, '<br>');
      self._renderLatex(rendered);
      self._processFootnotes(rendered);
      self._processLinks(rendered);
      self._loadComments(post.id, post.title);
    });
  },

  _fetch(file, cb) {
    fetch(file)
      .then(r => { if (!r.ok) throw new Error(); return r.text(); })
      .then(cb)
      .catch(() => {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', file, true);
          xhr.onload = function() { cb(xhr.responseText || '# Not found'); };
          xhr.onerror = function() { cb('# Not found\n\nServe with: `python3 -m http.server 8000`'); };
          xhr.send();
        } catch(e) { cb('# Not found'); }
      });
  },

  _processFootnotes(el) {
    // Turn [1], [2] etc in text into clickable links that scroll to the reference
    // Also add id anchors to reference definitions

    // Step 1: Add anchors to reference list items (lines starting with [N])
    el.querySelectorAll('p').forEach(p => {
      const text = p.textContent;
      const match = text.match(/^\[(\d+[a-z]?)\]/);
      if (match) {
        p.id = 'ref-' + match[1];
        p.classList.add('footnote-def');
      }
    });

    // Step 2: Turn inline [N] references into clickable superscript links
    el.querySelectorAll('p, li, blockquote').forEach(node => {
      if (node.classList.contains('footnote-def')) return; // skip reference definitions
      node.innerHTML = node.innerHTML.replace(
        /\[(\d+[a-z]?)\]/g,
        '<a href="#ref-$1" class="footnote-link" title="Ver referência [$1]"><sup>[$1]</sup></a>'
      );
    });

    // Step 3: Make footnote links scroll smoothly within the panel
    el.querySelectorAll('.footnote-link').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(a.getAttribute('href').slice(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.classList.add('footnote-highlight');
          setTimeout(() => target.classList.remove('footnote-highlight'), 2000);
        }
      });
    });
  },

  _processLinks(el) {
    const self = this;

    el.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');

      // Detect link type
      const postMatch = href.match(/^(?:post:|#)(.+)$/);
      const isMd = href.endsWith('.md');
      const isExternal = href.startsWith('http://') || href.startsWith('https://');

      let internalId = null;
      if (postMatch) internalId = postMatch[1];
      else if (isMd) internalId = href.replace(/^posts\//, '').replace(/\.md$/, '');

      // Internal post link
      if (internalId) {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          linkPreview.hide();
          if (self.all.find(p => p.id === internalId)) self.open(internalId);
        });
        a.style.cursor = 'pointer';
        a.removeAttribute('target');
        a.dataset.previewType = 'internal';
        a.dataset.previewId = internalId;
      }

      // External link
      if (isExternal) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        a.dataset.previewType = 'external';
        a.dataset.previewUrl = href;
      }

      // Hover preview for all links
      if (internalId || isExternal) {
        let hoverTimer = null;

        a.addEventListener('mouseenter', (e) => {
          hoverTimer = setTimeout(() => {
            const rect = a.getBoundingClientRect();
            if (a.dataset.previewType === 'internal') {
              linkPreview.showInternal(a.dataset.previewId, rect);
            } else {
              linkPreview.showExternal(a.dataset.previewUrl, rect);
            }
          }, 400);
        });

        a.addEventListener('mouseleave', () => {
          clearTimeout(hoverTimer);
          linkPreview.scheduleHide();
        });
      }
    });
  },

  _renderLatex(el) {
    if (typeof katex === 'undefined') return;
    el.innerHTML = el.innerHTML.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
      try { return '<div class="latex-block">' + katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false }) + '</div>'; }
      catch(e) { return tex; }
    });
    el.innerHTML = el.innerHTML.replace(/\$([^\$\n]+?)\$/g, (_, tex) => {
      try { return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false }); }
      catch(e) { return tex; }
    });
  },

  // Giscus (GitHub Discussions) comments
  // Setup: 1) Enable Discussions on your repo
  //        2) Install giscus app: https://github.com/apps/giscus
  //        3) Get repo-id and category-id from https://giscus.app
  GISCUS_REPO: 'astahjmo/astahjmo.github.io',
  GISCUS_REPO_ID: 'R_kgDOR0Dc_g',
  GISCUS_CATEGORY: 'Announcements',
  GISCUS_CATEGORY_ID: 'DIC_kwDOR0Dc_s4C5jta',

  _loadComments(postId, postTitle) {
    const container = document.getElementById('giscus-container');
    if (!container) return;

    // Clear previous
    container.innerHTML = '';

    if (!this.GISCUS_REPO_ID) {
      container.innerHTML = '<p class="hl-dim">Comments not configured yet.</p><p class="hl-dim">Setup: <a href="https://giscus.app" target="_blank">giscus.app</a></p>';
      return;
    }

    const isLight = document.body.classList.contains('theme-light');
    const theme = isLight ? 'light' : 'dark_dimmed';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', this.GISCUS_REPO);
    script.setAttribute('data-repo-id', this.GISCUS_REPO_ID);
    script.setAttribute('data-category', this.GISCUS_CATEGORY);
    script.setAttribute('data-category-id', this.GISCUS_CATEGORY_ID);
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', postId);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'pt');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    container.appendChild(script);
  }
};

// Back button
const backBtn = document.getElementById('post-back');
if (backBtn) {
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    navStack.pop();
  });
}

// =============================================
// SEARCH (floating pane, / key)
// =============================================
const searchPane = document.createElement('div');
searchPane.id = 'search-pane';
searchPane.className = 'search-pane hidden';
searchPane.innerHTML = `
  <div class="search-header float-header">
    <span class="hl-amber">SEARCH</span>
    <span class="hl-dim">Esc close | Tab/Ctrl+j/k navigate | Enter open</span>
  </div>
  <div class="search-input-row">
    <span class="hl-green">/</span>
    <input type="text" id="search-input" class="tui-input" placeholder="search posts...">
  </div>
  <div class="search-results" id="search-results"></div>
`;
document.getElementById('tui').appendChild(searchPane);

const search = {
  input: document.getElementById('search-input'),
  results: document.getElementById('search-results'),

  open() {
    vim.setMode('SEARCH');
    panes.openFloat('search-pane');
    vim.searchIdx = 0;
    this.input.value = '';
    this.renderResults(postSystem.all);
    setTimeout(() => this.input.focus(), 10);
  },

  renderResults(posts) {
    this.results.innerHTML = posts.length
      ? posts.map((p, i) =>
          `<div class="search-result${i === 0 ? ' search-selected' : ''}" data-id="${p.id}">
            <span class="hl-green">${p.title}</span>
            <span class="hl-dim"> | ${p.date} | ${p.tags.join(', ')}</span>
          </div>`
        ).join('')
      : '<p class="hl-dim">No results.</p>';
  },

  filter(query) {
    const q = query.toLowerCase();
    const filtered = postSystem.all.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.date.includes(q)
    );
    vim.searchIdx = 0;
    this.renderResults(filtered);
  }
};

search.input.addEventListener('input', () => search.filter(search.input.value));

search.results.addEventListener('click', (e) => {
  const r = e.target.closest('.search-result');
  if (r) {
    panes.closeFloat();
    vim.setMode('NORMAL');
    postSystem.open(r.dataset.id);
  }
});

// =============================================
// LINK PREVIEW (hover pane)
// =============================================
const previewPane = document.createElement('div');
previewPane.id = 'link-preview';
previewPane.className = 'link-preview hidden';
previewPane.innerHTML = `
  <div class="preview-header float-header">
    <span class="preview-title hl-dim"></span>
    <span class="preview-close hl-dim" style="cursor:pointer">x</span>
  </div>
  <div class="preview-body"></div>
`;
document.getElementById('tui').appendChild(previewPane);

const linkPreview = {
  el: previewPane,
  header: previewPane.querySelector('.preview-title'),
  body: previewPane.querySelector('.preview-body'),
  hideTimer: null,
  visible: false,

  show(rect) {
    clearTimeout(this.hideTimer);
    // Position near the link
    const x = Math.min(rect.left, window.innerWidth - 420);
    const y = rect.bottom + 8;
    const maxY = window.innerHeight - 350;

    this.el.style.left = Math.max(10, x) + 'px';
    this.el.style.top = Math.min(y, maxY) + 'px';
    this.el.classList.remove('hidden');
    this.visible = true;

    // Init drag
    panes._initDrag(this.el);
  },

  hide() {
    clearTimeout(this.hideTimer);
    this.el.classList.add('hidden');
    this.body.innerHTML = '';
    this.visible = false;
  },

  scheduleHide() {
    this.hideTimer = setTimeout(() => this.hide(), 300);
  },

  showInternal(postId, rect) {
    const post = postSystem.all.find(p => p.id === postId);
    if (!post) return;

    this.header.textContent = post.title;
    this.body.innerHTML = '<p class="hl-dim">Loading...</p>';
    this.show(rect);

    const self = this;
    postSystem._fetch(post.file, function(md) {
      // Render preview (truncated)
      let html = typeof marked !== 'undefined' ? marked.parse(md) : md.replace(/\n/g, '<br>');
      self.body.innerHTML = '<div class="preview-content">' + html + '</div>';
    });
  },

  showExternal(url, rect) {
    this.header.textContent = url.replace(/^https?:\/\//, '').split('/')[0];
    this.body.innerHTML = `<iframe src="${url}" class="preview-iframe" sandbox="allow-scripts allow-same-origin"></iframe>`;
    this.show(rect);
  }
};

// Keep preview visible when hovering the pane itself
previewPane.addEventListener('mouseenter', () => {
  clearTimeout(linkPreview.hideTimer);
});
previewPane.addEventListener('mouseleave', () => {
  linkPreview.scheduleHide();
});

// Close button
previewPane.querySelector('.preview-close').addEventListener('click', () => {
  linkPreview.hide();
});

// =============================================
// MUSIC PLAYER
// =============================================
const music = {
  songs: [
    'Linkin Park - In The End',
    'System of a Down - Chop Suey!',
    'Slipknot - Duality',
    'Disturbed - Down With The Sickness',
    'RATM - Killing In The Name',
    'Korn - Freak On A Leash',
    'Papa Roach - Last Resort',
    'Deftones - Change',
    'Tool - Schism',
    'Mudvayne - Dig'
  ],
  current: 0,
  playing: true,

  update() {
    const el = document.getElementById('np-track');
    if (el) el.textContent = `${this.playing ? '>' : '|'} ${this.songs[this.current]}`;
  },

  next() {
    this.current = (this.current + 1) % this.songs.length;
    this.update();
    this._resetBar();
    vim.showMsg(`Now playing: ${this.songs[this.current]}`);
  },

  prev() {
    this.current = (this.current - 1 + this.songs.length) % this.songs.length;
    this.update();
    this._resetBar();
    vim.showMsg(`Now playing: ${this.songs[this.current]}`);
  },

  toggle() {
    this.playing = !this.playing;
    this.update();
    const fill = document.getElementById('np-bar-fill');
    if (fill) fill.style.animationPlayState = this.playing ? 'running' : 'paused';
    vim.showMsg(this.playing ? '> Playing' : '| Paused');
  },

  _resetBar() {
    const fill = document.getElementById('np-bar-fill');
    if (fill) {
      fill.style.animation = 'none';
      fill.offsetHeight;
      fill.style.animation = 'npProgress 15s linear infinite';
      fill.style.animationPlayState = this.playing ? 'running' : 'paused';
    }
  }
};

music.update();

// =============================================
// UTILITIES
// =============================================

// Clock
(function() {
  const el = document.getElementById('tui-clock');
  if (!el) return;
  function tick() { el.textContent = new Date().toTimeString().slice(0, 8); }
  tick();
  setInterval(tick, 1000);
})();

// Uptime
(function() {
  const el = document.getElementById('sys-uptime');
  if (!el) return;
  let sec = 0;
  setInterval(() => {
    sec++;
    el.textContent = [sec/3600|0, (sec%3600)/60|0, sec%60].map(n => String(n).padStart(2,'0')).join(':');
  }, 1000);
})();

// Guestbook
(function() {
  const btn = document.getElementById('gb-submit');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const name = document.getElementById('gb-name').value.trim();
    const msg = document.getElementById('gb-msg').value.trim();
    if (!name || !msg) return;
    const c = document.getElementById('guestbook-messages');
    const entry = document.createElement('div');
    entry.className = 'gb-entry';
    entry.innerHTML = `<span class="hl-orange">${name}</span> <span class="hl-dim">[${new Date().toISOString().slice(0,10)}]</span><br>${msg}`;
    c.insertBefore(entry, c.firstChild);
    document.getElementById('gb-name').value = '';
    document.getElementById('gb-msg').value = '';
    vim.showMsg('Guestbook entry added!');
  });
})();

// Load posts
postSystem.load();

// Focus & status
panes.focus(1);
vim.updateStatus();

} // end initTUI
