<template>
  <div class="error">
    <h1>4😵4</h1>
    <p>
      The page you were looking for was not found.
      <a href="/">Click here to go home</a> or
      <a href="#">Contact Us</a> if you think this might be an error.
    </p>
  </div>
</template>
<style scoped>
.error {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: minmax(400px, 500px);
    grid-template-rows: auto auto 80px;
    place-content: center;
}
h1 {
    font:bold 7em sans-serif;
}
</style>