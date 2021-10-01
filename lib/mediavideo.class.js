export class Movie {
    constructor(media) {
        this.media = media;
    }

    render() {
        let mov = document.createElement("video");
        mov.classList.add("content__vignettes--pictures");
        mov.classList.add("imglightbox");
        mov.src = `media/sample_photos/${this.media.photographerId}/${this.media.video}`;
        mov.alt = `${this.alt}`;
        mov.setAttribute("data-id", `${this.media.id}`);
        mov.controls = 'controls';
        return mov;
    }
}
export default Movie;