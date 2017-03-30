window.onload = function() {
		console.log('initialisation...');
		let app = new App('datas/data.json',document.getElementById('container') );
}

function tag(type){
		return document.createElement(type);
}

class Photo {
		constructor(titre, url, description){
				this.titre = titre;
				this.url = url;
				this.description = description;
		}
}

// Ajax request
class Loader {
		constructor(){
				this.photos = [];
				this.albumTitre = '';
		}
		load(url, onLoadCallback) {
				this.onLoadCallback = onLoadCallback;
				let req = new XMLHttpRequest();
				req.onload = this.onDataReady.bind(this);
				req.open('GET', url, true);
				req.send();
		}
		onDataReady(e){
				let data = e.target.responseText;
				this.photos = JSON.parse(data)['photos']
						.map( p => new Photo(p.titre, p.url, p.description));
				this.albumTitre = JSON.parse(data).titre;
				this.onLoadCallback(this.photos, this.albumTitre);
				console.log('this.albumTitre => ' + this.albumTitre);
		}
}

// Controller de l'Affichage
class ViewManager {
		constructor(elementHTML){
				this.container = elementHTML;
		}
		set photos(photos){
				this._photos = photos;
				this.render();

		}
		set titreGalerie(titre){
				this._titre = titre;
				this.displayTitle(titre);
				console.log(this._titre + ' => this._titre dans set titreGalerie()');
		}

		render(){
				let photoRenderers = this._photos.map((p) => this.displayPhotos(p));
				photoRenderers.forEach((i) => document.getElementById('container').appendChild(i));
				console.log(this._titre + ' => this._titre dans render()');
		}

		displayTitle(titreAlbum) {
				// TODO this.cardTitle ?
				let cardTitle = tag('h2');
				cardTitle.innerHTML = titreAlbum;
				document.getElementById('header').appendChild(cardTitle);
				return cardTitle;
		}

		displayPhotos(photos) {
				// Box Photo
				this.divPhotoBox = tag('div');
				this.divPhotoBox.classList.add("photo");
				document.getElementById('container').appendChild(this.divPhotoBox);
				let titre = tag('h3');
				let image = tag('img');
				let description = tag('p');
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
}


class App {
		constructor(url, elementHTML) {
				this.container = elementHTML;
				// Charge les données
				this.chargeur = new Loader();
				this.chargeur.load(url, this.onGalleryReady.bind(this));
		}
		onGalleryReady(photos, albumTitre) {
				this.photos = photos;
				this.albumTitre = albumTitre;
				// affiche les box photos
				let boxPhoto = tag('div');
				//boxPhoto.classList.add("photo");
				// La div photo devient l'enfant de l'élément HTML
				this.container.appendChild(boxPhoto);
				this.ViewManager = new ViewManager(boxPhoto);
				this.ViewManager.photos = this.photos;
				this.ViewManager.titreGalerie = this.albumTitre;
		}
}

