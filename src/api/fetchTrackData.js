const axios = require("axios");
const { TrackData } = require('../utils/trackData.js')
require("dotenv").config();
const secretkey = process.env.YOUTUBE_SECRET_KEY;

/**
 * Fetchs list of videos from string query, each list item contains the title, channel, and id of a video.
 * Title is key, value is array of 
 * Return num results
 * @param {String} query
 * @param {Number} num 
 * @returns {Promise<Map<string, TrackData>>} Promise resolving to Map of video id to TrackData object
 */
async function fetchTrackData(query, num) {

    try {
        const response = await axios({
            method: "GET",
            url: "https://www.googleapis.com/youtube/v3/search",
            params: {
                key: secretkey,
                part: "snippet",
                q: query,
                maxResults: num,
                type: "video",
            },
        })

        const items = response.data.items;
        const videos = new Map();
        for (const video of items) {
            if (video.id.videoId){
                const videoTitle = video.snippet.title;
                const id = video.id.videoId;
                const channelTitle = video.snippet.channelTitle;
                const thumbnailUrl = video.snippet.thumbnails.high.url;

                videos.set(id, new TrackData(videoTitle, id, channelTitle, thumbnailUrl));
            }
        }
        console.log("Data processed.");
        return videos;
    } catch (error) {
        console.error(error);
        return new Map();
    }
}

module.exports = { fetchTrackData };