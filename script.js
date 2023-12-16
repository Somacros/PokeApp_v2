const BASE_API_URL = "https://thoughtful-girdle-frog.cyclic.app";
const pokedexNavButton = document.getElementById('pokedex');
const newsContainer = document.getElementById('newsContainer');

const changeUrl = (newUrl) => {
  window.location.href = newUrl;
};

pokedexNavButton.addEventListener('click', () => {
  changeUrl('pages/pokedex.html');
});

async function getNews() {
  try {
    debugger;
    const data = await fetch(`${BASE_API_URL}/api/news`);

    if (data.status != 200) {
      throw new Error('Error while fetching news');
    }

    const news = await data.json();

    const { articles } = news;

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];

      createArticleDiv(article);
    }

  } catch (error) {
    alert(error);
  }

}

const createArticleDiv = (article) => {
  const articleDiv = document.createElement('article');
  articleDiv.classList.add('flex');
  articleDiv.classList.add('space-around');
  articleDiv.classList.add('separator');
  articleDiv.classList.add('s-block');
  articleDiv.classList.add('card');
  articleDiv.classList.add('p-20')

  const mainContent = document.createElement('div');
  mainContent.classList.add('w-40');
  mainContent.classList.add('s-w-100');
  mainContent.classList.add('mt-20');

  const articleTitle = document.createElement('a');
  articleTitle.innerHTML = article.title;

  articleTitle.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(article.url, '_blank');
  })

  const inputDate = new Date(article.publishedAt);
  const day = inputDate.getUTCDate();
  const month = inputDate.getUTCMonth() + 1;
  const year = inputDate.getUTCFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const articleDate = document.createElement('p');
  articleDate.classList.add('gray');
  articleDate.classList.add('f-s');
  articleDate.innerHTML = formattedDate;

  const preview = document.createElement('p');
  preview.classList.add('gray');
  preview.innerHTML = article.description;

  mainContent.appendChild(articleTitle);
  mainContent.appendChild(articleDate);
  mainContent.appendChild(preview);

  const imgDiv = document.createElement('div');
  imgDiv.classList.add('w-30');
  imgDiv.classList.add('align-self-center');
  imgDiv.classList.add('s-w-100');

  imgDiv.addEventListener('click', () => {
    window.open(article.url, '_blank');
  });

  const img = document.createElement('img');
  img.src = article.urlToImage;
  img.classList.add('w-100');
  img.classList.add('border-radius-15');

  imgDiv.appendChild(img);

  articleDiv.appendChild(imgDiv);
  articleDiv.appendChild(mainContent);

  newsContainer.appendChild(articleDiv);
}


getNews();