class TrackData {
    /**
     * 
     * @param {String} name 
     * @param {String} id 
     * @param {String} artist 
     * @param {String} thumbnail 
     */
    constructor(name, id, artist, thumbnail){
        this.name = name;
        this.id = id;
        this.artist = artist;
        this.thumbnail = thumbnail;
    }
}
module.exports = { TrackData };
