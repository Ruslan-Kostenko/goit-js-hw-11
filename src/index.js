import axios from 'axios';
import * as Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';


const searchFormEl = document.getElementById('search-form');
const galleryBoxEl = document.querySelector('.gallery');
const loadBtnEl = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
let lightbox = null;

hideLoadBtn();
async function searchImages(query, page = 1, perPage = 40) {
  const myApiKey = '38312706-7f49ec212361a9f63e3040077';
  const apiUrl = `https://pixabay.com/api/?key=${myApiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  try {
    const response = await axios.get(apiUrl);
    const { data } = response;
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      if (page === 1) {
        removeGallery();
        lightbox = new SimpleLightbox('.gallery a');
      }
      renderImages(data.hits);
      const totalHits = data.totalHits || 0;
      if (page * perPage < totalHits) {
        showLoadBtn();
      } else {
        hideLoadBtn();
      }
    }
  } catch (error) {
    console.log('Error:', error);
  }
};


function renderImages(images) {
  const galleryCard = document.createDocumentFragment();
  images.forEach(image => {
    const imageCard = createImageCard(image);
    galleryCard.appendChild(imageCard);
  });
  galleryBoxEl.appendChild(galleryCard);
  lightbox.refresh();
};


function createImageCard(image) {
  const photoCard = document.createElement('div');
  photoCard.classList.add('photo-card');

  const linkEl = document.createElement('a');
  linkEl.href = image.largeImageURL;

  const imageEl = document.createElement('img');
  imageEl.src = image.webformatURL;
  imageEl.alt = image.tags;
  imageEl.width = "320";
  imageEl.height = "240";
  imageEl.loading = 'lazy';

  const infoBox = document.createElement('div');
  infoBox.classList.add('info');

  const likes = makeInfoItem('Likes', image.likes);
  const views = makeInfoItem('Views', image.views);
  const comments = makeInfoItem('Comments', image.comments);
  const downloads = makeInfoItem('Downloads', image.downloads);

  infoBox.appendChild(likes);
  infoBox.appendChild(views);
  infoBox.appendChild(comments);
  infoBox.appendChild(downloads);
  linkEl.appendChild(imageEl);
  photoCard.appendChild(linkEl);
  photoCard.appendChild(infoBox);
  return photoCard;
};


function makeInfoItem(label, value) {
  const infoItem = document.createElement('p');
  infoItem.classList.add('info-item');
  infoItem.innerHTML = `<b>${label}:</b> ${value}`;
  return infoItem;
};


function removeGallery() {
  galleryBoxEl.innerHTML = '';
};


function showLoadBtn() {
  loadBtnEl.style.display = 'block';
};


function hideLoadBtn() {
  loadBtnEl.style.display = 'none';
};


searchFormEl.addEventListener('submit', event => {
  event.preventDefault();
  const searchQuery = event.target.elements.searchQuery.value.trim();
  if (searchQuery !== '') {
    currentPage = 1;
    currentQuery = searchQuery;
    searchImages(searchQuery, currentPage);
    hideLoadBtn();
  }
});


loadBtnEl.addEventListener('click', () => {
  currentPage += 1;
  searchImages(currentQuery, currentPage);
});