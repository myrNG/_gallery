'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.onload = function () {
		console.log('initialisation...');
		var app = new App('datas/data.json', document.getElementById('container'));
};

function tag(type) {
		return document.createElement(type);
}

var Photo = function Photo(titre, url, description) {
		_classCallCheck(this, Photo);

		this.titre = titre;
		this.url = url;
		this.description = description;
};

// Ajax request


var Loader = function () {
		function Loader() {
				_classCallCheck(this, Loader);

				this.photos = [];
				this.albumTitre = '';
		}

		_createClass(Loader, [{
				key: 'load',
				value: function load(url, onLoadCallback) {
						this.onLoadCallback = onLoadCallback;
						var req = new XMLHttpRequest();
						req.onload = this.onDataReady.bind(this);
						req.open('GET', url, true);
						req.send();
				}
		}, {
				key: 'onDataReady',
				value: function onDataReady(e) {
						var data = e.target.responseText;
						this.photos = JSON.parse(data)['photos'].map(function (p) {
								return new Photo(p.titre, p.url, p.description);
						});
						this.albumTitre = JSON.parse(data).titre;
						this.onLoadCallback(this.photos, this.albumTitre);
						console.log('this.albumTitre => ' + this.albumTitre);
				}
		}]);

		return Loader;
}();

// Controller de l'Affichage


var ViewManager = function () {
		function ViewManager(elementHTML) {
				_classCallCheck(this, ViewManager);

				this.container = elementHTML;
		}

		_createClass(ViewManager, [{
				key: 'render',
				value: function render() {
						var _this = this;

						var photoRenderers = this._photos.map(function (p) {
								return _this.displayPhotos(p);
						});
						photoRenderers.forEach(function (i) {
								return document.getElementById('container').appendChild(i);
						});
						console.log(this._titre + ' => this._titre dans render()');
				}
		}, {
				key: 'displayTitle',
				value: function displayTitle(titreAlbum) {
						// TODO this.cardTitle ?
						var cardTitle = tag('h2');
						cardTitle.innerHTML = titreAlbum;
						document.getElementById('header').appendChild(cardTitle);
						return cardTitle;
				}
		}, {
				key: 'displayPhotos',
				value: function displayPhotos(photos) {
						// Box Photo
						this.divPhotoBox = tag('div');
						this.divPhotoBox.classList.add("photo");
						document.getElementById('container').appendChild(this.divPhotoBox);
						var titre = tag('h3');
						var image = tag('img');
						var description = tag('p');
						titre.innerHTML = photos.titre;
						titre.classList.add('titre');
						image.setAttribute("src", photos.url);
						description.innerHTML = photos.description;
						description.classList.add('description');
						this.divPhotoBox.appendChild(titre);
						this.divPhotoBox.appendChild(image);
						this.divPhotoBox.appendChild(description);
						return this.divPhotoBox;
				}
		}, {
				key: 'photos',
				set: function set(photos) {
						this._photos = photos;
						this.render();
				}
		}, {
				key: 'titreGalerie',
				set: function set(titre) {
						this._titre = titre;
						this.displayTitle(titre);
						console.log(this._titre + ' => this._titre dans set titreGalerie()');
				}
		}]);

		return ViewManager;
}();

var App = function () {
		function App(url, elementHTML) {
				_classCallCheck(this, App);

				this.container = elementHTML;
				// Charge les données
				this.chargeur = new Loader();
				this.chargeur.load(url, this.onGalleryReady.bind(this));
		}

		_createClass(App, [{
				key: 'onGalleryReady',
				value: function onGalleryReady(photos, albumTitre) {
						this.photos = photos;
						this.albumTitre = albumTitre;
						// affiche les box photos
						var boxPhoto = tag('div');
						//boxPhoto.classList.add("photo");
						// La div photo devient l'enfant de l'élément HTML
						this.container.appendChild(boxPhoto);
						this.ViewManager = new ViewManager(boxPhoto);
						this.ViewManager.photos = this.photos;
						this.ViewManager.titreGalerie = this.albumTitre;
				}
		}]);

		return App;
}();