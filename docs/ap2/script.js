// Seletores globais
const pokemonContainer = document.getElementById('pokemon-container');

// Função para carregar Pokémon de todas as regiões
async function loadAllPokemons() {
    pokemonContainer.innerHTML = `<p>Carregando Pokémon de todas as regiões...</p>`;

    // IDs das regiões para buscar Pokémon
    const regionIds = [2, 3, 4, 5, 8, 12, 16]; // IDs das regiões
    const allPokemonPromises = regionIds.map(regionId => loadPokemonByRegion(regionId));
    
    try {
        // Carregar todos os Pokémons de todas as regiões
        const allPokemon = await Promise.all(allPokemonPromises);
        pokemonContainer.innerHTML = ''; // Limpa o contêiner

        // Exibir todos os Pokémons
        allPokemon.forEach((regionPokemon) => {
            regionPokemon.forEach((data) => createPokemonCard(data));
        });
    } catch (error) {
        pokemonContainer.innerHTML = '<p>Erro ao carregar os Pokémons de todas as regiões</p>';
        console.error(error);
    }
}

// Função para carregar Pokémon de uma região específica
async function loadPokemonByRegion(regionId) {
    try {
        const regionResponse = await fetch(`https://pokeapi.co/api/v2/pokedex/${regionId}`);
        const regionData = await regionResponse.json();
        const pokemonEntries = regionData.pokemon_entries;

        const pokemonPromises = pokemonEntries.map(async (entry) => {
            const pokemonDetails = await fetch(entry.pokemon_species.url.replace('-species', ''))
                .then((res) => res.json());
            return pokemonDetails;
        });

        return await Promise.all(pokemonPromises);
    } catch (error) {
        console.error(`Erro ao carregar Pokémon da região ${regionId}`, error);
        return []; // Retorna uma lista vazia em caso de erro
    }
}

// Função para criar um card de Pokémon
function createPokemonCard(data) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

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

    pokemonContainer.appendChild(card);
}

// Função para buscar Pokémon pelo nome
document.getElementById('pokemon-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('pokemon-name').value.toLowerCase();

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

        if (response.ok) {
            const data = await response.json();
            pokemonContainer.innerHTML = ''; // Limpa o contêiner
            createPokemonCard(data); // Cria o card do Pokémon
        } else {
            pokemonContainer.innerHTML = '<p>Pokémon não encontrado</p>';
        }
    } catch (error) {
        pokemonContainer.innerHTML = '<p>Erro ao buscar Pokémon</p>';
        console.error(error);
    }
});

// Inicializa a página carregando todos os Pokémons de todas as regiões
document.addEventListener('DOMContentLoaded', () => {
    loadAllPokemons(); // Carrega Pokémons de todas as regiões
});
