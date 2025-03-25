class TrackData {
    /**
     * 
     * @param {string} name 
     * @param {string} id 
     * @param {string} artist 
     * @param {string} thumbnail 
     */
    constructor(name, id, artist, thumbnail){
        this.name = name;
        this.id = id;
        this.artist = artist;
        this.thumbnail = thumbnail;
    }
}
module.exports = { TrackData };
