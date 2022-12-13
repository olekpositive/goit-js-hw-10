import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;


const tag = {
    countriesName: document.querySelector('#search-box'),
    countriesList: document.querySelector('country-list'),
    countriesInfo: document.querySelector('country-info'),
};

