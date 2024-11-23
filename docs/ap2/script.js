// script.js
document.getElementById('pokemon-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('pokemon-name').value.toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const pokemonContainer = document.getElementById('pokemon-container');

    if (response.ok) {
        const data = await response.json();

        pokemonContainer.innerHTML = '';
        
        // Cria o card dinamicamente
        const card = document.createElement('div');
        card.classList.add('pokemon-card');

        // Gera HTML com as informações do Pokémon
        card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${data.sprites.front_default}" alt="${data.name}">
                        <h3>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h3>
                        <p><strong>Altura:</strong> ${(data.height / 10).toFixed(1)}m</p>
                        <p><strong>Peso:</strong> ${(data.weight / 10).toFixed(1)}kg</p>
                        <p><strong>Experiência Base:</strong> ${data.base_experience}</p>
                        <p><strong>Tipo:</strong> ${data.types.map(type => type.type.name).join(', ')}</p>
                        <p><strong>Habilidades:</strong> ${data.abilities.map(ability => ability.ability.name).join(', ')}</p>
                        <p><strong>Movimentos:</strong> ${data.moves.slice(0, 3).map(move => move.move.name).join(', ')}...</p>
                        <p><strong>Status:</strong></p>
                        <ul>
                            ${data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="card-back">
                        <img src="imagens/carta-pokemon-traseira.png" alt="Card Back">
                    </div>
                </div>
        `;
        
        // Adiciona o card ao contêiner
        pokemonContainer.appendChild(card);

    } else {
        pokemonContainer.innerHTML = '<p>Pokémon não encontrado</p>';
    }
});
