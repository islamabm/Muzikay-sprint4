<template>

    <div class="mini-search-container">
        <h1>Let's find something for your playlist</h1>

        <div class="header-search-container">
            <form class="header-form">
                <div class="svg-header-container">
                <span class="svg-header-span">
                  <i class="header-search-icon" v-html="getSvg('searchIcon')"></i>
                </span>
            </div>
              <input
                class="header-input"
                type="search"
                placeholder="Search for songs or episodes"
                autofocus
              />
            </form>
          </div>
    </div>


</template>

<script>
import SVGService from '../services/SVG.service';

export default {
  name:'',
  props: [],
created() {},
  data() {
    return {}
  },
  methods: {
    getSvg(iconName) {
      return SVGService.getSpotifySvg(iconName)
    },
  },
  computed: {},
components:{
    SVGService,
},
}
</script>
