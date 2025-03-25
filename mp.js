const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

const allSongs = [
  {
    id: 0,
    title: "Ore Òfé Shá",
    artist: "Rotimikeys",
    duration: "6:27",
    src: "Rotimikeys - Ore Òfé Shá.mp3",
  },
  {
    id: 1,
    title: "CITY OF GOD ",
    artist: "Dunsin Oyekan",
    duration: "11:07",
    src: "cityofGod.mp3",
  },
  {
    id: 2,
    title: "Jehovah Meliwo",
    artist: "Judikay",
    duration: "4:15",
    src: "Judikay feat. 121Selah - Jehovah 'Meliwo.mp3",
  },
  {
    id: 3,
    title: "THIS NEW YEAR",
    artist: "Mike AbduL ft Emma OMG",
    duration: "4:18",
    src: "THIS NEW YEAR Mike AbduL ft Emma OMG.mp3",
  },
  {
    id: 4,
    title: "MY PRAISE",
    artist: "Gabriel Eziashi",
    duration: "5:10",
    src: "MY PRAISE gabriel eziashi.mp3",
  },
];
const audio = new Audio();
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }
  userData.currentSong = song;
  playButton.classList.add("playing");

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;

  playButton.classList.remove("playing");
  audio.pause();
};

const playNextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];

    playSong(nextSong.id);
  }
};

const playPreviousSong = () => {
  if (userData?.currentSong === null) return;
  else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id);
  }
};

const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
};

const deleteSong = (id) => {
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    pauseSong();
    setPlayerDisplay();
  }

  userData.songs = userData?.songs.filter((song) => song.id !== id);
  renderSongs(userData?.songs);
  highlightCurrentSong();
  setPlayButtonAccessibleText();

  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");

    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];

      renderSongs(sortSongs());
      setPlayButtonAccessibleText();
      resetButton.remove();
    });
  }
};

const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};
const renderSongs = (array) => {
  const songsHTML = array
    .map((song) => {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
      <span class="playlist-song-title">${song.title}</span>
      <span class="playlist-song-artist">${song.artist}</span>
      <span class="playlist-song-duration">${song.duration}</span>
  </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
      <i class="fa-regular fa-circle-xmark"></i>
        </button>
      </li>
      `;
    })
    .join("");

  playlistSongs.innerHTML = songsHTML;
};
const setPlayButtonAccessibleText = () => {
    const song = userData?.currentSong || userData?.songs[0];
  
    playButton.setAttribute(
      "aria-label",
      song?.title ? `Play ${song.title}` : "Play"
    );
  };
  
  const getCurrentSongIndex = () =>
    userData?.songs.indexOf(userData?.currentSong);
  
  playButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
      playSong(userData?.songs[0].id);
    } else {
      playSong(userData?.currentSong.id);
    }
  });
  
  pauseButton.addEventListener("click", pauseSong);
  
  nextButton.addEventListener("click", playNextSong);
  
  previousButton.addEventListener("click", playPreviousSong);
  
  shuffleButton.addEventListener("click", shuffle);
  
  audio.addEventListener("ended", () => {
    const currentSongIndex = getCurrentSongIndex();
    const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;
  
    if (nextSongExists) {
      playNextSong();
    } else {
      userData.currentSong = null;
      userData.songCurrentTime = 0;
      pauseSong();
      setPlayerDisplay();
      highlightCurrentSong();
      setPlayButtonAccessibleText();
    }
  });
  
  const sortSongs = () => {
    userData?.songs.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
  
      if (a.title > b.title) {
        return 1;
      }
  
      return 0;
    });
  
    return userData?.songs;
  };
  
  renderSongs(sortSongs());
  setPlayButtonAccessibleText();
  