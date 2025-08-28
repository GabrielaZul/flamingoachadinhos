fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQIkQKdVnLm-MQbJVymtqlV7IGWoFQNxYtagebaNkC_ygx7A6SDJqdixjqwQEDWoCEu4jDCAd22zHKl/pub?gid=0&single=true&output=csv')
  .then(res => res.text())
  .then(csvText => {
    const resultado = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    });

    // Filtra produtos ativos
    const produtos = resultado.data.filter(p => p.Ativo?.toLowerCase() === 'sim');

    // Pega categorias únicas
    const categorias = [...new Set(produtos.map(p => p.Categoria))];

    renderizarFiltros(categorias);
    renderizarProdutos(produtos);

    document.querySelectorAll('.filter-button').forEach(button => {
      button.addEventListener('click', () => {
        const categoria = button.dataset.categoria;
        const filtrados = categoria === 'todos' ? produtos : produtos.filter(p => p.Categoria === categoria);
        renderizarProdutos(filtrados);
      });
    });
  });

function renderizarFiltros(categorias) {
  const container = document.getElementById('filters');
  container.innerHTML = `<button class="filter-button" data-categoria="todos">Todos</button>`;
  categorias.forEach(cat => {
    container.innerHTML += `<button class="filter-button" data-categoria="${cat}">${cat}</button>`;
  });
}

function renderizarProdutos(produtos) {
  const container = document.getElementById('produtos-container');
  container.innerHTML = '';

  produtos.forEach(produto => {
    const { Imagem, Descricao, Link } = produto;
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.innerHTML = `
      <img src="${Imagem}" alt="${Descricao}" />
      <p>${Descricao}</p>
      <a class="botao" href="${Link}" target="_blank">Ver Oferta</a>
    `;
    container.appendChild(card);
  });
}