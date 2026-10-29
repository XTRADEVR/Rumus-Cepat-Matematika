let currentCategory = 'Semua';
let activeFormula = null;
let activeTargetSymbol = '';
let favorites = JSON.parse(localStorage.getItem('rc_favorites') || '[]');
let historyLog = JSON.parse(localStorage.getItem('rc_history') || '[]');
let currentQuizIdx = 0;
let quizScore = 0;

const searchInput = document.getElementById('search-input');
const categoryScroll = document.getElementById('category-scroll');
const formulaGrid = document.getElementById('formula-grid');
const detailView = document.getElementById('detail-view');
const tabKalkulator = document.getElementById('tab-kalkulator');
const tabMateri = document.getElementById('tab-materi');
const detailContent = document.getElementById('detail-content');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW terdaftar:', reg.scope))
      .catch(err => console.error('SW Error:', err));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderFormulas();
  setupEventListeners();
});

function setupEventListeners() {
  searchInput.addEventListener('input', () => renderFormulas());
}

function renderCategories() {
  const categories = ['Semua', 'Luas Bangun Datar', 'Teorema Pythagoras', 'Hukum Newton', 'Kecepatan', 'Tekanan'];
  categoryScroll.innerHTML = categories.map(cat => `
    <button class="chip ${cat === currentCategory ? 'active' : ''}" onclick="selectCategory('${cat}')">
      ${cat}
    </button>
  `).join('');
}

function selectCategory(cat) {
  currentCategory = cat;
  renderCategories();
  renderFormulas();
}

function renderFormulas() {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = FORMULA_DATA.filter(f => {
    const matchCat = currentCategory === 'Semua' || f.category === currentCategory;
    const matchQuery = !query || f.name.toLowerCase().includes(query) || f.notation.toLowerCase().includes(query);
    return matchCat && matchQuery;
  });

  if (filtered.length === 0) {
    formulaGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 32px; color: var(--text-secondary);">🔍 Rumus tidak ditemukan.</div>`;
    return;
  }

  formulaGrid.innerHTML = filtered.map(f => {
    const isFav = favorites.includes(f.id);
    return `
      <div class="formula-card" onclick="openDetail('${f.id}')">
        <div class="card-header">
          <span class="badge">${f.category}</span>
          <button class="bookmark-btn ${isFav ? 'active' : ''}" onclick="toggleFav(event, '${f.id}')">
            ${isFav ? '★' : '☆'}
          </button>
        </div>
        <div class="card-title">${f.name}</div>
        <div class="notation-box">${f.notation}</div>
        <div class="card-desc">${f.description}</div>
      </div>
    `;
  }).join('');
}

function toggleFav(event, id) {
  event.stopPropagation();
  if (favorites.includes(id)) {
    favorites = favorites.filter(fId => fId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('rc_favorites', JSON.stringify(favorites));
  renderFormulas();
}

function openDetail(id) {
  activeFormula = FORMULA_DATA.find(f => f.id === id);
  if (!activeFormula) return;
  activeTargetSymbol = activeFormula.targetVariables[0];
  document.getElementById('detail-title').innerText = activeFormula.name;
  document.getElementById('detail-category').innerText = activeFormula.category;
  detailView.classList.add('active');
  switchTab('kalkulator');
}

function closeDetail() {
  detailView.classList.remove('active');
}

function switchTab(tabName) {
  tabKalkulator.classList.toggle('active', tabName === 'kalkulator');
  tabMateri.classList.toggle('active', tabName === 'materi');
  if (tabName === 'kalkulator') renderCalculatorTab();
  else renderMateriTab();
}

function renderCalculatorTab() {
  const f = activeFormula;
  const reqVars = f.variables.filter(v => v.symbol !== activeTargetSymbol);

  detailContent.innerHTML = `
    <div class="calculator-form">
      <div class="form-group">
        <label class="form-label">Variabel Target Dihitung:</label>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${f.targetVariables.map(sym => `
            <button class="chip ${sym === activeTargetSymbol ? 'active' : ''}" onclick="selectTarget('${sym}')">
              ${f.variables.find(v => v.symbol === sym)?.name || sym} (${sym})
            </button>
          `).join('')}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Masukkan Nilai Diketahui:</label>
        ${reqVars.map(v => `
          <div style="margin-bottom: 8px;">
            <label style="font-size:0.85rem; color:var(--text-secondary);">${v.name} (${v.symbol}) dalam ${v.unit}:</label>
            <input type="number" id="input-${v.symbol}" class="form-input" placeholder="Nilai..." />
          </div>
        `).join('')}
      </div>

      <div class="btn-group">
        <button class="btn btn-primary" onclick="executeCalculation()">Hitung</button>
        <button class="btn btn-secondary" onclick="renderCalculatorTab()">Reset</button>
      </div>

      <div id="result-container"></div>
    </div>
  `;
}

function selectTarget(sym) {
  activeTargetSymbol = sym;
  renderCalculatorTab();
}

function executeCalculation() {
  const f = activeFormula;
  const reqVars = f.variables.filter(v => v.symbol !== activeTargetSymbol);
  const inputs = {};

  for (let v of reqVars) {
    inputs[v.symbol] = document.getElementById(`input-${v.symbol}`).value;
  }

  const res = f.solve(activeTargetSymbol, inputs);
  const resBox = document.getElementById('result-container');

  if (res.error) {
    resBox.innerHTML = `<div class="error-banner">⚠️ ${res.error}</div>`;
  } else {
    resBox.innerHTML = `
      <div class="result-box">
        <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">HASIL PERHITUNGAN:</div>
        <div class="result-val">${activeTargetSymbol} = ${res.result} ${res.unit}</div>
        <div style="font-weight:700; margin-top:8px;">Langkah-Langkah:</div>
        <ol style="padding-left:20px; font-family:monospace; margin-top:4px;">
          ${res.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
      </div>
    `;

    historyLog.unshift({
      title: f.name,
      result: `${activeTargetSymbol} = ${res.result} ${res.unit}`,
      date: new Date().toLocaleTimeString('id-ID')
    });
    localStorage.setItem('rc_history', JSON.stringify(historyLog.slice(0, 20)));
  }
}

function renderMateriTab() {
  const f = activeFormula;
  detailContent.innerHTML = `
    <div style="padding: 16px; display:flex; flex-direction:column; gap:16px;">
      <div class="result-box">
        <h3>Variabel & Satuan</h3>
        <ul style="padding-left:20px; margin-top:8px;">
          ${f.variables.map(v => `<li><b>${v.symbol}</b> = ${v.name} (${v.unit})</li>`).join('')}
        </ul>
      </div>

      <div class="result-box">
        <h3>Contoh Soal</h3>
        <p style="margin-top:6px;"><b>Soal:</b> ${f.example.question}</p>
        <p style="margin-top:8px; font-weight:700;">Penyelesaian:</p>
        <ul style="padding-left:20px;">
          ${f.example.steps.map(s => `<li>${s}</li>`).join('')}
        </ul>
        <div class="badge" style="margin-top:8px; align-self:flex-start;">Jawaban: ${f.example.answer}</div>
      </div>
    </div>
  `;
}

function showPage(pageName) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`nav-${pageName}`).classList.add('active');

  const container = document.getElementById('main-container');

  if (pageName === 'katalog') {
    container.style.display = 'block';
    document.getElementById('quiz-view').style.display = 'none';
    document.getElementById('fav-view').style.display = 'none';
  } else if (pageName === 'kuis') {
    container.style.display = 'none';
    document.getElementById('quiz-view').style.display = 'block';
    document.getElementById('fav-view').style.display = 'none';
    renderQuiz();
  } else if (pageName === 'favorit') {
    container.style.display = 'none';
    document.getElementById('quiz-view').style.display = 'none';
    document.getElementById('fav-view').style.display = 'block';
    renderFavoritesAndHistory();
  }
}

function renderQuiz() {
  const q = QUIZ_QUESTIONS[currentQuizIdx];
  const qBox = document.getElementById('quiz-view');
  if (!q) {
    qBox.innerHTML = `
      <div class="container" style="text-align:center; padding:40px 16px;">
        <h2>🎉 Kuis Selesai!</h2>
        <p style="font-size:1.2rem; margin:16px 0;">Skor Anda: <b>${quizScore} / ${QUIZ_QUESTIONS.length * 10}</b></p>
        <button class="btn btn-primary" onclick="currentQuizIdx=0; quizScore=0; renderQuiz();">Mulai Ulang</button>
      </div>
    `;
    return;
  }

  qBox.innerHTML = `
    <div class="container">
      <div class="result-box">
        <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">SOAL ${currentQuizIdx + 1} DARI ${QUIZ_QUESTIONS.length}</div>
        <div style="font-size:1.1rem; font-weight:700; margin:12px 0;">${q.question}</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${q.options.map((opt, i) => `
            <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="answerQuiz(${i})">
              ${String.fromCharCode(65 + i)}. ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function answerQuiz(idx) {
  const q = QUIZ_QUESTIONS[currentQuizIdx];
  const isCorrect = idx === q.correct;
  if (isCorrect) quizScore += 10;
  alert(isCorrect ? '✅ Benar!\n\n' + q.explanation : '❌ Salah!\n\n' + q.explanation);
  currentQuizIdx++;
  renderQuiz();
}

function renderFavoritesAndHistory() {
  const view = document.getElementById('fav-view');
  const favFormulas = FORMULA_DATA.filter(f => favorites.includes(f.id));

  view.innerHTML = `
    <div class="container">
      <h3>⭐ Rumus Favorit (${favFormulas.length})</h3>
      <div class="formula-grid" style="margin-top:12px; margin-bottom:24px;">
        ${favFormulas.length === 0 ? '<p style="color:var(--text-secondary);">Belum ada rumus favorit.</p>' : 
          favFormulas.map(f => `
            <div class="formula-card" onclick="openDetail('${f.id}')">
              <div class="card-title">${f.name}</div>
              <div class="notation-box">${f.notation}</div>
            </div>
          `).join('')}
      </div>

      <h3>📜 Riwayat Perhitungan</h3>
      <div style="display:flex; flex-direction:column; gap:8px; margin-top:12px;">
        ${historyLog.length === 0 ? '<p style="color:var(--text-secondary);">Belum ada riwayat.</p>' :
          historyLog.map(h => `
            <div class="result-box" style="padding:12px;">
              <div style="font-weight:700;">${h.title}</div>
              <div style="color:var(--primary); font-family:monospace; font-weight:700;">${h.result}</div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">${h.date}</div>
            </div>
          `).join('')}
      </div>
    </div>
  `;
}
