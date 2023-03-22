<template>
  <div id="signup-page">
    <div class="signup-header">
    <img class="spotify-logo" src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Black.png" alt="Spotify Logo">
    <h1>Sign up for free to start listening.</h1>
  </div>


  <div class="social-btns">
  <button class="facebook-signup">
    <div class="btn-logo-container">
  <img class="btn-img"  src="./../assets/imgs/PngItem_1339531.png" alt="Facebook logo">
  <span>Sign up with Facebook</span>
</div>
</button>

<button class="google-signup btn-logo">
  <div class="btn-logo-container">
  <img class="btn-img" src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png" alt="Google logo">
 <span>Sign up with Google</span> 
</div>
</button>
</div>

<div class="separator">
  <span>or</span>
</div>

<h3 class="signup-email-h2">Sign up with your email address</h3>

    <form @submit.prevent="submitForm">
      <div class="form-group" >
        <label for="email">What's your email?</label>
        <input 
         class="square-inputs"
          type="email"
          id="email"
          v-model="email"
          placeholder="Enter your email."
          required
        />
      </div>

      <div class="form-group">
        <label for="confirm-email">Confirm your email</label>
        <input
        class="square-inputs"
          type="email"
          id="confirm-email"
          v-model="confirmEmail"
          placeholder="Enter your email again."
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Create a password</label>
        <input
        class="square-inputs"
          type="password"
          id="password"
          v-model="password"
          placeholder="Create a password."
          required
        />
      </div>

      <div class="form-group">
        <label for="display-name">What should we call you?</label>
        <input
        class="square-inputs"
          type="text"
          id="display-name"
          v-model="displayName"
          placeholder="Enter a display name."
          required
        />
        <small>This appears on your profile.</small>
      </div>

      <div class="form-group">
  <label for="birthdate">What's your date of birth?</label>
  <div class="dates-field">

    <div class="title-date">
    <p>Day</p>
    <input
      class="square-inputs"
      type="number"
      id="day"
      v-model="day"
      min="1"
      max="31"
      placeholder="DD"
      required
    />
  </div>

  <div class="title-date">
    <p>Month</p>
    <select
      class="square-inputs"
      id="month"
      v-model="month"
      required
    >
      <option value="" disabled selected>MM</option>
      <option value="1">January</option>
      <option value="2">February</option>
      <option value="3">March</option>
      <option value="4">April</option>
      <option value="5">May</option>
      <option value="6">June</option>
      <option value="7">July</option>
      <option value="8">August</option>
      <option value="9">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
    </select>
    </div>

    <div class="title-date">
    <p>Year</p>
    <input
      class="square-inputs"
      type="number"
      id="year"
      v-model="year"
      min="1900"
      max="2022"
      placeholder="YYYY"
      required
    />
  </div>
  </div>
</div>



      <div class="form-group">
        <label>What's your gender?</label>
        <div class="gender-container">

        <div class="radio-container">
          <input type="radio" id="male" value="male" v-model="gender" />
          <label for="male">Male</label>
        </div>

        <div class="radio-container">
          <input type="radio" id="female" value="female" v-model="gender" />
          <label for="female">Female</label>
        </div>

        <div class="radio-container">
          <input
            type="radio"
            id="non-binary"
            value="non-binary"
            v-model="gender"
          />
          <label for="non-binary">Non-binary</label>
        </div>

        <div class="radio-container">
          <input type="radio" id="other" value="other" v-model="gender" />
          <label for="other">Other</label>
        </div>

        <div class="radio-container">
          <input
            type="radio"
            id="prefer-not-to-say"
            value="prefer-not-to-say"
            v-model="gender"
          />
          <label for="prefer-not-to-say">Prefer not to say</label>
        </div>

      </div>
    </div>



    <div class="form-group spotify-checks">
  <input type="checkbox" id="news-and-offers" v-model="newsAndOffers" />
  <label for="news-and-offers">
    Please send me news and offers from Spotify
  </label>
</div>

<div class="form-group spotify-checks">
  <input
    type="checkbox"
    id="share-registration-data"
    v-model="shareRegistrationData"
    class="visually-hidden"
  />
  <label for="share-registration-data">
    Share my registration data with Spotify's content providers for
    marketing purposes.
  </label>
</div>


<div class="spotify-links">
<div class="form-group ">
    By clicking on sign-up, you agree to Spotify's
    <a href="#" class="terms-link"> Terms and Conditions of Use</a>.
</div>

<div class="form-group ">
  To learn more about how Spotify collects, uses, shares and protects your personal data, please see
    <a href="#" class="terms-link">Spotify's Privacy Policy</a>.
</div>
</div>



      <button type="submit">Sign up</button>
    </form>

    <div class="login-link">
      Have an account?
      <a href="#">Log in</a>.
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      //don't need all of this, but we'll see what we can do with it
      email: '',
      confirmEmail: '',
      password: '',
      displayName: '',
      day: '',
      month: '',
      year: '',
      gender: '',
      newsAndOffers: false,
      shareRegistrationData: false,
      agreeTerms: false,
    }
  },
  methods: {
    submitForm() {
      console.log('Form submitted')
    },
  },
}
</script>