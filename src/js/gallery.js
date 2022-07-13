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

  async fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '28583927-dad8651872b2e78bc9670c73b';
    const search = new URLSearchParams({
      key: KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 4,
      page: this.page,
    });
    try {
      const response = await axios.get(`${BASE_URL}?${search.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
