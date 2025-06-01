const autoplay = configuration.autoplay;
const enableCustomColor = configuration.enableCustomColor;
const loop = configuration.loop;
const muted = configuration.muted;
const playButton = configuration.playButton;
const playerColor = configuration.playerColor;
const videoId = configuration.wistiaVideoId;

if (!window.wistiaScriptLoaded) {
    const script = document.createElement("script");

    script.async = true;
    script.src = "https://fast.wistia.com/assets/external/E-v1.js";

    document.head.appendChild(script);

    window.wistiaScriptLoaded = true;
}

const properties = {
    ...(enableCustomColor ? { playerColor } : undefined),
    autoplay: Boolean(autoplay),
    endVideoBehavior: loop ? "loop" : "",
    muted: String(muted),
    seo: "false",
    playButton: String(playButton),
    videoFoam: "true",
};

let className = `wistia_embed wistia_async_${videoId} `;

for (const property in properties) {
    className += `${property}=${properties[property]} `;
}

const wistiaPlayerDiv = document.getElementById("wistia_player");

wistiaPlayerDiv.className = className;

const getVideo = () => Wistia.api(videoId);

Liferay.on("wistia:add_to_playlist", ({ details }) => {
    const [videoId, options] = details;

    getVideo().addToPlaylist(videoId, options);
});

Liferay.on("wistia:play", () => {
    getVideo().play();
});

Liferay.on("wistia:pause", () => {
    getVideo().pause();
});

setTimeout(() => {
    _wq.push({
        id: videoId,
        onReady: (video) => {
            Liferay.fire("wistia:ready", { video, videoId });

            video.bind("end", () => {
                Liferay.fire("wistia:video_ended", { video, videoId });
            });
        },
    });
}, 1500);
