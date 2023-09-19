const tabsButtons = document.getElementsByClassName('tab');
const evolutionChainDiv = document.getElementById('evolutionChain');
const pokemonImageDiv = document.getElementById('pokemonImage');
const pokemonDetailsDiv = document.getElementById('mainPokemonDetails');
const mainAppDiv = document.getElementById('mainApp');
const loader = document.querySelector('.loader');
const errorDiv = document.getElementById('errorMessage');

const body = document.body;

const params = getQueryParameters();
const pokemonName = params.get('pokemonName');

//const BASE_API_URL = "http://127.0.0.1:8081";
const BASE_API_URL = "https://thoughtful-girdle-frog.cyclic.app";
const full_info_url = `${BASE_API_URL}/api/pokemon/full?pokemonName=${pokemonName}`;
const currentURL = window.location.href;
const urlParts = currentURL.split('/');
const pokemonId = urlParts[urlParts.length - 1];
let isLoading = false;

let pokemonInfo = {};

function getQueryParameters() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams;
}

const backPokedex = () => {
    window.location.href = '../pokedex.html'
}

const getPrimaryType = (pokemonTypes) => {
    return pokemonTypes[0].type.name;
};

const fetchAllInformation = async () => {
    try {
        showLoader();
        const response = await fetch(full_info_url);
        const data = await response.json();
        pokemonInfo = data.pokemonData;

        console.log(pokemonInfo)

        createEvolutionRows();
        setPokemonDetails();
        setPokemonImage();
    } catch (error) {
        showError();
    } finally {
        hideLoader();
    }

}

const restartButtons = () => {
    for (const tabButton of tabsButtons) {
        tabButton.classList.remove('selected');
    };
};

function openTab(tabName, tabDiv) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (const content of tabContents) {
        content.style.display = "none";
    }

    restartButtons();

    tabDiv.classList.add('selected');

    document.getElementById(tabName).style.display = "block";
};

const createEvolutionRows = () => {
    if (pokemonInfo && pokemonInfo.evolution_chain && pokemonInfo.evolution_chain.length) {
        let evolutionRowsHTML = '';

        pokemonInfo.evolution_chain.forEach(evolution => {
            evolutionRowsHTML += `
            <div class='flex space-around px-5 align-center mt-30'>
                <img src="${evolution.previous_drawing}" alt="${evolution.previous_name}_sprite" class="w-30">
                <p class="w-20">&rarr;<br>LV.${evolution.min_level}</p>
                <img src="${evolution.evolve_drawing}" alt="${evolution.evolve_name}_sprite" class="w-30">
            </div>
            `;
        });

        if (evolutionRowsHTML) {
            evolutionChainDiv.innerHTML = evolutionRowsHTML;
        }
    }
};

const setPokemonImage = () => {
    let pokemonImageHTML = `
    <img id="pokemonDetailsImage" src="${pokemonInfo.draw}" alt="${pokemonInfo.name}_image">
    `;

    pokemonImageDiv.innerHTML = pokemonImageHTML;
};

const setPokemonDetails = () => {
    const formattedName = pokemonInfo.name.charAt(0).toUpperCase() + pokemonInfo.name.slice(1);
    let pokemonDetailsHTML = `
    <div class="w-40 flex wrap text-center">
        <h2 class="w-100" id="pokemonName">${formattedName}</h2>
        <div class="flex w-100 space-around">
            ${createTypes(pokemonInfo.types)}
        </div>
    </div>
    <div class="w-20">
        <p id="pokemonNumber">#${pokemonInfo.id}</p>
    </div>
    `;

    pokemonDetailsDiv.innerHTML = pokemonDetailsHTML;

    mainAppDiv.classList.add(`bg-${getPrimaryType(pokemonInfo.types)}`);
};

const createTypes = (pokemonTypes) => {
    let pokemonTypesAsHTML = '';

    pokemonTypes.forEach(({
        type,
        slot
    }) => {
        pokemonTypesAsHTML += `
              <p class="pokemonType">${type.name.toUpperCase()}</p>
          `;
    });

    return pokemonTypesAsHTML;
};

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

restartButtons();
openTab('about', tabsButtons[0]);
fetchAllInformation();