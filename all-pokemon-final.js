const ALL_POKEMON = [];
const CURR_POKEMON = [];

function clearContainer(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}


function makeElement(elementType, classNames, textContent) {
    const element = document.createElement(elementType);
    if(classNames){
        for(let className of classNames.split(' ')){
            element.classList.add(className);
        }
    }
    element.textContent = textContent;
    return element;
}

function makeNameIDDiv(name, id){
    const nameIdDiv = makeElement('div', 'name-id', '');
    const nameSpan = makeElement('span', '', name.toUpperCase());
    const idSpan = makeElement('span', '', ` #${id}`);
    nameIdDiv.appendChild(nameSpan);
    nameIdDiv.appendChild(idSpan);
    return nameIdDiv;
}

function makeWeightHeightDiv(weight, height){
    const weightHeightDiv = makeElement('div', 'weight-height', '');
    const weightSpan = makeElement('span', '', `Wt: ${weight}`);
    const heightSpan = makeElement('span', '', ` Ht: ${height}`);
    weightHeightDiv.appendChild(weightSpan);
    weightHeightDiv.appendChild(heightSpan);
    return weightHeightDiv;
}

function makeSpriteDiv(spriteURL, spriteName){
    const spriteDiv = makeElement('div', 'sprite', '');
    const sprite = document.createElement('img');
    sprite.src = spriteURL;
    sprite.alt = spriteName;
    spriteDiv.appendChild(sprite);
    return spriteDiv;
}

function makeTypesDiv(types){
    const typesDiv = makeElement('div', 'types', '');
    for(let type of types){
        const typeElement = makeElement('span', `type ${type.type.name}`, type.type.name);
        typesDiv.appendChild(typeElement);
    }
    return typesDiv;
}

/**
 * A function to create a pokemon card for a pokemon
 * @param {Object} pokemonData - The data for the pokemon
 * @returns 
 */
function createPokemonCard(pokemonData){

     //create a pokemon card
     const pokemonCard = document.createElement('div');
     pokemonCard.classList.add('pokemonCard');
 
     //make a title for the card
     const nameIdDiv = makeNameIDDiv(pokemonData.name, pokemonData.id);
 
     //make a div for the weight and height
     const weightHeightDiv = makeWeightHeightDiv(pokemonData.weight, pokemonData.height);
 
     //make a container div for the sprite
     const spriteDiv = makeSpriteDiv(pokemonData.sprites.front_default, pokemonData.name);

     //make a types div
     const typesDiv = makeTypesDiv(pokemonData.types);
 
     //append all the elements to the card
     pokemonCard.appendChild(nameIdDiv);
     pokemonCard.appendChild(weightHeightDiv);
     pokemonCard.appendChild(spriteDiv);
     pokemonCard.appendChild(typesDiv);
 
     return pokemonCard;

}

/**
 * A function to get the pokemon data from the url
 * @param {String} url - the url to get the pokemon data
 * @returns 
 */
async function getPokemonData(url){
    const response = await fetch(url);
    const pokemonData = await response.json();
    return pokemonData;
}

/**
 * A function to look up a specific pokemon's data and make an object with the data
 * @param {Object} pokemon - the pokemon object to get the data for
 * @returns 
 */
async function makePokemonCard(pokemon){

    //get info for one pokemon
    let pokemonData = null;
    try{
        pokemonData = await getPokemonData(pokemon.url);
    }
    catch(error){
        console.log('error', error);
    }
    finally{
        if(pokemonData){
            return pokemonData;
        }
    }
   
}

/**
 * A function to show the pokemon list on the page
 * @param {Array<Object>} pokemonList - an array of pokemon objects
 */
function showPokemonList(pokemonList){
    const pokemonCardContainer = document.querySelector('.pokemonCardContainer');
    clearContainer(pokemonCardContainer);

    for(let pokemon of pokemonList){
        let pokemonCard = createPokemonCard(pokemon);
        pokemonCardContainer.appendChild(pokemonCard);
    }
}

/**
 * A function to make a list of pokemon objects, not displaying them on the page, but getting them from the API
 * @param {Array<Object>} pokemonList - an array of pokemon objects
 * @returns 
 */
async function makePokemonList(pokemonList){
    let pokemonObjects = [];
    for(let i = 0; i < 50; i++){
        let pokemon = pokemonList[i];
        let pokemonData = await makePokemonCard(pokemon);
        pokemonObjects.push(pokemonData);
    }
    return pokemonObjects;
}

/**
 * A function that processes the data from the API and gets data for each pokemon, loading it into ALL_POKEMON and CURR_POKEMON, then displaying the pokemon on the page
 * @param {Object} allPokemonData - the data from the API
 */
async function processPokemonData(allPokemonData){
    const allPokemon = allPokemonData.results;
    console.log('allPokemon', allPokemon);

    //show a loading message
    const pokemonCardContainer = document.querySelector('.pokemonCardContainer');
    clearContainer(pokemonCardContainer);
    const loadingMessage = document.createElement('h2');
    loadingMessage.textContent = 'Loading...';
    pokemonCardContainer.appendChild(loadingMessage);

    //disable the button
    const allPokemonButton = document.getElementById('get-all-button');
    allPokemonButton.disabled = true;

    let pokemon = [];
    try{
        pokemon = await makePokemonList(allPokemon);
    }
    catch(error){
        console.log('error', error);
        allPokemonButton.disabled = true;
    }
    finally{
        clearContainer(pokemonCardContainer);
        allPokemonButton.disabled = false;
        ///disappear the button
        allPokemonButton.style.display = 'none';
    }

    //load the pokemon into the arrays
    ALL_POKEMON.push(...pokemon);
    CURR_POKEMON.push(...ALL_POKEMON);
    //display on the page
    showPokemonList(CURR_POKEMON);
}


/**
 * A function to get all the pokemon from the API
 */
async function getAllPokemon(){

    let allPokemonData = null;
    try{
        const response = await fetch('https://pokeapi-proxy.freecodecamp.rocks/api/pokemon');
        allPokemonData = await response.json();
    }
    catch(error){
        console.log('error', error);
    }
    finally{
        if(allPokemonData){
            processPokemonData(allPokemonData);
        }
    }
}



/**
 * A function to run the program
 */
function runProgram(){
    //get all data button
    const allPokemonButton = document.getElementById('get-all-button');
    allPokemonButton.addEventListener('click', getAllPokemon);
}
document.addEventListener('DOMContentLoaded', runProgram);