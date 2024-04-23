/**
 * A function to make span elements for the specific 'types' of a pokemon
 * @param {Array} pokemonTypes - an array of pokemon types
 */
function makePokemonTypes(pokemonTypes){
    const pokemonTypesSpan = document.querySelector('#types');
    clearContainer(pokemonTypesSpan);

    for(let type of pokemonTypes){
        const typeElement = document.createElement('span');
        typeElement.textContent = type.type.name;
        typeElement.classList.add('type');
        typeElement.classList.add(type.type.name);
        pokemonTypesSpan.appendChild(typeElement);
    }
}

/**
 * A function to set the basic info for the pokemon
 * @param {Object} pokemonData - the data for the pokemon
 */
function setBasicInfo(pokemonData){
    const pokemonName = document.querySelector('#pokemon-name');
    pokemonName.textContent = pokemonData.name.toUpperCase();

    const pokemonImage = document.querySelector('#sprite');
    pokemonImage.src = pokemonData.sprites.front_default;
    pokemonImage.alt = pokemonData.name;

    const pokemonID = document.querySelector('#pokemon-id');
    pokemonID.textContent = `#${pokemonData.id}`;

    const pokemonWeight = document.querySelector('#weight');
    pokemonWeight.textContent = `Weight: ${pokemonData.weight}`;

    const pokemonHeight = document.querySelector('#height');
    pokemonHeight.textContent = `Height: ${pokemonData.height}`;
}

/**
 * 
 * @param {Array} stats - an array of stats for a pokemon
 * @param {String} statName - the name of the stat to get
 * @returns {Number} - the value of the stat
 */
function getStatForStatName(stats, statName){
    let desiredStat = -1;
    for(let stat of stats){
        if(stat.stat.name === statName){
            desiredStat = stat.base_stat;
        }
    }
    return desiredStat;
}

/** 
 * A function to set the stats for a pokemon
 * @param {Array} stats - an array of stats for a pokemon
*/
function setStats(stats){
    const statsSpans = document.querySelectorAll('.pokemon-stats');
    console.log(statsSpans);

    for(let statsSpan of statsSpans){
        //get the name of the stat from the id of the span
        const statName = statsSpan.id;
        //get the desired stat from the stats array using the stat name
        const desiredStat = getStatForStatName(stats, statName);
        statsSpan.textContent = desiredStat;

    }
}

/**
 * A function to display the pokemon data
 * @param {Object} pokemonData - the data for the pokemon
 */
function displayPokemon(pokemonData){
    //set the elements
    setBasicInfo(pokemonData);
    //set types
    makePokemonTypes(pokemonData.types);
    //get stats
    setStats(pokemonData.stats);
}

/**
 * 
 * @param {Element} container - the container to clear
 */
function clearContainer(container){
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
}

/**
 * A function to clear the pokemon data
 */
function clearPokemonData(){
    const pokemonName = document.querySelector('#pokemon-name');
    const pokemonImage = document.querySelector('#sprite');
    const pokemonID = document.querySelector('#pokemon-id');
    const pokemonWeight = document.querySelector('#weight');
    const pokemonHeight = document.querySelector('#height');
    const pokemonTypesSpan = document.querySelector('#types');
    const statsSpans = document.querySelectorAll('.pokemon-stats');

    pokemonName.textContent = '';
    pokemonImage.src = '';
    pokemonImage.alt = '';
    pokemonID.textContent = '';
    pokemonWeight.textContent = '';
    pokemonHeight.textContent = '';

    for(let statsSpan of statsSpans){
        if(statsSpan.id){
            statsSpan.textContent = '';
        }
    }
    //clear pokemon types container
    clearContainer(pokemonTypesSpan);
}


/**
 * A function to show the pokemon
 */
async function showPokemon(){
    //get the search-input
    const searchInput = document.querySelector('#search-input');
    const searchValue = searchInput.value;

    //fetch the pokemon
    const apiURL = `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${searchValue}`;

    //try to get the pokemon data
    let pokemonData = null;
    try {
        const response = await fetch(apiURL);
        pokemonData = await response.json();
        console.log(pokemonData);
    }
    catch(error) {
        //if there was an error, alert the user and clear the pokemon data
        console.log('error', error);
        alert('Pokemon not found');
        clearPokemonData();
    }
    //display the pokemon
    if(pokemonData !== null){
        displayPokemon(pokemonData);
    }
}

/**
 * A function to run the program
 */
function runProgram(){

    console.log('runProgram');
    //get the button and add an event listener
    const searchButton = document.querySelector('#search-button');
    searchButton.addEventListener('click', showPokemon);

}
document.addEventListener('DOMContentLoaded', runProgram);