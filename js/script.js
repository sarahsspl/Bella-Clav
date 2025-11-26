/* ========== Dados (adapte se desejar) ========== */
const produtos = [
  {
    id: 1,
    nome: "Perfume Candy White Grandeur",
    preco: 130.00,
    aroma: "amadeirado",
    notas: ["Ameixa","Almíscar","Baunilha","Praliné","Raiz de íris","Coco"],
    imagem: "/img/candywhitegrandeur.png",
    descricao: "Notas verdes e amadeiradas, refrescante e elegante."
  },
  {
    id: 2,
    nome: "Perfume Lacoste Rose",
    preco: 130.00,
    aroma: "âmbar",
    notas: ["Manga","Baunilha","Rosas","Clementina","Laranja","Heliotrópio"],
    imagem: "/img/perfumelacosterose.png",
    descricao: "Fragrância âmbar quente com toque de baunilha e rosas."
  },
  {
    id: 3,
    nome: "Perfume Lacoste Pour Elle Magnetic",
    preco: 110.00,
    aroma: "amadeirado",
    notas: ["Maçã","Especiarias","Amora","Mandarina","Algodão-Doce","Macarrons"],
    imagem: "/img/lacostepourellemagnetic.png",
    descricao: "Notas amadeiradas e almiscaradas."
  }
];

const WHATSAPP_NUMBER = "5593992414794";
function formatarPreco(v){ return "R$ " + v.toFixed(2).replace(".", ","); }

/* ========== Render produtos (home / loja) ========== */
function criarCardProduto(p){
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <img src="${p.imagem}" alt="${p.nome}" />
    <h3>${p.nome}</h3>
    <p class="price">${formatarPreco(p.preco)}</p>
    <div class="actions">
      <a class="buy-btn" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Tenho interesse no perfume \"'+p.nome+'\"')}" target="_blank" rel="noopener">Comprar</a>
      <a class="buy-btn" href="/loja/produto.html?id=${p.id}">Ver</a>
    </div>
  `;
  return card;
}

function renderizarProdutos(filtroAroma = "todos", filtroNotas = []) {
  const container = document.getElementById("products") || document.getElementById("featured");
  if(!container) return;
  container.innerHTML = "";

  let lista = produtos.slice();
  if(filtroAroma !== "todos") lista = lista.filter(p => p.aroma === filtroAroma);

  if(filtroNotas.length) {
    const notasLower = filtroNotas.map(n => n.toLowerCase());
    lista = lista.filter(p => notasLower.every(n => p.notas.map(x=>x.toLowerCase()).includes(n)));
  }

  lista.forEach(p => {
    const card = criarCardProduto(p);
    container.appendChild(card);
  });
}

/* ========== Featured (garante 3 únicos) ========== */
function renderFeaturedExactly3(){
  const featured = document.getElementById("featured");
  if(!featured) return;
  featured.innerHTML = "";

  const unique = Array.from(new Set(produtos.map(p => p.id))).slice(0,3);
  unique.forEach(id => {
    const p = produtos.find(x => x.id === id);
    if(p){
      featured.appendChild(criarCardProduto(p));
    }
  });
}

/* ========== Notas dropdown data (desktop) ========== */
const notasCategoriasDropdown = [
  { titulo: "🌿 Notas Cítricas", itens: ["Bergamota","Limão siciliano","Lima","Laranja","Mandarina / Tangerina"] },
  { titulo: "🌸 Notas Florais — Brancos", itens: ["Jasmim","Gardênia","Tuberosa","Flor de laranjeira","Magnolia","Frangipani","Tiaré"] },
  { titulo: "🌸 Notas Florais — Clássicos", itens: ["Rosa","Íris","Violeta","Lírio-do-vale (Muguet)","Camélia","Peônia","Lavanda"] },
  { titulo: "🍓 Notas Frutadas", itens: ["Amora","Pêra","Maçã","Morango","Framboesa","Cassis","Cereja","Clementina","Pêssego","Ameixa","Manga","Coco"] },
  { titulo: "🍭 Notas Doces", itens: ["Baunilha","Fava-tonka","Caramelo","Açúcar","Macarrons","Mel","Chocolate","Café","Praliné"] },
  { titulo: "🌲 Notas Amadeiradas", itens: ["Cedro","Sândalo","Patchouli","Oud","Vetiver","Pinho"] },
  { titulo: "🪵 Notas Ambaradas", itens: ["Âmbar","Benjoim","Mirra","Olíbano"] }
];

function renderNotasDropdown() {
  const container = document.getElementById('notesCategories');
  if(!container) return;
  container.innerHTML = '';

  notasCategoriasDropdown.forEach((cat, idx) => {
    const c = document.createElement('div'); c.className = 'note-category';
    const title = document.createElement('div'); title.className = 'cat-title';
    title.innerHTML = `<strong>${cat.titulo}</strong>`;
    const list = document.createElement('div'); list.className = 'note-list';

    cat.itens.forEach(item => {
      const safeId = `note_${idx}_${item.replace(/[^a-zA-Z0-9_-]/g,'_')}`;
      const row = document.createElement('label');
      row.className = 'note-row';
      row.dataset.item = item.toLowerCase();
      row.innerHTML = `<input type="checkbox" id="${safeId}" value="${item}" style="display:none"><span class="label-text">${item}</span>`;
      list.appendChild(row);

      row.addEventListener('click', (e) => {
        const cb = row.querySelector('input[type="checkbox"]');
        cb.checked = !cb.checked;
        row.classList.toggle('checked', cb.checked);
        dispatchFilterUpdate();
      });
    });

    c.appendChild(title);
    c.appendChild(list);
    container.appendChild(c);
  });
}

function notesSearch(q){
  q = (q||'').toLowerCase().trim();
  const categories = document.querySelectorAll('.note-category');
  categories.forEach(cat => {
    const rows = Array.from(cat.querySelectorAll('.note-row'));
    let catHas = false;
    rows.forEach(r => {
      const txt = (r.dataset.item || r.innerText).toLowerCase();
      const match = !q || txt.indexOf(q) !== -1;
      r.style.display = match ? 'flex' : 'none';
      if(match) catHas = true;
    });
    cat.style.display = catHas ? 'block' : 'none';
  });
}

function setupNotesControls(){
  const search = document.getElementById('notesSearchMain');
  if(search){
    search.addEventListener('input', () => notesSearch(search.value));
  }
  const selAll = document.getElementById('notesSelectAllGlobal');
  const clrAll = document.getElementById('notesClearAllGlobal');
  if(selAll){ selAll.addEventListener('click', () => {
    document.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => { cb.checked = true; cb.closest('.note-row').classList.add('checked'); });
    dispatchFilterUpdate();
  }); }
  if(clrAll){ clrAll.addEventListener('click', () => {
    document.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => { cb.checked = false; cb.closest('.note-row').classList.remove('checked'); });
    dispatchFilterUpdate();
  }); }
}

function obterNotasSelecionadasDropdown(){
  return Array.from(document.querySelectorAll('.note-row input[type="checkbox"]:checked')).map(c => c.value);
}

function dispatchFilterUpdate(){
  const notas = obterNotasSelecionadasDropdown();
  renderizarProdutos("todos", notas);
}

/* Produto page */
function abrirWhatsApp(id){
  const p = produtos.find(x => x.id == id);
  if(!p) return;
  const msg = encodeURIComponent(`Olá! Tenho interesse no perfume "${p.nome}". Poderia me passar mais detalhes?`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
}

function populateProductPage(id){
  const p = produtos.find(x => x.id == id);
  if(!p) return;
  const img = document.getElementById("productImage");
  if(img) img.src = p.imagem;
  const name = document.getElementById("productName");
  if(name) name.innerText = p.nome;
  const price = document.getElementById("productPrice");
  if(price) price.innerText = formatarPreco(p.preco);
  const desc = document.getElementById("productDesc");
  if(desc) desc.innerText = p.descricao;
  const ul = document.getElementById("productNotes");
  if(ul){ ul.innerHTML = ""; p.notas.forEach(n => { const li = document.createElement("li"); li.textContent = n; ul.appendChild(li); }); }
  const buyNow = document.getElementById("buyNow");
  if(buyNow) buyNow.addEventListener("click", ()=> abrirWhatsApp(p.id));
}

/* Mobile nav (igual, robusto) */
function initMobileNav(){
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobileNav");
  if(!menuToggle || !mobileNav) return;

  mobileNav.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");

  menuToggle.addEventListener("click", () => {
    const hidden = mobileNav.getAttribute("aria-hidden") === "true";
    mobileNav.setAttribute("aria-hidden", String(!hidden));
    menuToggle.setAttribute("aria-expanded", String(hidden));
    mobileNav.scrollTop = 0;
  });

  mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    mobileNav.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}

/* =========================
   MOBILE NOTES: floating button + modal (robusto)
   - cria botão flutuante
   - cria modal/backdrop
   - clona conteúdo das notas (ou renderiza fresh)
   - sincroniza modal <-> desktop
   - fecha ao rolar
   ========================= */
function setupMobileNotesModal(){
  const isMobile = window.matchMedia && window.matchMedia("(max-width:720px)").matches;
  if(!isMobile) return;

  // floating button
  let floating = document.querySelector('.floating-filter');
  if(!floating){
    floating = document.createElement('button');
    floating.className = 'floating-filter';
    floating.id = 'floatingFilterBtn';
    floating.type = 'button';
    floating.innerHTML = 'Filtrar Notas ▾';
    document.body.appendChild(floating);
  }

  // backdrop + modal
  let backdrop = document.querySelector('.notes-modal-backdrop');
  if(!backdrop){
    backdrop = document.createElement('div');
    backdrop.className = 'notes-modal-backdrop';
    backdrop.id = 'notesModalBackdrop';
    backdrop.innerHTML = `
      <div class="notes-modal" role="dialog" aria-modal="true" aria-labelledby="notesModalTitle" tabindex="-1">
        <div class="modal-header" style="display:flex;align-items:center;justify-content:space-between;">
          <div class="modal-title" id="notesModalTitle">Filtrar por Notas</div>
          <button class="close-modal" aria-label="Fechar" type="button">✕</button>
        </div>
        <div class="modal-body" style="padding-top:10px;">
          <input id="notesSearchModal" class="notes-search" placeholder="Buscar nota..." />
          <div id="notesCategoriesModal" class="notes-categories" style="padding-top:12px;"></div>
          <div style="display:flex; gap:8px; margin-top:12px;">
            <button id="notesSelectAllModal" class="small-link" type="button" style="flex:1">Selecionar Tudo</button>
            <button id="notesClearAllModal" class="small-link" type="button" style="flex:1">Limpar Tudo</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
  }

  const modal = backdrop.querySelector('.notes-modal');
  const closeBtn = backdrop.querySelector('.close-modal');
  const searchModal = document.getElementById('notesSearchModal');
  const categoriesModalContainer = document.getElementById('notesCategoriesModal');

  const desktopNotes = document.getElementById('notesCategories');
  if(desktopNotes){
    categoriesModalContainer.innerHTML = desktopNotes.innerHTML;
  } else {
    try{ renderNotasDropdown(); }catch(e){}
    const d = document.getElementById('notesCategories');
    categoriesModalContainer.innerHTML = d ? d.innerHTML : '';
  }

  // attach handlers
  function attachModalHandlers(){
    categoriesModalContainer.querySelectorAll('.select-group').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const idx = btn.dataset.idx;
        const group = categoriesModalContainer.querySelectorAll('.note-category')[idx];
        if(!group) return;
        group.querySelectorAll('.note-list input[type="checkbox"]').forEach(cb => {
          cb.checked = true; cb.closest('.note-row').classList.add('checked');
        });
      });
    });
    categoriesModalContainer.querySelectorAll('.clear-group').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const idx = btn.dataset.idx;
        const group = categoriesModalContainer.querySelectorAll('.note-category')[idx];
        if(!group) return;
        group.querySelectorAll('.note-list input[type="checkbox"]').forEach(cb => {
          cb.checked = false; cb.closest('.note-row').classList.remove('checked');
        });
      });
    });

    categoriesModalContainer.querySelectorAll('.note-row').forEach(row => {
      row.addEventListener('click', (ev) => {
        if(ev.target.tagName.toLowerCase() === 'button') return;
        const cb = row.querySelector('input[type="checkbox"]');
        if(!cb) return;
        cb.checked = !cb.checked;
        row.classList.toggle('checked', cb.checked);
      });
    });
  }
  attachModalHandlers();

  function syncModalToDesktop(){
    const desktop = document.getElementById('notesCategories');
    if(!desktop) return;
    const mapping = {};
    categoriesModalContainer.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => {
      mapping[cb.value] = cb.checked;
    });
    desktop.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => {
      if(typeof mapping[cb.value] !== 'undefined'){
        cb.checked = mapping[cb.value];
        cb.closest('.note-row').classList.toggle('checked', cb.checked);
      }
    });
  }

  function syncDesktopToModal(){
    const desktop = document.getElementById('notesCategories');
    if(!desktop) return;
    const mapping = {};
    desktop.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => {
      mapping[cb.value] = cb.checked;
    });
    categoriesModalContainer.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => {
      if(typeof mapping[cb.value] !== 'undefined'){
        cb.checked = mapping[cb.value];
        cb.closest('.note-row').classList.toggle('checked', cb.checked);
      } else {
        cb.checked = false;
        cb.closest('.note-row').classList.remove('checked');
      }
    });
  }

  function openModal(){
    syncDesktopToModal();
    backdrop.classList.add('open');
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    const f = backdrop.querySelector('#notesSearchModal');
    if(f) f.focus();
  }
  function closeModal(){
    syncModalToDesktop();
    dispatchFilterUpdate();
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  floating.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => { if(e.target === backdrop) closeModal(); });

  if(searchModal){
    searchModal.addEventListener('input', function(){
      const q = (this.value||"").toLowerCase().trim();
      const cats = categoriesModalContainer.querySelectorAll('.note-category');
      cats.forEach(cat => {
        const rows = Array.from(cat.querySelectorAll('.note-row'));
        let catHas = false;
        rows.forEach(r => {
          const txt = (r.dataset.item || r.innerText).toLowerCase();
          const match = !q || txt.indexOf(q) !== -1;
          r.style.display = match ? 'flex' : 'none';
          if(match) catHas = true;
        });
        cat.style.display = catHas ? 'block' : 'none';
      });
    });
  }

  const selModal = document.getElementById('notesSelectAllModal');
  const clrModal = document.getElementById('notesClearAllModal');
  if(selModal){
    selModal.addEventListener('click', () => {
      categoriesModalContainer.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => {
        cb.checked = true; cb.closest('.note-row').classList.add('checked');
      });
      syncModalToDesktop(); dispatchFilterUpdate();
    });
  }
  if(clrModal){
    clrModal.addEventListener('click', () => {
      categoriesModalContainer.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => {
        cb.checked = false; cb.closest('.note-row').classList.remove('checked');
      });
      syncModalToDesktop(); dispatchFilterUpdate();
    });
  }

  // fechar ao rolar (debounced leve)
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    if(!window.matchMedia("(max-width:720px)").matches) return;
    const s = window.scrollY || window.pageYOffset;
    if(Math.abs(s - lastScroll) > 20) {
      closeModal();
      lastScroll = s;
    }
  }, { passive: true });

  // resize guard
  window.addEventListener('resize', () => {
    if(!window.matchMedia("(max-width:720px)").matches){
      backdrop.classList.remove('open'); modal.classList.remove('open'); document.body.classList.remove('modal-open');
      if(floating) floating.style.display = 'none';
    } else {
      if(floating) floating.style.display = 'inline-flex';
      attachModalHandlers();
    }
  });

  // ensure floating visible on mobile init
  if(window.matchMedia("(max-width:720px)").matches){
    floating.style.display = 'inline-flex';
  } else {
    floating.style.display = 'none';
  }
}

/* Início */
document.addEventListener("DOMContentLoaded", () => {
  renderNotasDropdown();
  setupNotesControls();
  renderizarProdutos("todos", []);

  renderFeaturedExactly3();

  if(window.location.pathname.endsWith("/loja/produto.html")){
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10) || produtos[0].id;
    populateProductPage(id);
  }

  document.querySelectorAll(".floating-whatsapp").forEach(el => {
    el.addEventListener("click", (e)=>{
      e.preventDefault();
      window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
    });
  });

  initMobileNav();
  setupMobileNotesModal();

  // Defensive: ensure desktop notes are hidden on mobile (guardrail)
  if(window.matchMedia("(max-width:720px)").matches){
    document.querySelectorAll('.notes-panel, .notes-dropdown, #notesPanel, #notesCategories').forEach(el=>{
      if(el) { el.style.display = 'none'; el.style.visibility = 'hidden'; el.style.maxHeight = '0px'; el.style.overflow = 'hidden'; }
    });
  }

});
