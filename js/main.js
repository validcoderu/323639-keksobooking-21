'use strict';

const ADS_QUANTITY = 8;
const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;

const OFFER_TITLES = ['Заголовок предложения 1', 'Заголовок предложения 2', 'Заголовок предложения 3', 'Заголовок предложения 4', 'Заголовок предложения 5', 'Заголовок предложения 6', 'Заголовок предложения 7', 'Заголовок предложения 8'];
const OFFER_ADDRESSES = ['200, 130', '300, 185', '400, 250', '500, 350', '600, 450', '700, 350', '800, 250'];
const OFFER_PRICES = ['1500', '200', '2700', '800', '999', '8900', '1000', '9999'];
const OFFER_TYPES_LIST_MAP = {
  'flat': 'Квартира',
  'bungalow': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};
const OFFER_ROOMS = ['1', '2', '3', '4'];
const OFFER_GUESTS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const OFFER_CHECKINS = ['12:00', '13:00', '14:00'];
const OFFER_CHECKOUTS = ['12:00', '13:00', '14:00'];
const OFFER_FEATURES = [['washer', 'elevator', 'conditioner'], ['wifi', 'dishwasher', 'parking'], ['wifi', 'parking', 'washer', 'conditioner']];
const OFFER_DESCRIPTIONS = ['Строка с описанием 1', 'Строка с описанием 2', 'Строка с описанием 3', 'Строка с описанием 4', 'Строка с описанием 5', 'Строка с описанием 6', 'Строка с описанием 7', 'Строка с описанием 8'];
const OFFER_PHOTOS = [['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg'], ['http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'], ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']];
const OFFER_LOCATION_X = ['200', '300', '400', '500', '600', '700', '800', '630'];
const OFFER_LOCATION_Y = ['130', '200', '270', '340', '430', '500', '570', '630'];

const map = document.querySelector('.map');
map.classList.remove('map--faded');

const pinList = document.querySelector('.map__pins');
const pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
const adTemplate = document.querySelector('#card').content.querySelector('.map__card');
adTemplate.querySelector('.popup__photos').innerHTML = '';

/* Функция выбора рандомного значения из массива */
let getArrayRandomValue = function (data) {
  let randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
};

/* Функция выбора рандомного значения из объекта */
let getObjectRandomValue = function (obj) {
  let keys = Object.keys(obj);
  return obj[keys[keys.length * Math.random() << 0]];
};

/* Функция генерирующая объект объявления */
let generateAds = function (quantity) {
  let ads = [];

  for (let i = 0; i < quantity; i++) {
    let ad = {
      'author': {
        'avatar': 'img/avatars/user0' + [i + 1] + '.png'
      },
      'offer': {
        'title': getArrayRandomValue(OFFER_TITLES),
        'address': getArrayRandomValue(OFFER_ADDRESSES),
        'price': getArrayRandomValue(OFFER_PRICES),
        'type': getObjectRandomValue(OFFER_TYPES_LIST_MAP),
        'rooms': getArrayRandomValue(OFFER_ROOMS),
        'guests': getArrayRandomValue(OFFER_GUESTS),
        'checkin': getArrayRandomValue(OFFER_CHECKINS),
        'checkout': getArrayRandomValue(OFFER_CHECKOUTS),
        'features': getArrayRandomValue(OFFER_FEATURES),
        'description': getArrayRandomValue(OFFER_DESCRIPTIONS),
        'photos': getArrayRandomValue(OFFER_PHOTOS)
      },
      'location': {
        'x': getArrayRandomValue(OFFER_LOCATION_X),
        'y': getArrayRandomValue(OFFER_LOCATION_Y)
      }
    };

    ads[i] = ad;
  }

  return ads;
};

/* Функция вывода фотографий в объявлении */
let renderAdPhotos = function (photos) {
  let fragment = document.createDocumentFragment();

  for (let i = 0; i < photos.length; i++) {
    let newImg = document.createRange().createContextualFragment('<img src="' + photos[i] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
    fragment.append(newImg);
  }

  return fragment;
};

/* Функция генерации метки объявления из темплейта */
let renderPin = function (ad) {
  let pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
  pinElement.style.top = ad.location.y - PIN_HEIGHT + 'px';
  pinElement.querySelector('img').src = ad.author.avatar;
  pinElement.querySelector('img').alt = ad.offer.title;

  return pinElement;
};

/* Функиця генерирующая отдельное объявление из темплейта на основании объекта */
let renderAd = function (ad) {
  let adElement = adTemplate.cloneNode(true);

  adElement.querySelector('.popup__avatar').src = ad.author.avatar;
  adElement.querySelector('.popup__title').textContent = ad.offer.title;
  adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
  adElement.querySelector('.popup__type').textContent = ad.offer.type;
  adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  adElement.querySelector('.popup__features').textContent = ad.offer.features;
  adElement.querySelector('.popup__description').textContent = ad.offer.description;
  adElement.querySelector('.popup__photos').append(renderAdPhotos(ad.offer.photos));

  return adElement;
};

/* Функция вставки метки объявления на карту */
let insertPins = function (ads) {
  let fragment = document.createDocumentFragment();

  for (let j = 0; j < ads.length; j++) {
    let pinItem = renderPin(ads[j]);
    fragment.appendChild(pinItem);
  }

  return fragment;
};

/* Функция вставки объявлений на карту */
let insertAds = function (ads) {
  let fragment = document.createDocumentFragment();

  for (let j = 0; j < 1; j++) {
    let adItem = renderAd(ads[j]);
    fragment.appendChild(adItem);
  }

  return fragment;
};

/* Добавляем метки на карту */
pinList.append(insertPins(generateAds(ADS_QUANTITY)));

/* Добавляем объявление на карту */
map.querySelector('.map__filters-container').before(insertAds(generateAds(ADS_QUANTITY)));
