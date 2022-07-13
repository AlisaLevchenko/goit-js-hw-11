import axios from 'axios';

export default class GalleryApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  static #BASE_URL = 'https://pixabay.com/api';
  static #KEY = '28583927-dad8651872b2e78bc9670c73b';

  async fetchImages() {
    const search = new URLSearchParams({
      key: GalleryApi.#KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 4,
      page: this.page,
    });
    try {
      const response = await axios.get(
        `${GalleryApi.#BASE_URL}?${search.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
