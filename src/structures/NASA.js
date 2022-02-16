import axios from 'axios';
import moment from 'moment';

export default class NASA {
  /**
 * @param {String} apiKey The NASA API Key to use
 */
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   *
   * @param {String} date The date of the APOD
   * @returns {Object} Title of APOD, Explanation, Date, and HDURL
   */
  async apod(date = moment().format('YYYY-MM-DD')) {
    if (!moment(date).isValid()) {
      throw new Error(`Invalid Date provided to APOD! Provided: ${date}`);
    }

    const { data } = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${this.apiKey}&date=${date}`);
    return {
      title: data.title, explanation: data.explanation, date, hdurl: data.hdurl,
    };
  }

  /**
   *
   * @param {String} query The query to use when searching through the library
   * @returns {Object}
   */
  // eslint-disable-next-line class-methods-use-this
  async searchImageLibrary(query) {
    const { data } = await axios.get(`https://images-api.nasa.gov/search?q=${query}`);
    return data.collection;
  }
}
