// TecnoAchados — interações do site
document.addEventListener('DOMContentLoaded', () => {

  // Menu mobile
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Fecha o menu hambúrguer automaticamente ao clicar em qualquer link do menu
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav && nav.classList.remove('is-open');
      toggle && toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Fecha o menu se clicar fora dele
  document.addEventListener('click', (e) => {
    if (!nav || !nav.classList.contains('is-open')) return;
    if (nav.contains(e.target) || (toggle && toggle.contains(e.target))) return;
    nav.classList.remove('is-open');
    toggle && toggle.setAttribute('aria-expanded', 'false');
  });

  // Aplica o score (0-10) de cada anel a partir do atributo data-score
  document.querySelectorAll('.score-ring[data-score]').forEach(el => {
    const score = parseFloat(el.getAttribute('data-score'));
    el.style.setProperty('--score', score);
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // TOC scroll-spy
  const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  const targets = Array.from(tocLinks)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (tocLinks.length && targets.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id;
        const link = document.querySelector(`.toc a[href="${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });

    targets.forEach(t => observer.observe(t));
  }

  // Newsletter — placeholder de envio (sem backend ainda)
  const form = document.querySelector('.newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
      if (!input.value) return;
      btn.textContent = 'Inscrito ✓';
      input.value = '';
      setTimeout(() => { btn.textContent = 'Quero receber'; }, 2500);
    });
  }
});


// ============================================================
// TA — Catálogo de artigos, filtro por categoria e paginação
// ============================================================
window.TA = (function(){
  const ARTICLES = [
    {
      href: 'artigos/os-10-melhores-smartphones-de-2026.html', category: 'Smartphones', icon: 'phone', cover: 'images/covers/smartphones.jpg',
      title: 'Os 7 melhores smartphones de 2026',
      excerpt: 'Comparamos câmera, bateria, desempenho e preço real no Mercado Livre de 7 modelos — com fotos reais de cada anúncio e o valor atualizado no momento da compra.',
      date: '24 ago 2026', dateSort: 20260824, readtime: '10 min de leitura', isNew: true
    },
    {
      href: 'artigos/7-melhores-notebooks-2026.html', category: 'Notebooks', icon: 'laptop', cover: 'images/covers/notebooks.jpg',
      title: 'Os 7 melhores notebooks de 2026 para trabalhar e jogar sem travar',
      excerpt: 'Multitarefa pesada de dia, jogo pesado à noite: reunimos as 7 máquinas que aguentam esse ritmo sem esquentar, travar ou pesar demais na mochila.',
      date: '24 ago 2026', dateSort: 20260824, readtime: '10 min de leitura', isNew: true
    },
    {
      href: 'artigos/5-fones-bluetooth-custo-beneficio.html', category: 'Áudio', icon: 'headphones', cover: 'images/covers/audio.jpg',
      title: '5 fones de ouvido bluetooth com o melhor custo-benefício',
      excerpt: 'Cancelamento de ruído, bateria de dias e som equilibrado sem pagar preço de topo de linha. Testamos e comparamos os 5 melhores da faixa.',
      date: '20 ago 2026', dateSort: 20260820, readtime: '6 min de leitura', isNew: false
    },
    {
      href: 'artigos/casa-inteligente-por-500.html', category: 'Casa inteligente', icon: 'home', cover: 'images/covers/casa-inteligente.jpg',
      title: 'Como montar sua primeira casa inteligente por menos de R$500',
      excerpt: 'Tomadas, lâmpadas e assistente de voz que realmente valem o investimento — um guia direto ao ponto para começar sem gastar muito.',
      date: '18 ago 2026', dateSort: 20260818, readtime: '7 min de leitura', isNew: false
    },
    {
      href: 'artigos/xiaomi-17t-review.html', category: 'Smartphones', icon: 'phone', cover: 'images/xiaomi/xiaomi-produto.jpg',
      title: 'Xiaomi 17T chega ao Brasil: vale a pena comprar?',
      excerpt: 'O intermediário da Xiaomi promete equilíbrio entre preço e desempenho. Fomos testar se ele realmente entrega o que promete no dia a dia.',
      date: '15 ago 2026', dateSort: 20260815, readtime: '5 min de leitura', isNew: false
    },
    {
      href: 'artigos/robos-corrida-china-2026.html', category: 'Notícias', icon: 'news', cover: 'images/covers/robos.jpg',
      title: 'Robôs mais rápidos que Usain Bolt? Corrida na China impressiona o mundo',
      excerpt: 'Nos Jogos Mundiais de Robôs Humanoides de 2026, em Pequim, o robô Tiangong Ultra completou os 100 metros em 9,39s — mais rápido que o recorde de Usain Bolt.',
      date: '25 ago 2026', dateSort: 20260825, readtime: '10 min de leitura', isNew: true
    },
    {
      href: 'artigos/tiktok-multa-anpd-2026.html', category: 'Notícias', icon: 'news', cover: 'images/covers/tiktok-multa.jpg',
      title: 'TikTok é multado em R$ 153,7 milhões no Brasil: entenda por que',
      excerpt: 'A ANPD multou a ByteDance, controladora do TikTok, por irregularidades no tratamento de dados de crianças e adolescentes no Brasil.',
      date: '25 ago 2026', dateSort: 20260826, readtime: '9 min de leitura', isNew: true
    }
  ];

  const ICONS = {
    phone: '<rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M11 19h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    laptop: '<rect x="3" y="5" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 21h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    headphones: '<path d="M4 15a8 8 0 0116 0M2 15h20M12 15v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    home: '<path d="M3 11l9-7 9 7M5 10v10h14V10" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    news: '<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>'
  };

  const PER_PAGE = 5;
  let state = { category: 'Todos', mode: 'todos', page: 1 };

  function getFiltered(){
    let list = ARTICLES.slice().sort((a,b) => b.dateSort - a.dateSort);
    if (state.mode === 'novidades') list = list.filter(a => a.isNew);
    if (state.category !== 'Todos') list = list.filter(a => a.category === state.category);
    return list;
  }

  function render(){
    const grid = document.getElementById('artigos-grid');
    const pag = document.getElementById('artigos-pagination');
    const tabs = document.getElementById('artigos-tabs');
    if (!grid) return;

    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * PER_PAGE;
    const pageItems = filtered.slice(start, start + PER_PAGE);

    // tabs
    if (tabs){
      tabs.querySelectorAll('.filter-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cat === state.category);
      });
    }

    // grid
    if (!pageItems.length){
      grid.innerHTML = '<div class="empty-state">Nenhum artigo nessa categoria ainda.</div>';
    } else {
      grid.innerHTML = pageItems.map(a => `
        <a href="${a.href}" class="article-card">
          ${a.isNew ? '<span class="new-badge">Novo</span>' : ''}
          <div class="article-thumb">${a.cover ? `<img src="${a.cover}" alt="${a.title}">` : `<svg width="40" height="40" viewBox="0 0 24 24" fill="none">${ICONS[a.icon] || ICONS.phone}</svg>`}</div>
          <div class="article-body">
            <span class="article-cat">${a.category}</span>
            <h3>${a.title}</h3>
            <p class="excerpt">${a.excerpt}</p>
            <div class="article-meta"><span>${a.readtime}</span>·<span>${a.date}</span></div>
          </div>
        </a>
      `).join('');
    }

    // pagination
    if (pag){
      if (totalPages <= 1){
        pag.innerHTML = '';
      } else {
        let html = `<button class="page-btn" data-page="${state.page-1}" ${state.page===1?'disabled':''} aria-label="Página anterior">‹</button>`;
        for (let i=1;i<=totalPages;i++){
          html += `<button class="page-btn ${i===state.page?'active':''}" data-page="${i}">${i}</button>`;
        }
        html += `<button class="page-btn" data-page="${state.page+1}" ${state.page===totalPages?'disabled':''} aria-label="Próxima página">›</button>`;
        pag.innerHTML = html;
      }
    }
  }

  function goTo(id){
    render();
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior:'smooth' });
    });
  }

  function init(){
    const grid = document.getElementById('artigos-grid');
    if (!grid) return;
    render();

    document.getElementById('artigos-pagination')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.page-btn');
      if (!btn || btn.disabled) return;
      state.page = parseInt(btn.dataset.page, 10);
      render();
      document.getElementById('artigos')?.scrollIntoView({ behavior:'smooth' });
    });

    document.getElementById('artigos-tabs')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-tab');
      if (!btn) return;
      state.category = btn.dataset.cat;
      state.mode = 'todos';
      state.page = 1;
      render();
    });

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('[data-goto]');
      if (!card) return;
      // deixa o navegador rolar pela âncora normalmente; apenas garante que o card está renderizado
    });
  }

  return {
    init,
    filterCategory(cat){ state.category = cat; state.mode = 'todos'; state.page = 1; goTo('artigos'); },
    filterNovidades(){ state.category = 'Todos'; state.mode = 'novidades'; state.page = 1; goTo('artigos'); },
    filterAll(){ state.category = 'Todos'; state.mode = 'todos'; state.page = 1; goTo('artigos'); }
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  TA.init();

  // Submenu "Categorias" dentro do menu hambúrguer
  document.querySelectorAll('.nav-subtoggle').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.nav-group').classList.toggle('open');
    });
  });
});
