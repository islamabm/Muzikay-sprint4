<!-- ref="youtubePlayer"
video-id="RjrA-slMoZ4"
:player-vars="playerVars"
:api-key="API_KEY"
@ready="onPlayerReady"
@state-change="onPlayerStateChange" -->

  <template>
    <div>
      <YouTube 
        src="https://www.youtube.com/watch?v=jNQXAC9IVRw" 
        @ready="onReady"
        ref="youtube" />

      <div class="control-buttons">
          <button >🔀</button>
          <button >👈</button>
          <button @click="playAudio">Play</button>
          <button @click="pauseAudio">Pause</button>
          <button >👉</button>
          <button >🔁</button>
      </div>
      <div class="music-bar">
        <span>0:00</span>
        <div class="progress-bar">

        </div>
        <span>4:51</span>
      </div>
    </div>
  </template>
  
  <script>
  import YouTube from 'vue3-youtube'
  export default {
    components: {
        YouTube,
    },
    data() {
      return {
        player: null,
        audio: new Audio(),
        playerVars: {
          autoplay: 0,
          mute: 1,
        },
        API_KEY: 'AIzaSyCscIfKwq9Of8nNDj5BpdSTPiMvVebphhg'
      }
    },
    methods: {
        onReady() {
            console.log('got in');
            this.$refs.youtube.playVideo()
        },
    //   onPlayerReady(event) {
    //     console.log('ready!');
    //     this.player = event.target
    //     this.audio.src = `https://www.youtube.com/watch?v=${this.player.getVideoData().video_id}`
    //     this.audio.load()
    //   },
      onPlayerStateChange(event) {
        if (event.data === window.YT.PlayerState.PLAYING) {
          setInterval(() => {
            this.audio.currentTime = this.player.getCurrentTime()
          }, 1000)
        }
      },
      playAudio() {
        this.player.playVideo()
        this.audio.play()
      },
      pauseAudio() {
        this.player.pauseVideo()
        this.audio.pause()
      },
    },
    created() {
        
    }
  }
  </script>