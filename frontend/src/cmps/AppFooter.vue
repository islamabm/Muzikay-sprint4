<template>
  <footer class="main-footer">
    <div class="footer-media-player">
      <MediaPlayer :currSongIdx="currSongIdx"/>
    </div>

    <div v-if="station" class="footer-details">
      <img
        class="footer-details-img"
        :src=" currSong.imgUrl ? currSong.imgUrl : youtubeSong.url"
      />
        <!-- :src="
          station.songs[currSongIdx].imgUrl
            ? station.songs[currSongIdx].imgUrl
            : station.songs[currSongIdx].url
        " -->

      <h3 class="footer-details-title">
        <!-- {{ station.songs[currSongIdx].title }} -->
        {{ currSong.title? currSong.title : youtubeSong.title }}
      </h3>
      <button class="footer-like">
        <BubblingHeart
          :songIndex="currSongIdx"
          :liked="station.songs[currSongIdx].liked"
          @toggleLike="toggleSongLike"
        />
      </button>
    </div>

  </footer>
</template>

<script>
import MediaPlayer from './MediaPlayer.vue'
import BubblingHeart from './BubblingHeart.vue'
import { eventBus } from '../services/event-bus.service.js'

export default {
  name: 'AppFooter',
  data() {
    return {
      // songIdx: 0,
      hover: false,
      showModal: false,
      songId: null,
      alive: false,
      youtubeSong: null,
    }
  },
  created() {
    eventBus.on('song-id', (songId) => {

      this.songId = songId
      console.log('songId', songId)
      var delay = songId.delay || 2000
      this.alive = true
      setTimeout(() => {
        this.alive = false
      }, delay)
    })
    eventBus.on('youtube-song', (video) => {
      this.youtubeSong = video
      console.log(this.youtubeSong);
      var delay = video.delay || 2000
      this.alive = true
      setTimeout(() => {
        this.alive = false
      }, delay)
    })
  },
  computed: {
    station() {
      return this.$store.getters.station
    },
    currSong() {
      return this.station.songs.find(s => s.id === this.songId)
    },
    currSongIdx() {
      if(!this.station) return
      return this.station.songs.findIndex(s => s.id === this.songId)

    }
  },
  methods: {
    // getSongIdx(songIdx) {
    //   this.songIdx = songIdx
    // },
    getSvg(iconName) {
      return SVGService.getSpotifySvg(iconName)
    },
    // Add functionality
    toggleSongLike(idx) {
      // const song = this.station.songs[idx]
      console.log(song)
      console.log('liked')
      // song.liked = !song.liked
      // console.log(
      //   `Song at index ${idx} has been ${song.liked ? 'liked' : 'unliked'}.`
      // )
    },
  },

  components: {
    MediaPlayer,
    BubblingHeart,
  },
}
</script>
