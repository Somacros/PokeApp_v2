const tabsButtons = document.getElementsByClassName('tab');
const evolutionChainDiv = document.getElementById('evolutionChain');
const movesDiv = document.getElementById('movesDiv');
const pokemonImageDiv = document.getElementById('pokemonImage');
const pokemonDetailsDiv = document.getElementById('mainPokemonDetails');
const mainAppDiv = document.getElementById('mainApp');
const loader = document.querySelector('.loader');
const errorDiv = document.getElementById('errorMessage');
const pokemonSelector = document.getElementById("pokemonSelector");
const movesVersionSelector = document.getElementById('movesVersionSelector');
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
let movesByVersion = {};

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

        setPokemonMovesByGame();
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
            createMovesContent();
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

const setPokemonMovesByGame = () => {
    let versionMoves = {};

    for (let i = 0; i < pokemonInfo.moves.length; i++) {
        const move = pokemonInfo.moves[i];
        const move_name = (move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1)).replaceAll('-', ' ');

        for (let j = 0; j < move.version_group_details.length; j++) {
            const move_details = move.version_group_details[j];
            const move_version = move_details.version_group.name.replaceAll('-', '_');
            const move_way = move_details.move_learn_method.name.replaceAll('-', '_');
            const move_level_at = move_details.level_learned_at;

            if (!versionMoves.hasOwnProperty(move_version)) {
                versionMoves[move_version] = {
                    level_up: [],
                    machine: [],
                    tutor: [],
                    egg: []
                };
            }

            const moveObj = {
                name: move_name,
                level: move_level_at
            };

            versionMoves[move_version][move_way].push(moveObj);
        }
    }

    movesByVersion = versionMoves;
    setMovesByVersionSelector();
}

const setMovesByVersionSelector = () => {
    for (const version in movesByVersion) {
        let option = document.createElement('option');
        option.value = version;
        option.innerHTML = version.replaceAll('_',' ').toUpperCase();
        movesVersionSelector.appendChild(option);
    }
}

const createMovesContent = () => {
    const versionMoves = movesByVersion[movesVersionSelector.value];
    movesDiv.innerHTML = '';

    for (const learnWay in versionMoves) {
        if (Object.hasOwnProperty.call(versionMoves, learnWay)) {
            const movesArray = versionMoves[learnWay];
            const movesTableDiv = createMovesTable(movesArray, learnWay);
            movesDiv.append(movesTableDiv);
        }
    }
}

const createMovesTable = (movesArray, learnWay) => {
    const movement = document.createElement('div');
    movement.classList.add('movesTableDiv');
    movement.classList.add('w-40');

    const tableLabel = document.createElement('h3');
    tableLabel.classList.add('w-100');
    tableLabel.innerHTML = learnWay.replaceAll('_', ' ').toUpperCase();

    movement.appendChild(tableLabel);

    const table = document.createElement('table');
    table.classList.add('movesTable');
    table.classList.add('w-100');

    const thead = document.createElement('thead');
    const theadLevel = document.createElement('th');
    theadLevel.innerText = "Lv.";
    const theadMove = document.createElement('th');
    theadMove.innerText = "Move";

    thead.appendChild(theadLevel);
    thead.appendChild(theadMove);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    if(learnWay == 'level_up') {
        movesArray.sort((prev, next) => prev.level - next.level);
    }

    for (let i = 0; i < movesArray.length; i++) {
        const move = movesArray[i];
        const tableTr = document.createElement('tr');
        const tdLevel = document.createElement('td');
        tdLevel.innerHTML = move.level;

        const tdName = document.createElement('td');
        tdName.innerHTML = move.name;

        tableTr.appendChild(tdLevel);
        tableTr.appendChild(tdName);
        tbody.appendChild(tableTr);
    }

    table.appendChild(tbody);
    movement.appendChild(table);

    return movement;
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
    heightText.textContent = `${(pokemonInfo.height / 10).toFixed(2)} m`;
    weightText.textContent = `${(pokemonInfo.weight / 10).toFixed(2)} kg`
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
        setTimeout(() => {
            statFillBar.style.width = `${fillPercentage}%`;
        }, 100);
    });
};

pokemonSelector.addEventListener("change", function () {
    updateFlavorText();
});

movesVersionSelector.addEventListener("change", function(e) {
    createMovesContent();
})

restartButtons();
fetchAllInformation();