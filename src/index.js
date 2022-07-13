import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GalleryApi from './js/gallery';
import cardTpl from './templates/card.hbs';

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.classList.add('is-hidden');
// class MyURLSearchParams {
//   constructor(obj) {
//     this.params = obj;
//   }
//   toString() {
//     return Object.keys(this.params).reduce(
//       (acc, el) => (acc += `${el}=${this.params[el]}&`),
//       '?'
//     );
//   }
// }
// const search2 = new MyURLSearchParams({
//   key: KEY,
//   q: 'cat',
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,
// });
// console.log(search2.toString());

const galleryApi = new GalleryApi();
formEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

const galleryLightbox = new SimpleLightbox('.gallery-item', {
  captionsData: 'alt',
  captionDelay: 250,
  navText: ['<', '>'],
});

async function onSearch(event) {
  event.preventDefault();
  galleryApi.query = event.currentTarget.elements.searchQuery.value;
  galleryApi.page = 1;

  clearGalleryMarkupContainer();
  const response = await galleryApi.fetchImages();
  if (galleryApi.query === '') {
    Notify.failure('Sorry, there are no search query. Please try again.');
  } else if (response.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else appendGalleryMarkup(response.hits);
  Notify.info(`Hooray! We found ${response.totalHits} images.`);
  galleryLightbox.refresh();
}

async function onLoadMore() {
  galleryApi.page += 1;
  const response = await galleryApi.fetchImages();
  appendGalleryMarkup(response.hits);
  galleryLightbox.refresh();
  const totalPages = Math.ceil(response.totalHits / 40);
  if (galleryApi.page === totalPages) {
    loadMoreBtn.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function appendGalleryMarkup(response) {
  const markup = cardTpl(response);
  console.log(markup);
  gallery.insertAdjacentHTML('beforeend', markup);
  loadMoreBtn.classList.remove('is-hidden');
}

function clearGalleryMarkupContainer() {
  gallery.innerHTML = '';
}
