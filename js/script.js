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

  // garante ids únicos e pega até 3
  const unique = Array.from(new Set(produtos.map(p => p.id))).slice(0,3);
  unique.forEach(id => {
    const p = produtos.find(x => x.id === id);
    if(p){
      featured.appendChild(criarCardProduto(p));
    }
  });
}

/* ========== restante do script (menus, notas, produto page) ========== */

/* Notas dropdown (mesma lógica do anterior) */
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

/* Início */
document.addEventListener("DOMContentLoaded", () => {
  renderNotasDropdown();
  setupNotesControls();
  renderizarProdutos("todos", []);

  // featured no home: garante 3 únicos
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
});
