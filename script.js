
/* script_FIXED_REPLACEMENT.js
   Versão limpa do JS para menu mobile e comportamento das notas.
   - Garante que o hamburger mostre 3 barras quando fechado e X quando aberto.
   - Fecha o menu ao clicar em qualquer link ou fora do menu.
   - Bloqueia o scroll do body quando o menu estiver aberto (útil no mobile).
   - Compatível com os atributos aria-expanded / aria-hidden usados no CSS.
*/

(function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobileNav');
  if (!menuToggle || !mobileNav) return;

  // Se o botão tiver texto como "☰", substituímos por uma <span> para que
  // o CSS possa desenhar as 3 barras via ::before, span e ::after.
  if (!menuToggle.querySelector('span')) {
    menuToggle.innerHTML = '';
    const s = document.createElement('span');
    menuToggle.appendChild(s);
  }

  // Estado inicial: menu fechado
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
  mobileNav.style.display = 'none';

  // Função para bloquear / desbloquear o scroll do body quando menu aberto
  function setBodyScrollLock(lock) {
    if (lock) {
      // salva valor atual para restaurar (caso queira melhorar futuramente)
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }

  function openMenu() {
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileNav.style.display = 'block';
    setBodyScrollLock(true);
    // coloca foco no primeiro link para acessibilidade
    const primeiro = mobileNav.querySelector('a');
    if (primeiro) primeiro.focus();
  }

  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.style.display = 'none';
    setBodyScrollLock(false);
    // devolve foco ao botão do menu (bom para navegação por teclado)
    menuToggle.focus();
  }

  function toggleMenu() {
    const aberto = menuToggle.getAttribute('aria-expanded') === 'true';
    if (aberto) closeMenu();
    else openMenu();
  }

  // clique no botão abre/fecha o menu (impede propagação)
  menuToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleMenu();
  });

  // fecha ao clicar em qualquer link dentro do menu */
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', function () {
      // se o link aponta para âncora na mesma página, deixamos o comportamento padrão
      // mas garantimos que o menu feche.
      closeMenu();
    });
  });

  // fechar ao clicar fora (protege contra menu invisível ocupando espaço)
  document.addEventListener('click', function (e) {
    // se o clique foi dentro do menu ou no botão, ignora
    if (menuToggle.contains(e.target) || mobileNav.contains(e.target)) return;
    // caso contrário, fecha o menu
    closeMenu();
  });

  // fechar com ESC para melhor acessibilidade
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeMenu();
    }
  });

  // Garantia: quando a página redimensiona (ex.: rota do devtools), se o menu estava
  // aberto e a largura passa para desktop, garantimos fechar / limpar o overflow.
  window.addEventListener('resize', function () {
    const desktopBreakpoint = 900;
    if (window.innerWidth > desktopBreakpoint) {
      closeMenu();
    }
  });

  // Opcional: prevenção de foco em elementos fora do menu quando aberto (simples)
  // (Evita que o usuário navegue por elementos atrás do menu com teclado)
  // Não é um "trap" completo, mas reduz interações indesejadas.
  const allFocusable = 'a, button, input, textarea, select, [tabindex]';
  const outsideFocusable = Array.from(document.querySelectorAll(allFocusable)).filter(el => {
    return !mobileNav.contains(el) && !menuToggle.contains(el);
  });

  function setOutsideTabIndex(disabled) {
    outsideFocusable.forEach(el => {
      if (disabled) {
        // armazenar tabindex atual
        if (!el.hasAttribute('data-old-tabindex')) {
          const cur = el.getAttribute('tabindex');
          el.setAttribute('data-old-tabindex', cur === null ? '' : cur);
        }
        el.setAttribute('tabindex', '-1');
      } else {
        const old = el.getAttribute('data-old-tabindex');
        if (old === '') el.removeAttribute('tabindex');
        else if (old !== null) el.setAttribute('tabindex', old);
        el.removeAttribute('data-old-tabindex');
      }
    });
  }

  // atualiza bloqueio de foco quando abrimos/fechamos
  const originalOpenMenu = openMenu;
  const originalCloseMenu = closeMenu;
  window.openMenu = function() { originalOpenMenu(); setOutsideTabIndex(true); };
  window.closeMenu = function() { originalCloseMenu(); setOutsideTabIndex(false); };

  // trocar as referências internas para usar as novas versões que controlam tabindex
  function toggleMenuWithTrap() {
    const aberto = menuToggle.getAttribute('aria-expanded') === 'true';
    if (aberto) window.closeMenu();
    else window.openMenu();
  }
  // sobrescrever listener para usar nova função
  menuToggle.removeEventListener('click', toggleMenu);
  menuToggle.addEventListener('click', function(e){
    e.stopPropagation();
    toggleMenuWithTrap();
  });

  // garantir que, se houver links dinâmicos inseridos no nav depois do carregamento,
  // eles também fechem o menu ao serem clicados: usar delegação de evento no mobileNav
  mobileNav.addEventListener('click', function (e) {
    const el = e.target.closest('a');
    if (el) {
      // delay mínimo para deixar o link navegar normalmente
      setTimeout(() => closeMenu(), 60);
    }
  });
})();
