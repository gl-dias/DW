// Seletores globais
const pokemonContainer = document.getElementById('pokemon-container');
const pokemonForm = document.getElementById('pokemon-form');
const regionButtons = document.querySelectorAll('#region-buttons button');

// Função para carregar Pokémon de todas as regiões sequencialmente
async function loadAllPokemons() {
    pokemonContainer.innerHTML = `<p>Carregando Pokémon de todas as regiões...</p>`;

    const regionIds = [2, 3, 4, 5, 8, 12, 16]; // IDs das regiões
    
    try {
        pokemonContainer.innerHTML = ''; 

        for (const regionId of regionIds) {
            await new Promise(resolve => {
                setTimeout(async () => {
                    await loadPokemonByRegion(regionId);
                    resolve();
                }, 500)
            });
        }
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
        const pokemonEntries = regionData.pokemon_entries.slice(0, 20);

        const pokemonPromises = pokemonEntries.map(async (entry) => {
            const pokemonDetails = await fetch(entry.pokemon_species.url.replace('-species', ''))
                .then((res) => res.json());
            return pokemonDetails;
        });

        const regionPokemon = await Promise.all(pokemonPromises);
        
        regionPokemon.forEach((data) => {
            createPokemonCard(data);
        });

        return regionPokemon;
    } catch (error) {
        console.error(`Erro ao carregar Pokémons da região ${regionId}:`, error);
        return [];
    }
}

// Função para criar um card de Pokémon
function createPokemonCard(data) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <img src="${data.sprites.front_default}" alt="${data.name}" class="pokemon-image">
                <h3>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h3>
                <p><strong>Tipo:</strong> ${data.types.map(type => type.type.name).join(', ')}</p>
                <p><strong>Altura:</strong> ${(data.height / 10).toFixed(1)}m</p>
                <p><strong>Peso:</strong> ${(data.weight / 10).toFixed(1)}kg</p>
                <p><strong>Experiência Base:</strong> ${data.base_experience}</p>
            </div>
            <div class="card-back">
                <img src="imagens/carta-pokemon-traseira.png" alt="Card Back">
            </div>
        </div>
    `;

    // Adiciona evento de clique para abrir o modal
    card.addEventListener('click', () => {
        createPokemonModal(data);
    });

    pokemonContainer.appendChild(card);
}

// Função para criar o modal com detalhes do Pokémon
function createPokemonModal(data) {
    const modal = document.createElement('div');
    modal.classList.add('pokemon-modal');
    
    const types = data.types.map(type => 
        `<span class="pokemon-type ${type.type.name}">${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</span>`
    ).join(' ');

    const abilities = data.abilities.map(ability => 
        ability.ability.name.replace('-', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
    ).join(', ');

    const moves = data.moves.slice(0, 5).map(move => 
        move.move.name.replace('-', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
    ).join(', ');

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <img id="pokemon-image" src="${data.sprites.front_default}" alt="${data.name}">
                <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
                <div class="pokemon-types">${types}</div>
            </div>
            <div class="modal-body">
                <div class="pokemon-details">
                    <h3>Detalhes Básicos</h3>
                    <p><strong>Altura:</strong> ${(data.height / 10).toFixed(1)} m</p>
                    <p><strong>Peso:</strong> ${(data.weight / 10).toFixed(1)} kg</p>
                    <p><strong>Experiência Base:</strong> ${data.base_experience}</p>
                </div>
                
                <div class="pokemon-abilities">
                    <h3>Habilidades</h3>
                    <p>${abilities}</p>
                </div>
                
                <div class="pokemon-moves">
                    <h3>Movimentos Principais</h3>
                    <p>${moves}</p>
                </div>
                
                <div class="pokemon-stats">
                    <h3>Estatísticas</h3>
                    <ul>
                        ${data.stats.map(stat => `  
                            <li>
                                <strong>${stat.stat.name.replace('-', ' ').split(' ').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}:</strong> 
                                ${stat.base_stat}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Função para alternar a imagem do Pokémon entre shiny e normal
    const pokemonImage = modal.querySelector('#pokemon-image');
    let isShiny = false; // Variável para verificar o estado da imagem (shiny ou normal)

    pokemonImage.addEventListener('click', () => {
        // Alterna a imagem entre normal e shiny
        if (isShiny) {
            pokemonImage.src = data.sprites.front_default; // Imagem normal
        } else {
            pokemonImage.src = data.sprites.front_shiny || data.sprites.front_default; // Imagem shiny (ou normal se não houver shiny)
        }
        isShiny = !isShiny; // Alterna o estado
    });
}

// Função para buscar Pokémon pelo nome
pokemonForm.addEventListener('submit', async (event) => {
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

// Função para buscar Pokémon pelo numero da pokedex
pokemonForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const type = document.getElementById('pokemon-name').value.toLowerCase();  // Aqui, seria bom ter um campo específico para o tipo de Pokémon

    try {
        // Fazendo a requisição para o tipo especificado
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);

        if (response.ok) {
            const data = await response.json();
            pokemonContainer.innerHTML = ''; // Limpa o contêiner

            // Acessa a lista de Pokémon do tipo específico
            const pokemonList = data.pokemon.slice(0, 10); // Limita a 20 Pokémon, você pode ajustar esse número

            // Cria o card para cada Pokémon
            pokemonList.forEach(pokemon => {
                fetch(pokemon.pokemon.url)
                    .then(res => res.json())
                    .then(pokemonData => {
                        createPokemonCard(pokemonData); // Cria o card do Pokémon
                    })
                    .catch(err => {
                        console.error("Erro ao buscar Pokémon detalhado", err);
                    });
            });
        } else {
            pokemonContainer.innerHTML = '<p>Tipo não encontrado</p>';
        }
    } catch (error) {
        pokemonContainer.innerHTML = '<p>Erro ao buscar Pokémon</p>';
        console.error(error);
    }
});

// Evento para botões de região
regionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const regionId = button.getAttribute('data-region-id');
        pokemonContainer.innerHTML = ''; // Limpa o contêiner
        loadPokemonByRegion(regionId);
    });
});

// Carrega Pokémons de todas as regiões ao inicializar a página
document.addEventListener('DOMContentLoaded', loadAllPokemons);
