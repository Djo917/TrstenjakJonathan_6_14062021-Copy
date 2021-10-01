import { View } from './view.class.js';
import { Ajax } from '../lib/ajax.class.js';

class IndexPage {
    constructor(view, ajax) {
        this.view = view;
        this.ajax = ajax;
    }
    run() {
        this.showAllPhotographers(this.tagsSelected);
        this.showTags();
        this.eventTags();
        this.eventScroll();
    }

    showAllPhotographers(filtreTags) {
        const datas = this.ajax.fetchData();
        
        datas.then(data => {
            
            let photographersFiltre = [];
            let concatPhotographers = [];
            let filtered = [];

            if(filtreTags === undefined) {
                this.view.renderAllPhotographers(data.photographers);
            }

            else {
                this.view.clearCardsPhotographers();
                
                let filtreTagsLower = filtreTags.map(tags => tags.toLowerCase());

                filtreTagsLower.forEach(tags => {
                    photographersFiltre.push(data.photographers.filter(t => t.tags.includes(tags)));
                });

                concatPhotographers = photographersFiltre.reduce((acc, current) => acc.concat(current), []);
                // let concatPhotographers = [].concat(...photographersFiltre.map(littleArray => littleArray));
                filtered = [...new Set(concatPhotographers.map(JSON.stringify))].map(JSON.parse);
                this.view.renderAllPhotographers(filtered);
            }
        })
    }


    showTags() {
        const datas = this.ajax.fetchData();

        datas.then(data => {
            this.view.renderAllTags(data.photographers);
        })  
    }

    eventTags() {
        const tags = document.getElementById("navmenu");
        let tagsSelected = [];

        tags.addEventListener('click', event => {

            if(event.target.nodeName === 'SPAN') {
                
                if(tagsSelected.includes(event.target.innerText.substring(1))) {
                    let index = tagsSelected.indexOf(event.target.innerText.substring(1));
                    tagsSelected.splice(index, 1);
                    event.target.style.background = 'none';
                    this.showAllPhotographers(tagsSelected);

                    //set le tableau sur undefined pour respecter le IF de showallphotographers 
                    //et ainsi afficher tous les photographes si aucun tags n'est sélectionnés
                    //puis setup tableau vide pour que showAllPhotgraphers puisse fonctionner
                    if(tagsSelected.length === 0) {
                        tagsSelected = undefined; 
                        this.showAllPhotographers(tagsSelected);
                        tagsSelected = [];
                    }
                
                }
                else {
                    event.target.style.background = '#DB8876';
                    tagsSelected.push(event.target.innerText.substring(1)); //Retire le #
                    this.showAllPhotographers(tagsSelected);
                }
            }
        })
    }

    eventScroll() {
        document.addEventListener('DOMContentLoaded', () => {
            window.onscroll = () => {

                if(window.pageYOffset < 100){
                    document.querySelector('.photographers--redirect').style.display = 'none';
                }
                else {
                    document.querySelector('.photographers--redirect').style.display = 'flex';
                }
                
            }
        })
    }
}
const indexPage = new IndexPage(new View(), new Ajax('../data/FishEyeData.json'));
indexPage.run();