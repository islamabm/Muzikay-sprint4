<template>
    <footer class="main-footer">
        
        <div v-if="song" class="footer-details">
            <img src="{{ song.img }}">
            <div>{{ song.title }}</div>
        </div>
        <div class="footer-media-player"><FooterPlayer/></div>
        <div class="footer-media-adjusments">alo</div>
    </footer>   
</template>

<script>
import FooterPlayer from './FooterPlayer.vue';
export default {
    name:'AppFooter',
    props: [],
    data() {return {
      song: null,
    }},
    created() {
        this.$store.dispatch({ type: 'loadStations' })
        this.song = this.stations
    },
  methods: {},
  computed: {
    stations() {
        // console.log(this.$store.getters.stations[0].songs[0].imgUrl);
        this.song = {
            // img: this.$store.getters.stations[0].songs[0].imgUrl,
            // title: this.$store.getters.stations[0].songs[0].title
        }
    //   return this.$store.getters.stations[0].songs[0].imgUrl
    return this.song
    },
  },
  components:{
    FooterPlayer,
  },
}
</script>