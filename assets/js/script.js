document.addEventListener('DOMContentLoaded', function() {
    fetch('includes/header.html')
      .then(response => response.text())
      .then(data => {
        document.querySelector('#header').innerHTML = data;
        const menuButton = document.querySelector('#menu-button');
        const menuDropdown = document.querySelector('#menu-dropdown');
        menuButton.addEventListener('click', () => {
          menuDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (event) => {
          if (!menuButton.contains(event.target) && !menuDropdown.contains(event.target)) {
            menuDropdown.classList.add('hidden');
          }
        });
      });
  
    fetch('includes/footer.html')
      .then(response => response.text())
      .then(data => {
        document.querySelector('#footer').innerHTML = data;
      });
  
    const saibaMaisButton = document.querySelector('#saiba-mais-button');
    if (saibaMaisButton) {
      saibaMaisButton.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#sobre').scrollIntoView({ behavior: 'smooth' });
      });
    }
  
    const form = document.querySelector('#cadastro-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = document.querySelector('#data').value;
        const embarque = document.querySelector('#embarque').value;
        const desembarque = document.querySelector('#desembarque').value;
        const lixoColetado = document.querySelector('#lixo-coletado').value;
  
        if (data && embarque && desembarque && lixoColetado) {
          let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
          viagens.push({ data, embarque, desembarque, lixoColetado: Number(lixoColetado) });
          localStorage.setItem('viagens', JSON.stringify(viagens));
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Viagem cadastrada com sucesso!',
            showConfirmButton: false,
            timer: 1000,
            background: '#2d3748',
            color: '#edf2f7'
          });
          form.reset();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Atenção',
            text: 'Por favor, preencha todos os campos.',
            showConfirmButton: false,
            timer: 1000,
            background: '#2d3748',
            color: '#2d3748'
          });
        }
      });
    }
  
    const searchInput = document.querySelector('#search');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
        const filteredViagens = viagens.filter(viagem =>
          formatDate(viagem.data).includes(query) ||
          viagem.embarque.toLowerCase().includes(query) ||
          viagem.desembarque.toLowerCase().includes(query) ||
          String(viagem.lixoColetado).toLowerCase().includes(query)
        );
        renderViagens(filteredViagens);
      });
    }
  
    const viagensList = document.querySelector('#viagens-list');
    if (viagensList) {
      const viagens = JSON.parse(localStorage.getItem('viagens')) || [];
      renderViagens(viagens);
    }
  
    const totalViagensElement = document.querySelector('#total-viagens');
    const totalLixoElement = document.querySelector('#total-lixo');
    if (totalViagensElement && totalLixoElement) {
      const viagens = JSON.parse(localStorage.getItem('viagens')) || [];
      const totalLixo = viagens.reduce((total, viagem) => total + viagem.lixoColetado, 0);
      totalViagensElement.textContent = viagens.length;
      totalLixoElement.textContent = `${totalLixo} kg`;
    }
  });
  
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  function renderViagens(viagens) {
    const viagensList = document.querySelector('#viagens-list');
    viagensList.innerHTML = '';
    viagens.forEach((viagem, index) => {
      const viagemDiv = document.createElement('div');
      viagemDiv.classList.add('mb-4', 'p-4', 'border', 'rounded', 'bg-gray-100');
      viagemDiv.innerHTML = `
        <p><strong>Data:</strong> ${formatDate(viagem.data)}</p>
        <p><strong>Porto de Embarque:</strong> ${viagem.embarque}</p>
        <p><strong>Porto de Desembarque:</strong> ${viagem.desembarque}</p>
        <p><strong>Quantidade de Lixo Coletado:</strong> ${viagem.lixoColetado} kg</p>
        <button onclick="deleteViagem(${index})" class="px-4 py-1 text-red-600 font-semibold rounded-full border border-red-600 hover:text-white hover:bg-red-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 mt-2">
          Excluir
        </button>
      `;
      viagensList.appendChild(viagemDiv);
    });
  }
  
  function deleteViagem(index) {
    let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
    viagens.splice(index, 1);
    localStorage.setItem('viagens', JSON.stringify(viagens));
    renderViagens(viagens);
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Viagem excluída com sucesso!',
      showConfirmButton: false,
      timer: 1500,
      background: '#2d3748',
      color: '#edf2f7'
    });
  }
  