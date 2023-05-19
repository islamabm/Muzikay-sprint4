<template>
  <div>
    <button @click="logInWithFacebook" class="facebook-signup">
      <div class="btn-logo-container">
        <img class="btn-img" src="./../assets/img/fb-icon.png" alt="Facebook logo" />
        <span>{{ buttonText }}</span>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'FacebookLogin',
  props: {
    context: {
      type: String,
      default: 'signup' // Default context is 'signup'
    }
  },
  computed: {
    buttonText() {
      return this.context === 'signup' ? 'Sign up with Facebook' : 'Log in with Facebook';
    }
  },
  methods: {
    logInWithFacebook() {
      this.loadFacebookSDK(document, 'script', 'facebook-jssdk')
        .then(() => this.initFacebook())
        .then(() => {
          window.FB.login((response) => {
            if (response.authResponse) {
              console.log('response.authResponse', response.authResponse)
              window.FB.api('/me?fields=id,name,first_name', (response) => {
                console.log('Successful login for: ', response.name)
                console.log('Successful login for: ', response.id)
                console.log('First name: ', response.first_name)
                const loginCred = {
                  fullname: response.name,
                  username: response.first_name,
                  password: response.id,
                }
                this.$emit('facebook-logged-in', loginCred)
              })
            } else {
              alert('User cancelled login or did not fully authorize.')
            }
          })
        })
      return false
    },

    async initFacebook() {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: '137747352552142',
          cookie: true,
          version: 'v13.0',
        })
      }
    },
    async loadFacebookSDK(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    },
  },
}
</script>
<style>
.button {
  color: white;
  min-width: 150px;
  background-color: #000000a1;
  height: 2.5rem;
  border-radius: 2rem;
  font-weight: 400;
  font-size: 0.8rem;
}
</style>
