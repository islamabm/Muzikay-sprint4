<template>
  <p>
    {{ station.name }}
    <img :src="station.songs[0].imgUrl" />
    <button @click="removeStation(station._id)"></button>
  </p>
</template>

<script>
export default {
  name: 'StationPreview',
  props: {
    station: Object,
  },
}
</script>
