console.log({ configuration });

const autoplay = configuration.autoplay;
const loop = configuration.loop;
const muted = configuration.muted;

function loadPlyr() {
    if (typeof Plyr !== "undefined") {
        initPlayer();
        return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.plyr.io/3.7.8/plyr.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.plyr.io/3.7.8/plyr.polyfilled.js";
    script.onload = initPlayer;
    document.body.appendChild(script);
}

function detectVideoType(url) {
    if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
    if (/vimeo\.com/.test(url)) return "vimeo";
    if (/\.(mp4|webm|ogg)$/i.test(url)) return "html5";
    return null;
}

function extractVideoId(type, url) {
    if (type === "youtube") {
        const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        return match ? match[1] : null;
    }
    if (type === "vimeo") {
        const match = url.match(/vimeo\.com\/(\d+)/);
        return match ? match[1] : null;
    }
    return null;
}

function initPlayer() {
    const playerDiv = document.getElementById("player");
    const rawVideoUrl = configuration.videoURL?.trim();

    const type = detectVideoType(rawVideoUrl);

    if (!type) {
        console.error("Unsupported video type:", rawVideoUrl);
        return;
    }

    playerDiv.innerHTML = "";

    if (type === "youtube" || type === "vimeo") {
        const videoId = extractVideoId(type, rawVideoUrl);
        if (!videoId) {
            console.error("Could not extract video ID for", type);
            return;
        }

        playerDiv.setAttribute("data-plyr-provider", type);
        playerDiv.setAttribute("data-plyr-embed-id", videoId);
    } else if (type === "html5") {
        const video = document.createElement("video");
        video.setAttribute("controls", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("src", rawVideoUrl);
        video.setAttribute("autoplay", configuration.autoplay);
        video.setAttribute("loop", configuration.loop);
        video.setAttribute("muted", configuration.muted);

        video.classList.add("plyr-video");
        playerDiv.appendChild(video);
    }

    function forceVimeoMuted(plyrInstance) {
        const iframe = document.querySelector("#player iframe");
        if (!iframe || !iframe.src.includes("vimeo")) return;

        const vimeoPlayer = new Vimeo.Player(iframe);
        vimeoPlayer.setVolume(0).catch(console.warn);
    }

    function loadVimeoAPI(callback) {
        if (typeof Vimeo !== "undefined") {
            callback();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://player.vimeo.com/api/player.js";
        script.onload = callback;
        document.body.appendChild(script);
    }

    new Plyr("#player", {
        autoplay,
        muted,
        displayDuration: false,
        loop: { active: loop },
        youtube: {
            noCookie: true,
            rel: 0,
            modestbranding: 1,
        },
        vimeo: {
            byline: false,
            title: false,
        },
    });

    if (type === "vimeo" && muted) {
        loadVimeoAPI(() => forceVimeoMuted());
    }
}

loadPlyr();
