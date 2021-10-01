import { Mediafactory } from '../lib/mediafactory.class.js';

export class Lightbox {
    constructor(arrayMedia) {
        this.arrayMedia = arrayMedia;
        this.mediafactory = new Mediafactory();
        this.eventClose();
        this.eventShow(arrayMedia);
    }

    eventShow(arrayMedia){
        const section = document.querySelector('.content');
        const lightbox = document.querySelector('.lightbox');
        const h2 = document.createElement("h2");
        const next = document.getElementById('nextelement');
        
        section.addEventListener('click', (e) => {
            let index = arrayMedia.findIndex((media) => media.id == e.target.dataset.id);
            
            if(e.target.nodeName === 'IMG') {
                lightbox.style.display = 'flex';
                let html = this.generateMedia(arrayMedia, index);
                lightbox.appendChild(html.render());
                lightbox.prepend(h2);
                h2.classList.add('title--lightbox');
                h2.textContent = arrayMedia[index].title;
                document.querySelector(".content__vignettes--pictures").classList.add('imglightbox');
                this.eventPrev(arrayMedia, index);
                this.eventNext(arrayMedia, index);
                next.focus();
            }
        });
    }

    eventClose() {
        const lightbox = document.querySelector('.lightbox');

        lightbox.addEventListener('click', (e) => {
            if(e.target.id === "closelight") {
                lightbox.style.display = 'none';
                lightbox.removeChild(lightbox.lastElementChild);
                document.querySelector(".content__vignettes--pictures").classList.remove('imglightbox');
            }
        });

        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') {
                lightbox.style.display = 'none';
                lightbox.removeChild(lightbox.lastElementChild);
                document.querySelector(".content__vignettes--pictures").classList.remove('imglightbox');
            }
        });
    }

    eventNext(arrayMedia, index) {
        const lightbox = document.querySelector('.lightbox');
        const title = document.querySelector('.title--lightbox');
        
        lightbox.addEventListener('click', (e) => {            
            if(e.target.id === "nextelement") {
                lightbox.removeChild(lightbox.lastElementChild);
                index++;
                if(index >= arrayMedia.length){
                    index = 0;
                }

                let html = this.generateMedia(arrayMedia, index);
                lightbox.appendChild(html.render());
                title.textContent = `${arrayMedia[index].title}`;
                this.eventPrev(arrayMedia, index);
            }
        });

        document.addEventListener('keydown', (e) => {
            
            if(e.key === "ArrowRight") {
                lightbox.removeChild(lightbox.lastElementChild);
                index++;
                
                if(index >= arrayMedia.length){
                    index = 0;
                }
                
                let html = this.generateMedia(arrayMedia, index);
                lightbox.appendChild(html.render());
                title.textContent = `${arrayMedia[index].title}`;
                this.eventPrev(arrayMedia, index);
            }
        })
    }

    eventPrev(arrayMedia, index) {
        const lightbox = document.querySelector('.lightbox');
        const title = document.querySelector('.title--lightbox');
        
        lightbox.addEventListener('click', (e) => {            
            
            if(e.target.id === "previouselement") {
                lightbox.removeChild(lightbox.lastElementChild);
                console.log(index);
                index--;
                
                if(index < 0) {
                    index = arrayMedia.length -1;
                }

                let html = this.generateMedia(arrayMedia, index);
                lightbox.appendChild(html.render());
                title.textContent = `${arrayMedia[index].title}`;
                this.eventNext(arrayMedia, index);
            }
        });

        document.addEventListener('keydown', (e) => {
            if(e.key === "ArrowLeft") {
                lightbox.removeChild(lightbox.lastElementChild);
                index--;
                
                if(index < 0) {
                    index = arrayMedia.length -1;
                }

                let html = this.generateMedia(arrayMedia, index);
                lightbox.appendChild(html.render());
                title.textContent = `${arrayMedia[index].title}`;
                this.eventNext(arrayMedia, index);
            }
        })
    }

    generateMedia(arrayMedia, index) {
        let html = this.mediafactory.createMedia(arrayMedia[index]);
        return html;
    }
}
export default Lightbox;