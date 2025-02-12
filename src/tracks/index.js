const axios = require("axios");
require("dotenv").config();
const secretkey = process.env.YOUTUBE_SECRET_KEY;
/**
 * Fetchs list of videos from string query, each list item contains the title, channel, and id of a video.
 * Title is key, value is array of 
 * Return num results
 * @param {string} query
 * @param {number} num 
 * @returns {Array<Map>}
 */
async function fetchResults(query, num) {
    try {
        const value = await axios({
            method: "GET",
            url: "https://www.googleapis.com/youtube/v3/search",
            params: {
                key: secretkey,
                part: "snippet",
                q: query,
                maxResults: num,
                type: "video",
            },
        }).then((response) => {
            const items = response.data.items;
            const videoInfo = new Map();
            for (const video of items) {
              if (video.id.videoId){
                videoInfo.set(video.snippet.title, [
                  video.id.videoId,
                  video.snippet.channelTitle,
              ]);
              }
            }
            return videoInfo;
        });
        return value;
    } catch (error) {
        console.error(error);
        return [];
    }
}

module.exports = { fetchResults };
