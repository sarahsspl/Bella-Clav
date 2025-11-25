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
    nome: "Perfume Lacoste Pour Elle Magnetic.png",
    preco: 110.00,
    aroma: "amadeirado",
    notas: ["Maçã","Especiarias","Amora","Mandarina","Algodão-Doce","Macarrons","Lírio-do-Vale","Almíscar","Madeira de Cashmere","Vetiver","Patchouli"],
    imagem: "img/lacostepourellemagnetic.png",
    descricao: "Notas amadeiradas e almiscaradas."
  }
//  {
//    id: 4,
//    nome: "Sunlit Amber",
//    preco: 150.00,
//    aroma: "âmbar",
//   notas: ["Âmbar","Baunilha","Cítrico"],
//    imagem: "images/placeholder4.jpg",
//    descricao: "Âmbar com frescor cítrico."
//  },
// {
//   id: 5,
//   nome: "Citrus Whirl",
//   preco: 95.00,
//   aroma: "cítrico",
//    notas: ["Cítrico","Lavanda"],
//    imagem: "images/placeholder5.jpg",
//    descricao: "Explosão cítrica leve."
//  }
//  {
//    id: 6,
//    nome: "Floral Veil",
//    preco: 120.00,
//    aroma: "floral",
//    notas: ["Rosas","Lavanda"],
//    imagem: "images/placeholder6.jpg",
//   descricao: "Floral suave e fresco."
//  }
];

/* Número do WhatsApp */
const WHATSAPP_NUMBER = "5593992414794";

function formatarPreco(v){ 
  return "R$ " + v.toFixed(2).replace(".", ","); 
}

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

/* ========================= Dropdown de Notas ========================= */

const notasCategoriasDropdown = [
  { titulo: "🌿 Notas Cítricas", itens: ["Bergamota","Limão siciliano","Lima","Laranja","Mandarina / Tangerina"] },
  { titulo: "🌸 Notas Florais — Brancos", itens: ["Jasmim","Gardênia","Tuberosa","Flor de laranjeira","Magnolia","Frangipani","Tiaré"] },
  { titulo: "🌸 Notas Florais — Clássicos", itens: ["Rosa","Íris","Violeta","Lírio-do-vale (Muguet)","Camélia","Peônia","Lavanda"] },
  { titulo: "🌸 Notas Florais — Exóticos", itens: ["Osmanthus","Champaca","Flor de hibisco","Flor de cerejeira"] },
  { titulo: "🍓 Notas Frutadas", itens: ["Amora","Pêra","Maçã","Morango","Framboesa","Cassis (groselha preta)","Cereja","Clementina","Pêssego","Ameixa","Melão","Melancia","Abacaxi","Manga","Maracujá","Lichia","Coco","Figo"] },
  { titulo: "🍭 Notas Doces", itens: ["Baunilha","Fava-tonka","Caramelo","Açúcar","Macarrons","Mel","Chocolate","Café","Marshmallow","Praliné","Amêndoas","Avelã","Leite condensado","Algodão-doce","Bolo / Cookie"] },
  { titulo: "🌾 Notas Especiadas", itens: ["Canela","Cravo","Especiarias","Noz-moscada","Cardamomo","Gengibre","Pimenta rosa","Pimenta preta","Açafrão","Cúrcuma","Cominho"] },
  { titulo: "🌿 Notas Herbais", itens: ["Hortelã","Manjericão","Alecrim","Sálvia","Erva-cidreira","Chá verde","Chá preto","Folhas verdes","Grama fresca","Eucalipto","Folha de Violeta"] },
  { titulo: "🌊 Notas Aquáticas", itens: ["Notas marinhas","Notas ozônicas","Brisa aquática","Pepino","Melão aquático"] },
  { titulo: "🌲 Notas Amadeiradas", itens: ["Cedro","Sândalo","Patchouli","Oud (Agarwood)","Vetiver","Guaiacwood","Cashmere","Pinho","Copaíba","Bétula"] },
  { titulo: "🪵 Notas Ambaradas", itens: ["Âmbar","Benjoim","Mirra","Olíbano","Labdanum","Copaíba","Resinas doces"] },
  { titulo: "🐾 Notas Animálicas", itens: ["Almíscar","Civeta","Castóreo","Ambergris"] },
  { titulo: "🌍 Notas Terrosas", itens: ["Musgo de carvalho","Vetiver terroso","Terra molhada","Raiz de íris","Trufa"] },
  { titulo: "🥥 Notas Cremosas", itens: ["Leite","Creme","Chantilly","Coco cremoso","Acorde de leite"] },
  { titulo: "💨 Notas Aromáticas", itens: ["Lavanda","Sálvia","Alecrim","Tomilho","Manjerona"] },
  { titulo: "🍂 Notas Tabacadas", itens: ["Tabaco doce","Folha de tabaco","Tabaco ambarado"] },
  { titulo: "🍵 Chás e infusões", itens: ["Chá verde","Chá preto","Chá branco","Mate","Earl Grey"] },
  { titulo: "🧊 Notas Frias", itens: ["Metal","Nota gelada","Menta fria","Aldeídos"] },
  { titulo: "🔥 Notas Quentes", itens: ["Canela quente","Âmbar escuro","Baunilha balsâmica"] }
];

function renderNotasDropdown() {
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
      row.dataset.item = item.toLowerCase(); // usado na busca
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

  // mensagem de "nenhuma nota encontrada"
  let noneMsg = document.getElementById('noNotesFound');
  if(!noneMsg){
    noneMsg = document.createElement('div');
    noneMsg.id = 'noNotesFound';
    noneMsg.textContent = 'Nenhuma nota encontrada.';
    noneMsg.style.padding = '8px 10px';
    noneMsg.style.fontWeight = '600';
    noneMsg.style.display = 'none';
  } else {
    noneMsg.style.display = 'none';
  }
  container.appendChild(noneMsg);

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

function initNotasDropdown(){
  renderNotasDropdown();
  setupNotesControls();
}

/* ========================= Inicialização geral ========================= */
document.addEventListener("DOMContentLoaded", () => {

  /* HOME – DESTAQUES COM BOTÃO DE COMPRAR */
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

  /* MOBILE NAV */
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

  /* AROMA FILTERS (se não existir mais no HTML, isso só não faz nada) */
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const aroma = btn.dataset.filter;
      const notas = obterNotasSelecionadasDropdown();
      renderizarProdutos(aroma, notas);
    });
  });

  /* PAGE: LOJA → render inicial */
  if (document.getElementById("products")) {
    renderizarProdutos("todos", []);
  }

  /* PAGE: PRODUTO INDIVIDUAL */
  if(window.location.pathname.endsWith("product.html")){
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10) || produtos[0].id;
    populateProductPage(id);
  }

  initNotasDropdown();
});

/* Produto individual */
function populateProductPage(id){
  const p = produtos.find(x => x.id == id);
  if(!p) return;

  document.getElementById("productImage").src = p.imagem;
  document.getElementById("productName").innerText = p.nome;
  document.getElementById("productPrice").innerText = formatarPreco(p.preco);
  document.getElementById("productDesc").innerText = p.descricao;

  const ul = document.getElementById("productNotes");
  ul.innerHTML = "";
  p.notas.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n;
    ul.appendChild(li);
  });

  document.getElementById("buyNow").addEventListener("click", () => abrirWhatsApp(p.id));
}

/* Mobile nav: usa aria-expanded + animação suave e fecha ao clicar em um link */
(function(){
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobileNav");
  if(!menuToggle || !mobileNav) return;

  // inicializa
  mobileNav.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");

  menuToggle.addEventListener("click", () => {
    const hidden = mobileNav.getAttribute("aria-hidden") === "true";
    mobileNav.setAttribute("aria-hidden", String(!hidden));
    menuToggle.setAttribute("aria-expanded", String(hidden));
    // para acessibilidade: rolar o topo do menu ao abrir
    if(hidden) mobileNav.scrollTop = 0;
  });

  // fecha o menu ao clicar em qualquer link (útil no mobile)
  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileNav.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
})();

/* ===== pequenos ajustes JS para o menu mobile e acessibilidade =====
   - garante aria-expanded/aria-hidden coerentes para usar as transições CSS acima
   - fecha menu ao clicar num link (já existia, mas reforçamos)
   - se preferir manter a versão antiga do menu, esse script é compatível
================================================================== */
(function(){
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobileNav");
  if(!menuToggle || !mobileNav) return;

  // cria um span interno caso o HTML use o caractere "☰" (assim as barras aparecem via CSS)
  if(!menuToggle.querySelector("span")){
    const s = document.createElement("span");
    menuToggle.innerHTML = ""; // remove o símbolo textual
    menuToggle.appendChild(s);
  }

  // garantir estado inicial
  menuToggle.setAttribute("aria-expanded", "false");
  mobileNav.setAttribute("aria-hidden", "true");

  function abrirMenu(){
    const aberto = mobileNav.getAttribute("aria-hidden") === "false";
    const novoAberto = !aberto;
    mobileNav.setAttribute("aria-hidden", String(!novoAberto));
    menuToggle.setAttribute("aria-expanded", String(novoAberto));
    // controle visual (para compatibilidade com o CSS que usa aria-hidden)
    if(novoAberto){
      mobileNav.style.display = "block";
      // forçar foco no primeiro link para acessibilidade
      const primeiro = mobileNav.querySelector("a");
      if(primeiro) primeiro.focus();
    } else {
      mobileNav.style.display = "none";
    }
  }

  menuToggle.addEventListener("click", abrirMenu);

  // fecha ao clicar em link dentro do menu (útil em mobile)
  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileNav.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
      mobileNav.style.display = "none";
    });
  });

  // previne que cliques acidentais fora do menu deixem algo estranho
  document.addEventListener("click", (e) => {
    const alvo = e.target;
    if(!menuToggle.contains(alvo) && !mobileNav.contains(alvo)){
      mobileNav.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
      mobileNav.style.display = "none";
    }
  });
})();
