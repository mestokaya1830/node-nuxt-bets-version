<template>
  <div class="error-layout">
    <h1 class="error-code">404</h1>
    <h2 class="error-text">Hatalı İstek!</h2>
  </div>
</template>

<style>
.error-layout{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding-top: 50px;
  background-image: url('../static/img/home.jpg');
  background-position: center;
  background-size: cover;
}
.error-code {
  color: #fff;
  font-size: 120px;
  margin: 20px;
}
.error-text {
  color: #fff;
  font-size: 50px;
}
</style>

