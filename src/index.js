import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const tag = {
    countriesName: document.querySelector('#search-box'),
    countriesList: document.querySelector('.country-list'),
    countriesInfo: document.querySelector('.country-info'),
};

tag.countriesName.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));


function onInputChange(input) {
    const countryName = input.target.value.trim();

    const specific = /^-| {2,}|[^\w\d\- ]|\-{2,}| \-{1,}|\-{1,} {1,}/gi;
    const test = specific.test(countryName);
    if (test) {
        errorSpecificLetters();
        clearTemplate();
        return;
    }
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

function createTemplateItem(element) {
    return element.map(
        ({ name, capital, population, flags, languages }) =>
            `<div class="country-info__title"> <img
            src="${flags.svg}" 
            alt="${name.common}" 
            width="100" 
            height="60">
            <h1 class="country-info__title-name">${name.common}</h1>
        </div>
        <ul class="country-info__list">
          <li class="country-info__item">
          <span>Capital:</span>
          ${Object.values(capital).length > 0 ? capital : '-'}
          </li>
          <li class="country-info__item">
          <span>Population:</span>
          ${population}
          </li>
          <li class= "country-info__item">
          ${Object.values(languages).length > 1 ? 'Languages:' : 'Language:'}
          ${Object.values(languages).join(", ")}
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
          alt="${name.common}" 
          width="60" 
          height="40">
        ${name.common}
      </li>`
        )
        .join('');
}

function specificNameInfo() {
    Notify.info('Too many matches found. Please enter a more specific name.');
}

function clearTemplate() {
    tag.countriesInfo.innerHTML = '';
    tag.countriesList.innerHTML = '';
}

function drawTemplate(tag, markup) {
    tag.innerHTML = markup;
}

function errorWarn() {
    Notify.failure(`Oops, there is no country with that name`);
}

function errorSpecificLetters() {
    Notify.warning("Please use only letters, and no doubled space and '-' ");
}