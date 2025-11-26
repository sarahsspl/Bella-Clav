/* =========================
   Produtos, filtros e UI
   (versão integrada com modal de notas no mobile)
   ========================= */

/* Lista de produtos (exemplo) */
const produtos = [
  {
    id: 1,
    nome: "Perfume Candy White Grandeur",
    preco: 130.00,
    aroma: "amadeirado",
    notas: ["Ameixa","Almíscar","Baunilha","Praliné","Raiz de íris","Coco"],
    imagem: "img/candywhitegrandeur.png",
    descricao: "Notas verdes e amadeiradas, refrescante e elegante."
  },
  {
    id: 2,
    nome: "Perfume Lacoste Rose",
    preco: 130.00,
    aroma: "âmbar",
    notas: ["Manga","Baunilha","Rosas","Clementina","Laranja","Heliotrópio","Folha de Violeta","Jasmim","Fava Tonka","Patchouli"],
    imagem: "img/perfumelacosterose.png",
    descricao: "Fragrância âmbar quente com toque de baunilha e rosas."
  },
  {
    id: 3,
    nome: "Perfume Lacoste Pour Elle Magnetic",
    preco: 110.00,
    aroma: "amadeirado",
    notas: ["Maçã","Especiarias","Amora","Mandarina","Algodão-Doce","Macarrons","Lírio-do-Vale","Almíscar","Madeira de Cashmere","Vetiver","Patchouli"],
    imagem: "img/lacostepourellemagnetic.png",
    descricao: "Notas amadeiradas e almiscaradas."
  }
];

/* Número do WhatsApp */
const WHATSAPP_NUMBER = "5593992414794";

function formatarPreco(v){
  return "R$ " + v.toFixed(2).replace(".", ",");
}

/* Renderizar produtos em container #products (ou #featured) */
function renderizarProdutos(filtroAroma = "todos", filtroNotas = []){
  const container = document.getElementById("products") || document.getElementById("featured");
  if(!container) return;
  container.innerHTML = "";

  let lista = produtos.slice();

  if(filtroAroma !== "todos"){
    lista = lista.filter(p => p.aroma === filtroAroma);
  }

  if(filtroNotas.length){
    const notasLower = filtroNotas.map(n => n.toLowerCase());
    lista = lista.filter(p => {
      const pNotas = p.notas.map(x => x.toLowerCase());
      return notasLower.every(n => pNotas.includes(n));
    });
  }

  lista.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}" />
      <h3>${p.nome}</h3>
      <p class="price">${formatarPreco(p.preco)}</p>
      <button class="buy-btn" data-id="${p.id}">Comprar</button>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => abrirWhatsApp(btn.dataset.id));
  });
}

/* Abrir WhatsApp */
function abrirWhatsApp(id){
  const p = produtos.find(x => x.id == id);
  if(!p) return;
  const msg = encodeURIComponent(`Olá! Tenho interesse no perfume "${p.nome}". Poderia me passar mais detalhes?`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
}

/* ========================= Dropdown de Notas — dados e render */
const notasCategoriasDropdown = [
  { titulo: "🌿 Notas Cítricas", itens: ["Bergamota","Limão siciliano","Lima","Laranja","Mandarina / Tangerina"] },
  { titulo: "🌸 Notas Florais — Brancos", itens: ["Jasmim","Gardênia","Tuberosa","Flor de laranjeira","Magnolia","Frangipani","Tiaré"] },
  { titulo: "🌸 Notas Florais — Clássicos", itens: ["Rosa","Íris","Violeta","Lírio-do-vale (Muguet)","Camélia","Peônia","Lavanda"] },
  { titulo: "🍓 Notas Frutadas", itens: ["Amora","Pêra","Maçã","Morango","Framboesa","Cassis","Cereja","Clementina","Pêssego","Ameixa","Manga","Coco"] },
  { titulo: "🍭 Notas Doces", itens: ["Baunilha","Fava-tonka","Caramelo","Açúcar","Macarrons","Mel","Chocolate","Café","Praliné"] },
  { titulo: "🌲 Notas Amadeiradas", itens: ["Cedro","Sândalo","Patchouli","Oud","Vetiver","Pinho"] },
  { titulo: "🪵 Notas Ambaradas", itens: ["Âmbar","Benjoim","Mirra","Olíbano"] }
];

function renderNotasDropdown(){
  const container = document.getElementById('notesCategories');
  if(!container) return;
  container.innerHTML = '';

  notasCategoriasDropdown.forEach((cat, idx) => {
    const c = document.createElement('div');
    c.className = 'note-category';
    c.dataset.idx = idx;

    const title = document.createElement('div');
    title.className = 'cat-title';
    title.innerHTML = `<span>${cat.titulo}</span>
      <div>
        <button class="small-link select-group" data-idx="${idx}">Selecionar</button>
        <button class="small-link clear-group" data-idx="${idx}">Limpar</button>
      </div>`;

    const list = document.createElement('div');
    list.className = 'note-list';

    cat.itens.forEach(item => {
      const safeId = `note_${idx}_${item.replace(/[^a-zA-Z0-9_-]/g,'_')}`;
      const row = document.createElement('label');
      row.className = 'note-row';
      row.dataset.item = item.toLowerCase();
      row.innerHTML = `
        <input type="checkbox" class="note-checkbox" id="${safeId}" value="${item}">
        <span class="label-text">${item}</span>
      `;
      list.appendChild(row);

      row.addEventListener('click', (e) => {
        if(e.target.tagName.toLowerCase() === 'button') return;
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

  // "nenhuma nota"
  let noneMsg = document.getElementById('noNotesFound');
  if(!noneMsg){
    noneMsg = document.createElement('div');
    noneMsg.id = 'noNotesFound';
    noneMsg.textContent = 'Nenhuma nota encontrada.';
    noneMsg.style.padding = '8px 10px';
    noneMsg.style.fontWeight = '600';
    noneMsg.style.display = 'none';
    container.appendChild(noneMsg);
  } else {
    noneMsg.style.display = 'none';
  }

  document.querySelectorAll('.select-group').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = btn.dataset.idx;
      const group = document.querySelectorAll('.note-category')[idx];
      group.querySelectorAll('.note-list input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
        cb.closest('.note-row').classList.add('checked');
      });
      dispatchFilterUpdate();
    });
  });

  document.querySelectorAll('.clear-group').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = btn.dataset.idx;
      const group = document.querySelectorAll('.note-category')[idx];
      group.querySelectorAll('.note-list input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
        cb.closest('.note-row').classList.remove('checked');
      });
      dispatchFilterUpdate();
    });
  });
}

function notesSearch(q){
  q = (q||'').toLowerCase().trim();
  const categories = document.querySelectorAll('.note-category');
  let anyVisible = false;

  categories.forEach(cat => {
    const rows = Array.from(cat.querySelectorAll('.note-row'));
    let catHasMatch = false;

    rows.forEach(r => {
      const txt = (r.dataset.item || r.innerText).toLowerCase();
      const match = !q || txt.indexOf(q) !== -1;
      r.style.display = match ? 'flex' : 'none';
      if (match) catHasMatch = true;
    });

    cat.style.display = catHasMatch ? 'block' : 'none';
    if (catHasMatch) anyVisible = true;
  });

  const noneMsg = document.getElementById('noNotesFound');
  if(noneMsg){
    noneMsg.style.display = anyVisible ? 'none' : 'block';
  }
}

function setupNotesControls(){
  const search = document.getElementById('notesSearchMain');
  if(search){
    search.addEventListener('input', () => notesSearch(search.value));
  }

  const selAll = document.getElementById('notesSelectAllGlobal');
  const clrAll = document.getElementById('notesClearAllGlobal');

  if(selAll){
    selAll.addEventListener('click', () => {
      document.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
        cb.closest('.note-row').classList.add('checked');
      });
      dispatchFilterUpdate();
    });
  }
  if(clrAll){
    clrAll.addEventListener('click', () => {
      document.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
        cb.closest('.note-row').classList.remove('checked');
      });
      dispatchFilterUpdate();
    });
  }
}

function obterNotasSelecionadasDropdown(){
  return Array.from(document.querySelectorAll('.note-row input[type="checkbox"]:checked')).map(c => c.value);
}

function dispatchFilterUpdate(){
  const aroma = 'todos';
  const notas = obterNotasSelecionadasDropdown();
  renderizarProdutos(aroma, notas);
}

/* ========================= Inicialização geral (DOM) ========================= */
document.addEventListener("DOMContentLoaded", () => {

  /* HOME – DESTAQUES */
  const featured = document.getElementById("featured");
  if (featured) {
    produtos.slice(0, 3).forEach(p => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.imagem}" alt="${p.nome}" />
        <h3>${p.nome}</h3>
        <p class="price">${formatarPreco(p.preco)}</p>
        <button class="buy-btn" data-id="${p.id}">Comprar</button>
      `;
      featured.appendChild(card);
    });

    featured.querySelectorAll(".buy-btn").forEach(btn => {
      btn.addEventListener("click", () => abrirWhatsApp(btn.dataset.id));
    });
  }

  /* MOBILE NAV toggle */
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobileNav");
  if(menuToggle && mobileNav){
    mobileNav.style.display = "none";
    mobileNav.setAttribute("aria-hidden", "true");

    menuToggle.addEventListener("click", () => {
      const hidden = mobileNav.getAttribute("aria-hidden") === "true";
      mobileNav.style.display = hidden ? "block" : "none";
      mobileNav.setAttribute("aria-hidden", (!hidden).toString());
    });
  }

  /* aroma filter buttons */
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const aroma = btn.dataset.filter;
      const notas = obterNotasSelecionadasDropdown();
      renderizarProdutos(aroma, notas);
    });
  });

  /* LOJA: render inicial */
  if (document.getElementById("products")) {
    renderizarProdutos("todos", []);
  }

  /* Produto individual */
  if(window.location.pathname.endsWith("product.html")){
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10) || produtos[0].id;
    populateProductPage(id);
  }

  /* Notas dropdown (desktop) */
  renderNotasDropdown();
  setupNotesControls();

  /* --- NEW: create floating filter button and modal for mobile --- */
  setupMobileNotesModal();

  /* defensive image adjustments: avoid very tall images creating huge space */
  document.querySelectorAll('.card img').forEach(img => {
    img.addEventListener('load', () => {
      try{
        if(img.naturalHeight && img.naturalWidth){
          const ratio = img.naturalHeight / img.naturalWidth;
          if(ratio > 2.2){ // very tall image
            img.style.maxHeight = '420px';
            img.style.objectFit = 'cover';
            img.style.width = '100%';
          } else {
            img.style.objectFit = 'contain';
          }
        }
      }catch(e){}
    });
  });

});

/* Produto individual populate */
function populateProductPage(id){
  const p = produtos.find(x => x.id == id);
  if(!p) return;

  const imgEl = document.getElementById("productImage");
  if(imgEl) imgEl.src = p.imagem;
  const nameEl = document.getElementById("productName");
  if(nameEl) nameEl.innerText = p.nome;
  const priceEl = document.getElementById("productPrice");
  if(priceEl) priceEl.innerText = formatarPreco(p.preco);
  const descEl = document.getElementById("productDesc");
  if(descEl) descEl.innerText = p.descricao;

  const ul = document.getElementById("productNotes");
  if(ul){
    ul.innerHTML = "";
    p.notas.forEach(n => {
      const li = document.createElement("li");
      li.textContent = n;
      ul.appendChild(li);
    });
  }

  const buyNowBtn = document.getElementById("buyNow");
  if(buyNowBtn) buyNowBtn.addEventListener("click", () => abrirWhatsApp(p.id));
}

/* =========================
   MOBILE NOTES: floating button + modal
   - on small screens the original notes-panel is hidden by CSS
   - this script clones the notesCategories content into a modal for mobile use
   ========================= */
function setupMobileNotesModal(){
  // only on mobile widths
  const isMobile = window.matchMedia && window.matchMedia("(max-width:720px)").matches;
  if(!isMobile) return;

  // create floating button
  let floating = document.querySelector('.floating-filter');
  if(!floating){
    floating = document.createElement('button');
    floating.className = 'floating-filter';
    floating.id = 'floatingFilterBtn';
    floating.innerHTML = 'Filtrar Notas ▾';
    document.body.appendChild(floating);
  }

  // create modal backdrop
  let backdrop = document.querySelector('.notes-modal-backdrop');
  if(!backdrop){
    backdrop = document.createElement('div');
    backdrop.className = 'notes-modal-backdrop';
    backdrop.id = 'notesModalBackdrop';
    backdrop.innerHTML = `
      <div class="notes-modal" role="dialog" aria-modal="true" aria-labelledby="notesModalTitle" tabindex="-1">
        <div class="modal-header">
          <div class="modal-title" id="notesModalTitle">Filtrar por Notas</div>
          <button class="close-modal" aria-label="Fechar">✕</button>
        </div>
        <div class="modal-body">
          <input id="notesSearchModal" class="notes-search" placeholder="Buscar nota..." />
          <div id="notesCategoriesModal" class="notes-categories" style="padding-bottom:12px;"></div>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <button id="notesSelectAllModal" class="small-link" style="flex:1">Selecionar Tudo</button>
            <button id="notesClearAllModal" class="small-link" style="flex:1">Limpar Tudo</button>
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

  // clone the desktop notesCategories into modal (if exists)
  const desktopNotes = document.getElementById('notesCategories');
  if(desktopNotes && categoriesModalContainer){
    // clone content (deep)
    categoriesModalContainer.innerHTML = desktopNotes.innerHTML;
  } else {
    // if no desktop container, render fresh
    renderNotasDropdown();
    const desktop = document.getElementById('notesCategories');
    if(desktop) categoriesModalContainer.innerHTML = desktop.innerHTML;
  }

  // show/hide handlers
  function openModal(){
    backdrop.style.display = 'flex';
    setTimeout(()=>{ modal.classList.add('open'); }, 10);
    // focus first input for accessibility
    const focusInput = backdrop.querySelector('#notesSearchModal');
    if(focusInput) focusInput.focus();
  }
  function closeModal(){
    modal.classList.remove('open');
    setTimeout(()=>{ backdrop.style.display = 'none'; }, 240);
  }

  floating.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if(e.target === backdrop) closeModal();
  });

  // wire up search within modal (search clones)
  function modalNotesSearch(q){
    q = (q||'').toLowerCase().trim();
    const categories = categoriesModalContainer.querySelectorAll('.note-category');
    let anyVisible = false;
    categories.forEach(cat => {
      const rows = Array.from(cat.querySelectorAll('.note-row'));
      let catHasMatch = false;
      rows.forEach(r => {
        const txt = (r.dataset.item || r.innerText).toLowerCase();
        const match = !q || txt.indexOf(q) !== -1;
        r.style.display = match ? 'flex' : 'none';
        if(match) catHasMatch = true;
      });
      cat.style.display = catHasMatch ? 'block' : 'none';
      if(catHasMatch) anyVisible = true;
    });
    // optional: show none message
  }
  if(searchModal){
    searchModal.addEventListener('input', ()=> modalNotesSearch(searchModal.value));
  }

  // select all / clear all modal
  const selModal = document.getElementById('notesSelectAllModal');
  const clrModal = document.getElementById('notesClearAllModal');
  if(selModal){
    selModal.addEventListener('click', () => {
      categoriesModalContainer.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
        cb.closest('.note-row').classList.add('checked');
      });
      // copy selections back to desktop checkboxes (if present)
      syncModalToDesktop();
      dispatchFilterUpdate();
    });
  }
  if(clrModal){
    clrModal.addEventListener('click', () => {
      categoriesModalContainer.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
        cb.closest('.note-row').classList.remove('checked');
      });
      syncModalToDesktop();
      dispatchFilterUpdate();
    });
  }

  // clicking a row inside the modal toggles checkbox
  categoriesModalContainer.addEventListener('click', (e) => {
    const row = e.target.closest('.note-row');
    if(!row) return;
    const cb = row.querySelector('input[type="checkbox"]');
    if(!cb) return;
    cb.checked = !cb.checked;
    row.classList.toggle('checked', cb.checked);
    syncModalToDesktop();
    dispatchFilterUpdate();
  });

  // ensure modal -> desktop sync: copies modal selections into original notesCategories
  function syncModalToDesktop(){
    const desktop = document.getElementById('notesCategories');
    if(!desktop) return;
    const mapping = {};
    // build map from modal (value -> checked)
    categoriesModalContainer.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => {
      mapping[cb.value] = cb.checked;
    });
    // apply to desktop
    desktop.querySelectorAll('.note-row input[type="checkbox"]').forEach(cb => {
      if(typeof mapping[cb.value] !== 'undefined'){
        cb.checked = mapping[cb.value];
        cb.closest('.note-row').classList.toggle('checked', cb.checked);
      }
    });
  }

  // when modal closes, keep it closed and keep selections
  closeBtn.addEventListener('click', () => {
    syncModalToDesktop();
    closeModal();
  });

  // accessibility: close with ESC
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && backdrop.style.display === 'flex') closeModal();
  });

  // if window resized to desktop, remove floating button and hide modal
  window.addEventListener('resize', () => {
    if(!window.matchMedia("(max-width:720px)").matches){
      backdrop.style.display = 'none';
      if(floating) floating.style.display = 'none';
    } else {
      if(floating) floating.style.display = 'inline-flex';
    }
  });
}

/* End of script.js */
