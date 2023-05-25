<template>
  <section class="song-details-section" :style="bgStyle">
    <div v-if="song" class="song-details-wrapper header-content">
      <img class="station-cover-img" :src="song.imgUrl" alt="Album cover" />
      <div class="song-details-header">
        <h1 :class="stationNameClass">{{ song.title }}</h1>
        <h2 class="song-details-artist">{{ song.artist }}</h2>
        <small>Album: {{ song.album }}</small>
      </div>
    </div>
    <article
      class="song-details-lyrics"
      data-lyrics="
I need a pick me up
A Rollin' Thunder truck
I need a shot of you
A tattooed lady wild
Like a mountain ride
I got a hunger, that's the loving truth
You got a long night coming
And a long night pumping
You got the right position
The heat of transmission
A shot in the dark
Make you feel alright
A shot in the dark
All through the whole night
A shot in the dark
Yeah, electric sparks
A shot in the dark
Beats a walk in the park, yeah
Blast it on the radio
Breaking on the TV show
Send it out on all the wires
And if I didn't know any better
Your mission is to party
'Til the broad daylight
You got a long night coming
And a long night going
You got the right position
The heat of transmission
A shot in the dark
Make you feel alright
A shot in the dark
All through the whole night
A shot in the dark
Yeah, еlectric sparks
A shot in the dark
Beats a walk in the park, yeah
My mission is to hit ignition
A shot in the dark
Make you feel alright
A shot in the dark
All through the whole night
A shot in the dark
Yeah, electric sparks
A shot in the dark
Beats a walk in the park, yeah
A shot in the dark
Ooh, a shot in the dark
A shot in the dark
A shot in the dark
A shot in the dark
Make you feel alright
A shot in the dark
Beats a walk in the park, yeah"
    ></article>
  </section>
</template>

<script>
import { eventBus } from '../services/event-bus.service'
import { storageService } from '../services/async-storage.service'
import { FastAverageColor } from 'fast-average-color'

export default {
  data() {
    return {
      song: storageService.load('song') || '',
      colorCache: {},
      bgStyle: {},
    }
  },

  created() {
    eventBus.on('view-song-details', this.changeSong)
    if (this.song) {
      this.updateImgUrlAndColor(this.song)
    }
  },
  methods: {
    changeSong(song) {
      storageService.store('song', song)
      this.song = storageService.load('song')
      this.updateImgUrlAndColor(this.song)
    },
    updateImgUrlAndColor(song) {
      if (!song) return
      const imgUrl = song.imgUrl
      if (imgUrl !== '') {
        this.getDominantColor(imgUrl)
      }
    },
    async getDominantColor(imageSrc) {
  const cachedColor = this.colorCache[imageSrc];
  if (cachedColor) {
    this.bgStyle = `background: linear-gradient(to bottom, ${cachedColor} 0%, black 30%, ${cachedColor} 70%, black 100%)`;
    return;
  }

  const fac = new FastAverageColor();
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  const corsProxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';
  img.src = corsProxyUrl + encodeURIComponent(imageSrc);
  img.onload = async () => {
    try {
      const color = await fac.getColorAsync(img);
      this.colorCache[imageSrc] = color;
      this.bgStyle = {
        background: `linear-gradient(to bottom, ${color.rgb} 0%, black 30%, black 70%, black 100%)`,
      };
    } catch (e) {
      console.error(e);
    }
  };
}

  },
  computed: {
    stationNameClass() {
      const words = this.song.title.split(' ').length
      if (words <= 3) {
        return 'short-station-name'
      } else if (words <= 5) {
        return 'long-station-name'
      } else {
        return 'huge-station-name'
      }
    },
  },
  watch: {
    song(newSong) {
      this.updateImgUrlAndColor(newSong)
    },
  },
}
</script>
