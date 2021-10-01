import { View } from './view.class.js';
import { Ajax } from '../lib/ajax.class.js';
import { Mediafactory } from '../lib/mediafactory.class.js';
import { Lightbox } from '../lib/lightbox.class.js';

class PhotographerPage {
    constructor(view, ajax, mediafactory, lightbox) {
        this.view = view;
        this.ajax = ajax;
        this.mediafactory = mediafactory;
        this.lightbox = lightbox;
    }
    
    run() {
        this.showPhotographer();
        this.noPhotographer();
        this.handleModal();
        this.eventLikes();
        this.price();
        this.initialDisplay();
    }

    showPhotographer() {
        const datas = this.ajax.fetchData();

        datas.then(data => {
            this.view.towardsPhotographer(data.photographers);
        })   
    }

    initialDisplay() {
        const idUrl = window.location.search.substr(1);
        const datas = this.ajax.fetchData();
        const menu = document.getElementById('menufilter');
        
        datas.then(data => {
            let getMedias = data.media.filter(p => p.photographerId == idUrl);
            let mediasSorted = this.sortingBy(getMedias, menu.value);
            this.view.renderAllMedia(mediasSorted);
            this.eventSort(mediasSorted);
            // this.lightbox.eventShow(mediasSorted);
            new Lightbox(mediasSorted);
        })
    }

    sortingBy(arrayMedia, sortType) {
        if(sortType === 'Popularité') {
            arrayMedia.sort((a, b) => b.likes - a.likes);
        }
        else if(sortType === 'Date') {
            arrayMedia.sort((a,b) => new Date(b.date) - new Date(a.date));
        }
        else if (sortType === 'Titre') {
            arrayMedia.sort((a, b) => {
                if(a.title > b.title) {
                    return 1;
                }
                if(a.title < b.title) {
                    return -1;
                }
                return 0;
            })
        }
        else{console.log("Unvalid type for sort");}

        return arrayMedia;
    }

    eventSort(initialSort){
        const menu = document.getElementById('menufilter');
        const section = document.getElementById('content');

        menu.addEventListener('change', () => {
            section.innerHTML = '';
            let newSort = this.sortingBy(initialSort, menu.value);
            this.view.renderAllMedia(newSort);
        })
    }
    

    noPhotographer() {
        const datas = this.ajax.fetchData();
        let idUrl = window.location.search.substr(1);
        idUrl = parseInt(idUrl, 10);

        datas.then(data => {
            let arrayId = [];
            data.photographers.forEach(p => {
                arrayId.push(p.id);
            })
            
            if(arrayId.includes(idUrl)) {
                return true;
            }
            else {
                const main = document.getElementById("deleteall");
                main.innerHTML = "Le photographe recherché n'existe pas";
                main.style.color = "red";
                main.style.fontSize = "3em";
            }
        })
    }

    handleModal() {
        const button = document.querySelector(".photographers__button--submit ");
        const modal = document.querySelector(".wrappermodal");
        const cross = document.getElementById("close");
        const mask2 = /[\wéèëêàâäïîôöÿçùûüœæ]{1,}/i;
        

        button.addEventListener('click', () => {
            const name = document.querySelector('.photographers__details--name');
            const nameModal = document.querySelector('.modal--contactname');
            const prenom = document.getElementById('first');
            nameModal.innerHTML = "Contactez-moi " + name.textContent;
            modal.style.display = "block";
            prenom.focus();     
        })

        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') {
                closeForm();
            }
        })
        
        cross.addEventListener('click', () => {
            modal.style.display = "none";
        })

        const firstNameValid = () => {
            const messageErreurPrenom = document.getElementById("messageErreurPrenom");
            let prenom = document.getElementById("first");
            
          
            if (prenom.value.length < 2) {
                messageErreurPrenom.textContent ="Veuillez entrer 2 caractères ou plus pour le champ du prénom.";
                return false;
            } 
            else if(mask2.test(prenom.value) === false) {
                messageErreurPrenom.textContent ="Caractères spéciaux interdits";
                return false;
            }
            else {
              messageErreurPrenom.textContent = "";
              return true;
            }
          };
          
          const lastNameValid = () => {
            const messageErreurNom = document.getElementById("messageErreurNom");
            let nom = document.getElementById("last");
          
            if (nom.value.length < 1) {
              messageErreurNom.textContent ="Veuillez entrer 2 caractères ou plus pour le champ du nom.";
              return false;
            }
            else if(mask2.test(nom.value) === false) {
                messageErreurNom.textContent ="Caractères spéciaux interdits";
                return false;
            } 
            else {
              messageErreurNom.textContent = "";
              return true;
            }
          };
          
          const emailAdressValid = () => {
            const messageErreurMail = document.getElementById("messageErreurMail");
            let email = document.getElementById("email");
            const emailregex = /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
          
            if (emailregex.test(email.value)) {
              messageErreurMail.textContent = "";
              return true;
          
            } else {
              messageErreurMail.textContent = "L'adresse e-mail est incorrecte.";
              return false;
            }
          };

          const closeForm = () => {
            modal.style.display = "none";
        }

          const confirmationSubmit = () => {          
            if(firstNameValid() && lastNameValid() && emailAdressValid()) {
                document.getElementById("formulaire").reset();
                closeForm();
            }
          };

          const msgValid = () => {
            const msgErreur = document.getElementById("messageErreurMessage");
            const msg = document.getElementById("message");
            console.log(msg.value);

            if(msg.value.length < 10) {
                msgErreur.textContent = "Veuillez saisir un message destiné au photographe";
            }
            else if(mask2.test(msg.value) === false) {
                msgErreur.textContent = "Caractères spéciaux interdits";
            }

            else {
                msgErreur.textContent = "";
            }
          }

        document.getElementById("formulaire").addEventListener("submit", (e) => {
            e.preventDefault();
            firstNameValid();
            lastNameValid();
            emailAdressValid();
            msgValid();
            confirmationSubmit();
        })
    }

    price() {
        const datas = this.ajax.fetchData();
        const idUrl = window.location.search.substr(1);
        
        datas.then(data => {            
            const getPrice = data.photographers.filter(p => p.id == idUrl)
            const price = document.getElementById("price");
            
            let priceEuro = new Intl.NumberFormat('fr-FR', { 
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0
            });
            price.innerText = priceEuro.format(getPrice[0].price) + '/jour';
        })
    }

    eventLikes() {
        const section = document.getElementById("content"); 
        const total = document.getElementById('totallikes');
        let likesMedia = 0;

        section.addEventListener('click', (e) => {
            if(e.target.nodeName === 'BUTTON') {  
                let isLiking = e.target.dataset.isliking === "true" ? true : false;
                e.target.value = isLiking ? +e.target.value - 1 : +e.target.value +1;
                e.target.dataset.isliking = !isLiking;
                e.target.textContent = isLiking ? e.target.value + "❤️" : e.target.value + "❤️";         
                total.innerText = likesMedia + "❤️";
                this.view.displayTotalLikes();
            }
        })
    }
}
const photographerPage = new PhotographerPage(new View(), new Ajax('/data/FishEyeData.json'), new Mediafactory());
photographerPage.run();