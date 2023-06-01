<template>
  <section class="recommendation-modal-backdrop">
    <div class="recommendation-modal">
      <h1>About recommendations</h1>
      <button @click="closeRecoModal">X</button>
      <div class="line"></div>
      <div class="recommendation-modla-text">
        <p>
          Our recommendations help you find audio you'll enjoy, whether that's
          an old favorite or a new song or show you never knew you'd be into.
        </p>

        <p>
          Our editors have extensive knowledge about music and culture, and make
          sure our playlists are created with the best listener experience in
          mind.
        </p>

        <p>
          Our personalized recommendations are tailored to your unique taste,
          taking into account a variety of factors, such as what you're
          listening to and when, the listening habits of people who have similar
          taste in music and podcasts, and the expertise of our music and
          podcast specialists.
        </p>

        <p>
          In some cases, commercial considerations may influence our
          recommendations, but listener satisfaction is our priority and we only
          ever recommend content we think you'll want to hear.
        </p>

        <p>
          Our recommendations rely on signals from you, so keep on listening to
          the songs and podcasts you love!
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    closeRecoModal() {
      this.$emit('closeRecoModal', false)
    },
  },
  computed: {},
}
</script>
<style scoped>
.recommendation-modal-backdrop {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.recommendation-modal {
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  background-color: #333;
  border-radius: 10px;
  height: 320px;
  text-align: left;
  width: 480px;
}

.recommendation-modal h1 {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  padding: 32px 32px 12px;
  color: #fcf9f9;
}

.recommendation-modal button {
  position: absolute;
  top: 0px;
  right: 0px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.recommendation-modal .line {
  width: 100%;
  height: 0.5px;
  background-color: #faf2f2;
}

.recommendation-modla-text {
  padding: 1em;
  overflow-y: auto;
  height: calc(100% - 100px);
}
.recommendation-modla-text p {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  color: #ffffff;
}
</style>
