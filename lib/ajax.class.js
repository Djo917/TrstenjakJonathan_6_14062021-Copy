export class Ajax {
    constructor(url) {
        this.url = url;
    }
    
    async fetchData() {
        const response = await fetch(this.url);
        return await response.json();
    }
}

export default Ajax;