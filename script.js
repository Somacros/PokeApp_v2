const baseURL = 'localhost:3000/'
const pokedexNavButton = document.getElementById('pokedex');

const changeUrl = (newUrl) => {
    window.location.href = newUrl;
};




pokedexNavButton.addEventListener('click', () => {
    changeUrl('pages/pokedex.html');
});