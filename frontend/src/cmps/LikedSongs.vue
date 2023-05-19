<!-- <template>
          <section

        class="songs-list-details"
      >
        <article
          class="song-item"
          v-for="(song, idx) in likedSongsUser"
          :key="idx"
        >
          <div class="img-and-title" @click="songDetails(song, idx)">
            <img
              v-show="activeSongIndex === idx"
              class="song-animation-gif"
              src="../assets/gif/animation.gif"
            />
            <span v-if="activeSongIndex !== idx">{{ idx + 1 }}</span>
            <img
              @click="changeStatus(idx)"
              v-if="song.videoId"
              class="song-img"
              :src="song.url"
            />
            <img
              @click="changeStatus(idx)"
              v-else
              class="song-img"
              :src="song.imgUrl"
            />
            <p
              @click="toggleActiveTitle(idx), changeStatus(idx)"
              class="song-title"
              :class="{ 'active-song': activeTitle === idx }"
            >
            v-bind:class="{ 'active-song': isActive }" 
              {{ song.title }} - {{ song.artist }}
            </p>
          </div>

          <p class="song-album">
            {{ song.album }}
          </p>

          <p class="posted-at">{{ getTimeAgo(new Date(song.addedAt)) }}</p>
          <div class="flex-end list-end">
            <div class="like-song-icon">
              <BubblingHeart
                ref="heart"
                title="heart"
                class="heart-song station-details-heart"
                :class="{ 'hover-effect': clickedHeartIndex !== idx }"
                :songIndex="idx"
                :liked="song.liked"
                @click="addSongToUser(song), onHeartClick(idx)"
              />
            </div>
            <p v-if="song.duration" class="song-duration">
              {{ song.duration }}
            </p>
            <p v-else class="song-duration">1:40</p>
            <div>
              <button
                class="btn-open-modal"
                ref="songButtons"
                @click="toggleSongModal($event, song, idx)"
              >
                <i
                  class="options-song-icon hover-effect"
                  v-html="getSvg('songOptionsIcon')"
                ></i>
              </button>
            </div>
          </div>
        </article>
      </section>
</template>

<script>
import MediaPlayer from './MediaPlayer.vue'
import BubblingHeart from './BubblingHeart.vue'

export default {
  name: 'AppFooter',
  emits: ['songFromYoutube', 'songDetails'],
  data() {
    return {
      hover: false,
      showModal: false,
      song: null,
      alive: false,
      currSong: null,
      songIdx: 0,
    }
  },
  computed: {
    station() {
      return this.$store.getters.station
    },
    stations() {
      return this.$store.getters.stations
    },
    url() {
      return this.currSong.imgUrl
    },
    async getImageUrl() {
      if (this.currSong && this.currSong.imgUrl) {
        return this.currSong.imgUrl
      } else if (this.youtubeSong && this.youtubeSong.url) {
        try {
          const response = await fetch(this.youtubeSong.url)
          const html = await response.text()
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, 'text/html')
          const ogImageUrl = doc
            .querySelector('meta[property="og:image"]')
            .getAttribute('content')
          return ogImageUrl
        } catch (err) {
          console.error(err)
          return 'https://howtodrawforkids.com/wp-content/uploads/2021/10/How-to-draw-a-Pig-Face-for-kindergarten.jpg'
        }
      } else {
        return 'https://howtodrawforkids.com/wp-content/uploads/2021/10/How-to-draw-a-Pig-Face-for-kindergarten.jpg'
      }
    },
  },
  methods: {
    getSongDetails(songDetails) {
      const { idx } = songDetails
      this.songIdx = idx - 1
      // this.currSong = song
      this.currSong = this.station.songs[this.songIdx]
    },
    getSvg(iconName) {
      return SVGService.getSpotifySvg(iconName)
    },
    // Add functionality
    toggleSongLike(idx) {},
  },

  components: {
    MediaPlayer,
    BubblingHeart,
  },
}
</script> -->
