const { spawn } = require("child_process");
const baseUrl = "https://www.youtube.com/watch?v=";

/**
 * Fetches the audio stream for a given YouTube video ID
 * @param {string} videoId The ID of the YouTube video
 * @returns {ReadableStream} The audio stream
 */
function fetchTrackAudio(videoId) {
    const yt_dlp = spawn("yt-dlp", [
        "-f",
        "bestaudio",
        "-o",
        "-",
        baseUrl + videoId,
    ]);
    return yt_dlp.stdout;
}

module.exports = { fetchTrackAudio };