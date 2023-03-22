<!-- ref="youtubePlayer"
video-id="RjrA-slMoZ4"
:player-vars="playerVars"
:api-key="API_KEY"
@ready="onPlayerReady"
@state-change="onPlayerStateChange" -->

  <template>
    <div>
      <YouTube hidden
        src="https://www.youtube.com/watch?v=jNQXAC9IVRw" 
        @ready="onReady"
        ref="youtube"/>

      <div class="control-buttons">
          <button >🔀</button>
          <button >👈</button>
          <button @click="playAudio('play')">Play</button>
          <button @click="playAudio('pause')">Pause</button>
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
      }
    },
    methods: {
        onReady() {
            console.log('got in');
            this.$refs.youtube.playVideo()
        },

      playAudio(action) {
        if(action === 'play') this.$refs.youtube.playVideo()
        else this.$refs.youtube.stopVideo()
      },
    },
  }
  </script>