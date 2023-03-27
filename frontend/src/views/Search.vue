<template>
  <section>
    <h2 class="search-header">Browse all</h2>
    <div class="categories-container">
      <article
        class="category-container"
        :style="{ backgroundColor: category.color }"
        v-for="(category, idx) in categories"
        :key="idx"
      >
        <article>
          <img :src="category.img" />
          <h2>{{ category.title }}</h2>
        </article>
      </article>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {},
  computed: {
    categories() {
      return this.$store.getters.searchStations
    },
  },
}
</script>
