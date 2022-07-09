const blackBox = document.querySelector('#black-box');

const pokemonUrl = (id) => `https://pokeapi.co/api/v2/pokemon/${id}/`;

const fetchPokemon = async (id, templateId) => {
    let data = await fetch(pokemonUrl(id));
    let pokemonObject = getPokemonObject(await data.json());
    let htmlText = applyTemplate(pokemonObject, templateId);
    return makeElementFromText(htmlText);
}

const getPokemonObject = (pokemon) => {
    return {
        "id": pokemon.id,
        "name": pokemon.name,
        "type": pokemon.types[0].type.name,
        "types": pokemon.types.map(tp => tp.type.name).join(' | '),
        "moves": pokemon.moves.map(mv => mv.move.name).join(', '),
        "game_indices": pokemon.game_indices.map(gm => gm.version.name).join(', ')
    };
}

const applyTemplate = (object, templateId) => {
    let text = document.querySelector(templateId).innerHTML;
    let keys = Object.keys(object);
    return keys.reduce((tmp, key) => tmp.replaceAll(`\${${key}}`, object[key]), text);
}

const makeElementFromText = (text) => {
    let parser = new DOMParser();
    let data = parser.parseFromString(text, 'text/html');
    return data.body.firstChild;
}

const toggleBlackBox = () => {
    blackBox.classList.toggle('off');
    blackBox.classList.toggle('on');
}

const showDetail = async (id) => {
    let detail = await fetchPokemon(id, '#details-template');
    blackBox.innerHTML = '';
    blackBox.appendChild(detail);
    let closeBtn = document.querySelector('#close-btn');
    closeBtn.addEventListener('click', toggleBlackBox);
    toggleBlackBox();
}

document.addEventListener('DOMContentLoaded', async () => {
    let cardContainer = document.querySelector('#card-container');
    cardContainer.innerHTML = '';
    for (let i = 1; i <= 151; i++) {
        let card = await fetchPokemon(i, '#card-template');
        card.addEventListener('click', async () => {
            await showDetail(card.id);
        });
        cardContainer.appendChild(card);
    }
});