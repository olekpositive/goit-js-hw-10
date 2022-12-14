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

tag.countriesName.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(input) {
    const countryName = input.target.value.trim();

    if (!countryName) {
        clearTemplate();
        return;
    }

    fetchCountries(countryName)
        .then(data => {
            if (data.length > 10) {
                specificNameInfo();
                clearTemplate();
                return;
            }
            renderTemplate(data);
        })
        .catch(error => {
            clearTemplate();
            errorWarn();
        });
}
function specificNameInfo() {
    Notify.info('Too many matches found. Please enter a more specific name.');
}

function clearTemplate() {
    tag.countriesInfo.innerHTML = '';
    tag.countriesList.innerHTML = '';
}

function errorWarn() {
    Notify.failure(`Oops, there is no country with that name`);
}

