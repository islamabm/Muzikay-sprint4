<template>
  <nav>
    <div class="sticky-nav">
    <div class="logo-container">
    <img src="https://www.citypng.com/public/uploads/small/11661570403whwxybsmx9s49gydvycyvydsof4sqok0xk0cisomyqi9tvzojomgsfwp1ffra1pqt5ndii64wnwpzmkqsvjr7wkuh3fpukvy2eki.png" alt="Muzikay logo" class="logo">
    <span>Muzikay</span>
  </div>
  <div class="main-nav">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/search">Search</RouterLink>
    <RouterLink to="/library">Your Library</RouterLink>
  </div>

  <div class="liked-create-nav">
    <RouterLink to="/create">Create playlist</RouterLink>
    <RouterLink to="/like">Liked songs</RouterLink>
  </div>
</div>
  </nav>
</template>
<script>
export default {}
</script>
