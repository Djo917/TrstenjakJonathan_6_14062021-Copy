import { Picture } from '../lib/mediaimage.class.js';
import { Movie } from '../lib/mediavideo.class.js';

export class Mediafactory {

    createMedia(media, miniature = false) {
        if(media.image) {
           return new Picture(media.photographerId, media.image, media.altText, media.id);
        }
        if(media.video && miniature === false) {
           return new Movie(media);
        }
        if(media.video && miniature === true) {
            const filename = `${media.video.slice(0, -3)}jpg`;
            return new Picture(media.photographerId, filename, media.altText, media.id);
        }
    }
}
export default Mediafactory;