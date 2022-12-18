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

function renderTemplate(elements) {
    let template = '';
    let tagTemplate = '';
    clearTemplate();

    if (elements.length === 1) {
        template = createTemplateItem(elements);
        tagTemplate = tag.countriesInfo;
    } else {
        template = createTemplateItemList(elements);
        tagTemplate = tag.countriesList;
    }

    drawTemplate(tagTemplate, template);
}

function drawTemplate(tag, markup) {
    tag.innerHTML = markup;
}

function createTemplateItem(element) {
    return element.map(
        ({ name, capital, population, flags, languages }) =>
        `<img
            src="${flags.svg}" 
            alt="${name.official}" 
            width="120" 
            height="80">
        <h1 class="country-info__title">${name.official}</h1>
        <ul class="country-info__list">
          <li class="country-info__item">
          <span>Capital:</span>
        ${capital}
          </li>
          <li class="country-info__item">
          <span>Population:</span>
          ${population}
          </li>
          <li class="country-info__item">
          <span>Lenguages:</span>
          ${Object.values(languages)}
          </li>
      </ul>`
    );
}

function createTemplateItemList(elements) {
    return elements
        .map(
            ({ name, flags }) => `
      <li class="country-list__item">
        <img class="country-list__img" 
          src="${flags.svg}" 
          alt="${name.official}" 
          width="60" 
          height="40">
        ${name.official}
      </li>`
        )
        .join('');
}

function errorWarn() {
    Notify.failure(`Oops, there is no country with that name`)
};