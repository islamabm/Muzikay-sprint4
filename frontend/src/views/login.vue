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

      <div class="social-btns">
        <FacebookLogin
          @facebook-logged-in="handleSocialLogin"
          :context="'login'"
        ></FacebookLogin>
        <GoogleLogin
          @google-logged-in="handleSocialLogin"
          :context="'login'"
        ></GoogleLogin>
      </div>

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
import FacebookLogin from '../cmps/FacebookLogin.vue'
import GoogleLogin from '../cmps/GoogleLogin.vue'
import { eventBus } from '../services/event-bus.service'
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
        this.$router.push('/station/collection')
        eventBus.emit('user-logged-in')
      } catch (err) {
        console.log(err)
        this.msg = 'Failed to login'
      } finally {
        this.$router.push('/station/collection')
      }
    },
    loadUsers() {
      this.$store.dispatch({ type: 'loadUsers' })
    },
    handleSocialLogin(loginCred) {
      console.log('loginCred', loginCred)
      this.signupCred = loginCred
      this.doLogin()
      this.$router.push('/station/collection')
    },
  },
  components: {
    GoogleLogin,
    FacebookLogin,
  },
}
</script>
