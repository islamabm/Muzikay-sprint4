<template>
  <section class="spotify-login-page">
    <header class="spotify-login-header">
      <div class="black-logo-container">
        <img
          class="black-logo"
          src="./../assets/img/logo-black.png"
          alt="Logo"
        />
        <span class="muzikay-logo">Muzikay</span>
      </div>
    </header>

    <section class="spotify-login-user-content">
      <p class="spotify-login-user-content-header">
        To continue, log in to Muzikay.
      </p>
      <ul class="btns-container">
        <li class="btn-li">
          <button type="button" class="spotify-login-facebook-btn spotify-btn">
            <span class="login-li-span">
              <img class="fb-logo-img" src="./../assets/img/fb-icon.png" />
              Continue With Facebook
            </span>
          </button>
        </li>
        <li class="btn-li">
          <button type="button" class="spotify-login-apple-btn spotify-btn">
            <span class="login-li-span">
              <img class="apple-logo-img" src="./../assets/img/apple.png" />
              Continue With Apple
            </span>
          </button>
        </li>
        <li class="btn-li">
          <button type="button" class="spotify-login-google-btn spotify-btn">
            <img
              class="google-img"
              src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png"
            />
            <span class="login-li-span"> Continue With Google </span>
          </button>
        </li>
        <div class="ul-or-div">
          <hr class="ul-btns-hr" />
          <span class="spotify-login-user-content-span">OR</span>
          <hr class="ul-btns-hr" />
        </div>
      </ul>

      <form class="spotify-login-form" @submit.prevent="doLogin">
        <div class="spotify-form-group">
          <label class="login-form-labels" for="username">Username</label>
          <select
            class="login-form-inputs"
            id="username"
            v-model="loginCred.username"
          >
            <option value="">Select User</option>
            <option
              v-for="user in users"
              :key="user._id"
              :value="user.username"
            >
              {{ user.fullname }}
            </option>
          </select>
        </div>
        <div class="spotify-form-group">
          <label class="login-form-labels" for="password">Password</label>
          <input
            class="login-form-inputs"
            type="password"
            id="password"
            v-model="loginCred.password"
            placeholder="Password"
          />
        </div>
        <div class="spotify-form-forgot">
          <a class="spotify-form-validitions-password">Forgot your password?</a>
        </div>
        <div class="login-container">
          <div class="checkbox-span-container">
            <input type="checkbox" class="checkbox-input" />
            <span class="spotify-form-validitions-Remember">Remember me</span>
          </div>
          <button type="submit" class="login-btn">LOG IN</button>
        </div>
        <hr />
      </form>
      <h2 class="login-page-h2">Don't have an account?</h2>
      <button type="button" class="spotify-login-signup-btn spotify-btn">
        SIGN UP FOR SPOTIFY
      </button>
    </section>
  </section>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      loginCred: { username: '', password: '' },
    }
  },
  computed: {
    users() {
      return this.$store.getters.users
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser
    },
  },
  created() {
    this.loadUsers()
  },
  methods: {
    async doLogin() {
      console.log('this.loginCred', this.loginCred)
      if (!this.loginCred.username || !this.loginCred.password) {
        this.msg = 'Please enter username/password'
        return
      }
      try {
        await this.$store.dispatch({ type: 'login', userCred: this.loginCred })
      } catch (err) {
        console.log(err)
        this.msg = 'Failed to login'
      }
    },
    loadUsers() {
      this.$store.dispatch({ type: 'loadUsers' })
    },
  },
}
</script>
