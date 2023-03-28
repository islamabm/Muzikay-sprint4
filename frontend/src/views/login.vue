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
        To continue, log in to Spotify.
      </p>
      <ul class="btns-container">
        <li class="btn-li">
          <button type="button" class="spotify-login-facebook-btn spotify-btn">
            <span class="login-li-span">
              <svg class="login-li-svg">f</svg>
              Continue With Facebook
            </span>
          </button>
        </li>
        <li class="btn-li">
          <button type="button" class="spotify-login-apple-btn spotify-btn">
            <span class="login-li-span">
              <svg class="login-li-svg">a</svg>
              Continue With Apple
            </span>
          </button>
        </li>
        <li class="btn-li">
          <button type="button" class="spotify-login-google-btn spotify-btn">
            <span class="login-li-span">
              <img
                class="google-img"
                src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png"
              />
              <svg class="login-li-svg"></svg>
              Continue With Google
            </span>
          </button>
        </li>
        <div class="ul-or-div">
          <hr class="ul-btns-hr" />
          <span class="spotify-login-user-content-span">OR</span>
          <hr class="ul-btns-hr" />
        </div>
      </ul>

      <form class="spotify-login-form">
        <div class="spotify-form-group">
          <label class="login-form-labels" for="email"
            >Email address or username</label
          >
          <input
            class="login-form-inputs"
            type="text"
            id="email"
            placeholder="Email address or username"
          />
        </div>
        <div class="spotify-form-group">
          <label class="login-form-labels" for="password">Password</label>
          <input
            class="login-form-inputs"
            type="password"
            id="password"
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
          <button type="submit" class="login-btn">Login</button>
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

<style></style>
