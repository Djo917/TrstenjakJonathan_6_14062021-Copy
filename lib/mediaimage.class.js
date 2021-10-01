export class Picture {
    
    constructor(path, filename, alt, id) {
        this.path = path;
        this.filename = filename;
        this.alt = alt;
        this.id = id;
    }

    render() {
        let pic = document.createElement("img");
        pic.classList.add("content__vignettes--pictures", "imglightbox");
        pic.src = `media/sample_photos/${this.path}/${this.filename}`;
        pic.alt = `${this.alt}`;
        pic.setAttribute("data-id", `${this.id}`);
        return pic;
    }
}

export default Picture;