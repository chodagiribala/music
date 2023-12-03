const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MUSIC_PLAYER_TienHieu";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
    //Lấy ra chỉ mục đầu tiên của mảng
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isNext: false,
    isPrev: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
            name: "mr majnu",
            singer: "ramya NSK",
            path: "https://mp3teluguwap.net/mp3/2019/Mr%20Majnu%20(2019)/Mr%20Majnu%20(2019)%20-%20HQ/Mr.%20Majnu%20-%20SenSongsMp3.Co.mp3",
            image: "https://naasongs.com.co/wp-content/uploads/2018/09/Mr-Majnu-2018jpeg.jpg"
        },
        {
            name: "yemaindo ",
            singer: "armaaan malik",
            path: "https://mp3teluguwap.net/mp3/2019/Mr%20Majnu%20(2019)/Mr%20Majnu%20(2019)%20-%20HQ/Yemainado%20-%20SenSongsMp3.Co.mp3",
            image: "https://i.pinimg.com/originals/6c/d5/ac/6cd5ace0763ad6061d7e08f2ccb4ba87.jpg"
        },
        {
            name: " Koppamga Kopamga Song ",
            singer: "Armaan Malik, S S Thaman",
            path: "https://mp3teluguwap.net/mp3/2019/Mr%20Majnu%20(2019)/Mr%20Majnu%20(2019)%20-%20HQ/Koppamga%20Kopamga%20-%20SenSongsMp3.Co.mp3",
            image: "https://m.media-amazon.com/images/M/MV5BNTYyN2QxOWEtMmI5My00N2VkLWI4MWMtY2NjZDMwNDBmNTMwXkEyXkFqcGdeQXVyNjA1NTcyOTk@._V1_.jpg"
        },
        {
            name: "Naalo Neeku ",
            singer: "Shreya Ghosal, Kaala Bhairava",
            path: "https://mp3teluguwap.net/mp3/2019/Mr%20Majnu%20(2019)/Mr%20Majnu%20(2019)%20-%20HQ/Naalo%20Neeku%20-%20SenSongsMp3.Co.mp3",
            image: "https://files.prokerala.com/movies/pics/800/movie-wallpaper-98094.jpg"
        },
        {
            name: "Hey Nenila Song ",
            singer: "Sruthi Ranjani",
            path: "https://mp3teluguwap.net/mp3/2019/Mr%20Majnu%20(2019)/Mr%20Majnu%20(2019)%20-%20HQ/Hey%20Nenila%20-%20SenSongsMp3.Co.mp3",
            image: "https://1.bp.blogspot.com/-JwshbwDruaE/X8zYs7jqPRI/AAAAAAAADuU/lYX13nSboUIgz48q14yCY4-qs8c-IUUrgCLcBGAsYHQ/s0/HDgallery%2BMr%2BMajnu%2BStills%2B16.jpeg"
        },
        {
            name: "Chiru Chiru Navvula Songs",
            singer: "Tushar Joshi, Koti Saluri, Ramya Behra",
            path: "https://mp3teluguwap.net/mp3/2019/Mr%20Majnu%20(2019)/Mr%20Majnu%20(2019)%20-%20HQ/Chiru%20Chiru%20Navvula%20-%20SenSongsMp3.Co.mp3",
            image: "https://i.pinimg.com/564x/24/3c/54/243c54eb4103db16c6e5d406c7220a9a.jpg"
        },
        {
            name: "Anaganaga Oka Uru ",
            singer: "Sri Dhruthi",
            path: "https://mp3teluguwap.net/hq/2018/Hello%20(2017)/Hello%20(2017)%20-%20128%20Kbps/Anaganaga%20Oka%20Uru%20-%20SenSongsMp3.Co.mp3",
            image: "https://www.cinejosh.com/gallereys/movies/thumb/akhil_hello_movie_stills_1711170158/akhil_hello_movie_stills_1711170158_006.jpg"
        },
        {
            name: "Hello",
            singer: "Armaan Malik",
            path: "https://mp3teluguwap.net/hq/2018/Hello%20(2017)/Hello%20(2017)%20-%20128%20Kbps/Hello%20-%20SenSongsMp3.Co.mp3",
            image: "https://wallpapercave.com/wp/wp4052053.jpg"
        },

    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
    `;
        });
        playlist.innerHTML = htmls.join("");
    },

    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function() {
        const _this = this;


        const cdWidth = cd.offsetWidth;

        //Xử lý  CD quay và dừng
        const cdThumbAnimate = cdThumb.animate(
            [{
                transform: "rotate(360deg)"
            }], {
                duration: 10000, //10 seconds
                itetations: Infinity
            }
        );
        cdThumbAnimate.pause();


        (document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop; //Kích thước cd trừ đi kích thước kéo lên để tính ra kích thước cần giảm

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }),

        (playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        });


        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };


        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };


        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };


        progress.onchange = function(e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        //Xử lý nhấn sẽ active button
        nextBtn.onmousedown = function() {
            _this.isNext = !_this.isNext;
            nextBtn.classList.toggle("active", _this.isNext);
        };
        nextBtn.onmouseup = function() {
            _this.isNext = !_this.isNext;
            nextBtn.classList.remove("active", _this.isNext);
        };

        prevBtn.onmousedown = function() {
            _this.isPrev = !_this.isPrev;
            prevBtn.classList.toggle("active", _this.isPrev);
        };
        prevBtn.onmouseup = function() {
            _this.isPrev = !_this.isPrev;
            prevBtn.classList.remove("active", _this.isPrev);
        };


        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        //Xử lý lặp lại một Song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        //Xử lý next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".options")) {
                //Xử lý click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
                //Xử lý khi click vào song options
                if (e.target.closest(".options")) {}
            }
        };
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }, 100);
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function() {
        this.currentIndex++;

        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM Events)
        this.handleEvents();

        // Tải thông tin bài đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlists
        this.render();

        //Hiển thị trạng thái ban đầu của button
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
};

app.start();