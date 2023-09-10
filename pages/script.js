const backArrowButton = document.getElementById('backArrow');
const loader = document.querySelector('.loader');
const mainDiv = document.getElementById('mainDiv');
const errorDiv = document.getElementById('errorMessage');
const searchIcon = document.getElementById('search_button');
const searchBarDiv = document.getElementById('pokedexSearchBarDiv');
const searchBarInput = document.getElementById('pokedexSearchText');
const body = document.body;
let isLoading = false;
let isOnError = false;
let isSearchBarDisplayed = false;
let isInitialLoading = true;
let currentPokemons = [];
//const BASE_API_URL = "http://127.0.0.1:8081";
const BASE_API_URL = "https://thoughtful-girdle-frog.cyclic.app";

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

const createPokemonCardsList = (pokemonArray) => {
  let pokemonsCards = '';
  pokemonArray.forEach(pokemon => {
    pokemonsCards += createCard(pokemon);
  });

  return pokemonsCards;
}

const toggleSearchBarVisibility = () => {
  if(isSearchBarDisplayed) {
    searchBarDiv.style.display = 'none';
    isSearchBarDisplayed = false;
  } else {
    searchBarDiv.style.display = 'block';
    isSearchBarDisplayed = true;
  }
};

const handleEnterKeyPress = () => {
  getPokemonByName(searchBarInput.value);
}

async function getPokemon() {
  if (!isLoading)
    if(!isOnError) {
      try {
        showLoader();
  
        const response = await fetch(`${BASE_API_URL}/api/pokemon?offset=${currentPokemons.length}`);
        const fetchedPokemon = await response.json();
  
        currentPokemons = currentPokemons.concat(fetchedPokemon.spritesArray);
  
        if (currentPokemons) {
          mainDiv.innerHTML = createPokemonCardsList(currentPokemons);
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

async function getPokemonByName(pokemonName) {
  if(!isLoading) {
    if(!isOnError) {
      try {
        showLoader();

        const response = await fetch(`${BASE_API_URL}/api/pokemon/search?name=${pokemonName}`);
        const fetchedPokemon = await response.json();

        currentPokemons = fetchedPokemon.spritesArray;

        if(currentPokemons) {
          mainDiv.innerHTML = createPokemonCardsList(currentPokemons);
        }

      } catch (error) {
        throw new Error(error);
      } finally {
        hideLoader();
      }
    }
  }
};

searchIcon.addEventListener('click', () => {
  toggleSearchBarVisibility();
});

searchBarInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleEnterKeyPress();
  }
});

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

if(isInitialLoading) {
  getPokemon();
  isInitialLoading = false;
}