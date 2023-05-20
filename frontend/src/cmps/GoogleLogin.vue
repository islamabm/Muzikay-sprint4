<template>
  <GoogleLogin :callback="handleGoogleLogin" prompt auto-login>
    <button class="google-signup btn-logo">
      <div class="btn-logo-container">
        <img
          class="btn-img"
          src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png"
          alt="Google logo"
        />
        <span>{{ buttonText }}</span>
      </div>
    </button>
  </GoogleLogin>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    context: {
      type: String,
      default: 'signup', // Default context is 'signup'
    },
  },
  computed: {
    buttonText() {
      return this.context === 'signup'
        ? 'Sign up with Google'
        : 'Sign in with Google'
    },
  },
  methods: {
    async handleGoogleLogin(response) {
      if (response.code) {
        const code = response.code
        try {
          const {
            data: { access_token },
          } = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id:
              '422574143406-8ldr9in53ureob73lgahn6mpjll1n7vp.apps.googleusercontent.com',
            client_secret: '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',
            redirect_uri: 'http://localhost:5173',
            grant_type: 'authorization_code',
          })

          // Use the access token to fetch user data
          const { data: userData } = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
          )
          console.log('userData', userData)

          //   !this.signupCred.fullname ||
          // !this.signupCred.password ||
          // !this.signupCred.username
          const loginCred = {
            fullname: userData.name,
            username: userData.given_name,
            password: userData.id,
          }
          console.log('loginCred', loginCred)

          this.$emit('google-logged-in', loginCred)
        } catch (error) {
          console.error('Error:', error)
        }
      } else {
        console.log('cannot sign in')
        // Handle other response types if needed
      }
    },
  },
}
</script>
