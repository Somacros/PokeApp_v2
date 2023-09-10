const backArrowButton = document.getElementById('backArrow');
const loader = document.querySelector('.loader');
const mainDiv = document.getElementById('mainDiv');
const errorDiv = document.getElementById('errorMessage');
const body = document.body;
let isLoading = false;
let isOnError = false;
let currentPokemons = [];
const BASE_URL_AWS = "http://18.222.115.247";

function backHome () {
  window.location.href = '../index.html';
}

const createCard = (pokemon) => {
  const card = `
        <article class="pokemon flex p-10 space-between white pointer bg-${getPrimaryType(pokemon.types)}">
            <div>
                <h3>${pokemon.name}</h3>
                ${createTypes(pokemon.types)}
            </div>
            <div class="w-30 pokemonImage">
                <img class="w-100" src="${pokemon.draw}" alt="${pokemon.name}_image">
            </div>
        </article>
    `;

  return card;
};

const createTypes = (pokemonTypes) => {
  let pokemonTypesAsHTML = '';

  pokemonTypes.forEach(({
    type,
    slot
  }) => {
    pokemonTypesAsHTML += `
            <p>${type.name.toUpperCase()}</p>
        `;
  });

  return pokemonTypesAsHTML;
}

const getPrimaryType = (pokemonTypes) => {
  return pokemonTypes[0].type.name;
}

async function getPokemon() {
  if (!isLoading)
    if(!isOnError) {
      try {
        showLoader();
  
        const response = await fetch(`${BASE_URL_AWS}/api/pokemon?offset=${currentPokemons.length}`);
        const fetchedPokemon = await response.json();
        let pokemonsCards = '';
  
        currentPokemons = currentPokemons.concat(fetchedPokemon.spritesArray);
  
        if (currentPokemons) {
          currentPokemons.forEach(pokemon => {
            pokemonsCards += createCard(pokemon);
          });
  
          mainDiv.innerHTML = pokemonsCards;
        }
      } catch (error) {
        showError();
        throw new Error('Error while fetching from PokemonApi:', error);
      } finally {
        hideLoader();
      }
    } else {
      showError();
    }
}

function showLoader() {
  isLoading = true;
  loader.style.display = 'block';
  body.style.overflow = 'hidden'; // Disable scrolling
}

function hideLoader() {
  isLoading = false;
  loader.style.display = 'none';
  body.style.overflow = 'auto'; // Enable scrolling
}

function showError() {
  isOnError = true;
  errorDiv.style.display = 'block';
  body.style.overflow = 'hidden';
}

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY || window.pageYOffset;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Define a threshold to start loading more items
  const scrollThreshold = 200;

  if (documentHeight - scrollY - windowHeight < scrollThreshold) {
    getPokemon();
  }
});

getPokemon();