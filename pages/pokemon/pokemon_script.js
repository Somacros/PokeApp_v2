const tabsButtons = document.getElementsByClassName('tab');
const evolutionChainDiv = document.getElementById('evolutionChain');
const pokemonImageDiv = document.getElementById('pokemonImage');
const pokemonDetailsDiv = document.getElementById('mainPokemonDetails');
const mainAppDiv = document.getElementById('mainApp');
const loader = document.querySelector('.loader');
const errorDiv = document.getElementById('errorMessage');
const pokemonSelector = document.getElementById("pokemonSelector");
const pokemonInfoParagraph = document.getElementById("pokemonInfo");
const fillElement = document.querySelector('.fill');

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
const baseStats = {
    minValue: 4,
    maxValue: 255
};

let pokemonInfo = {};

function getQueryParameters() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams;
}

const backPokedex = () => {
    window.location.href = '../pokedex.html'
}

function changePokemonInformation(pokemonName) {
    window.location.href = `./pokemon.html?pokemonName=${pokemonName}`;
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

        console.log(pokemonInfo);

        setPokemonDetails();
        setPokemonImage();
        openTab('about', tabsButtons[0]);
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

    switch (tabName) {
        case 'about':
            setAboutPage();
            break;
        case 'basestats':
            setBaseStats();
            break;
        case 'evolution':
            createEvolutionRows();
            break;
        case 'moves':
            console.log('Holis');
            break;
        default:
            break;
    }
};

const createEvolutionRows = () => {
    if (pokemonInfo && pokemonInfo.evolution_chain && pokemonInfo.evolution_chain.length) {

        evolutionChainDiv.innerHTML = '';

        pokemonInfo.evolution_chain.forEach(evolution => {

            const localEvoChainDiv = document.createElement('div');
            localEvoChainDiv.classList.add('evolutionItem');
            localEvoChainDiv.classList.add('flex');
            localEvoChainDiv.classList.add('space-around');
            localEvoChainDiv.classList.add('px-5');
            localEvoChainDiv.classList.add('align-center');
            localEvoChainDiv.classList.add('mt-30');

            const previousPokemon = { 
                name: evolution.previous_name,
                drawing: evolution.previous_drawing
            };

            const nextPokemon = {
                name: evolution.evolve_name,
                drawing: evolution.evolve_drawing
            };

            const previousPokemonDiv = createEvolutionCard(previousPokemon);
            const nextPokemonDiv = createEvolutionCard(nextPokemon);

            const levelText = document.createElement('p')
            levelText.classList.add('w-20');
            levelText.classList.add('fs-5');
            levelText.classList.add('bold');
            levelText.classList.add('gray');
            levelText.classList.add('align-center');
            levelText.innerHTML = `&rarr;<br>LV.${evolution.min_level}`

            localEvoChainDiv.appendChild(previousPokemonDiv);
            localEvoChainDiv.appendChild(levelText);
            localEvoChainDiv.appendChild(nextPokemonDiv);

            evolutionChainDiv.appendChild(localEvoChainDiv);
        });
    }
};

const createEvolutionCard = (evolution) => {
    const pokemonDiv = document.createElement('div');
    pokemonDiv.classList.add('w-40');
    pokemonDiv.classList.add('pointer');

    const pokemonIMG = document.createElement('img');
    pokemonIMG.src = evolution.drawing;
    pokemonIMG.alt = evolution.name;
    pokemonIMG.classList.add('w-100')

    const pokemonName = document.createElement('p');
    pokemonName.innerText = evolution.name;
    pokemonName.classList.add('fs-5');
    pokemonName.classList.add('gray');

    pokemonDiv.addEventListener('click', () => {
        changePokemonInformation(evolution.name.toLowerCase());
    });

    pokemonDiv.appendChild(pokemonIMG);
    pokemonDiv.appendChild(pokemonName);

    return pokemonDiv;
}

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

const setPokemonFlavorTexts = () => {
    const flavorTextsArray = pokemonInfo.flavor_text_entries;

    for (let i = 0; i < flavorTextsArray.length; i++) {
        const flavorText = flavorTextsArray[i];

        let option = document.createElement('option');
        option.value = flavorText.version.name;
        option.innerHTML = flavorText.version.name.toUpperCase();

        pokemonSelector.appendChild(option);
    };

    updateFlavorText();
};

const updateFlavorText = () => {
    const selectedVersion = pokemonSelector.value;
    const info = pokemonInfo.flavor_text_entries.find(flavor => {
        return flavor.version.name == selectedVersion;
    });

    pokemonInfoParagraph.textContent = info.flavor_text;
}

const setHeightWeight = () => {
    const heightText = document.getElementById('heightText');
    const weightText = document.getElementById('weightText');
    heightText.textContent = `${(pokemonInfo.height/10).toFixed(2)} m`;
    weightText.textContent = `${(pokemonInfo.weight/10).toFixed(2)} kg`
};

const setAboutPage = () => {
    setPokemonFlavorTexts();
    setHeightWeight();
}

const getFillPercentage = (currentValue) => {
    const {
        minValue,
        maxValue
    } = baseStats;
    return ((currentValue - minValue) / (maxValue - minValue)) * 100;
};

const setBaseStats = () => {
    const {
        stats,
        ...rest
    } = pokemonInfo;

    stats.forEach(stat => {
        const statFillBar = document.getElementById(`${stat.stat.name}_stat`);
        const fillPercentage = getFillPercentage(stat.base_stat);

        statFillBar.style.width = `0%`;
        statFillBar.textContent = stat.base_stat;
        setTimeout(()=> {
            statFillBar.style.width = `${fillPercentage}%`;
        }, 100);
    });
};

pokemonSelector.addEventListener("change", function () {
    updateFlavorText();
});

restartButtons();
fetchAllInformation();