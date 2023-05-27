<template>
  <div>
    <h2>Search Results</h2>
    <ul>
      <li v-for="result in filteredResults">{{ result.title }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      symbols: [
        '!',
        '@',
        '#',
        '$',
        '%',
        '^',
        '&',
        '*',
        '(',
        ')',
        '|',
        '\\',
        '/',
        '-',
        '_',
      ],
    }
  },
  computed: {
    filteredResults() {
      return this.searchResults.map((result) => {
        let title = result.title
        for (let i = 0; i < this.symbols.length; i++) {
          if (title.includes(this.symbols[i])) {
            title = title.replace(new RegExp(this.symbols[i], 'g'), '')
          }
        }
        return { ...result, title }
      })
    },
  },
}
</script>
