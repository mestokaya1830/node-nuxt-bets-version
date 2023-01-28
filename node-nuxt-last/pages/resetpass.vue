<template>
  <div class="resetpass-page">
    <transition name="slayt" appear>
      <form class="resetpass-form" @submit.prevent="resetPass">
        <header class="login-header">
          <h2 class="logo-login">Logo</h2>
        </header>
        <div class="login-center">
          <input
            v-model="setPass.user"
            type="text"
            class="login-inputs"
            required
            pattern="^[A-Za-z0-9].{3,50}"
            oninvalid="this.setCustomValidity('Üye alanı en az 4 karekter ilk karekter Harf yada Sayı olmalıdır!')"
            oninput="setCustomValidity('')"
            placeholder="Üye Adı"
          />
          <input
            v-model="setPass.nick"
            type="text"
            class="login-inputs"
            required
            pattern="^[A-Za-z0-9].{3,50}"
            oninvalid="this.setCustomValidity('Nick alanı en az 4 karekter ilk karekter Harf yada Sayı olmalıdır!')"
            oninput="setCustomValidity('')"
            placeholder="Nick"
          />
          <input
            v-model="setPass.pass"
            type="password"
            class="login-inputs"
            required
            pattern=".{4,}"
            oninvalid="this.setCustomValidity('Şifre en az 4 karekter olmalıdır!')"
            oninput="setCustomValidity('')"
            placeholder="Yeni Şifre"
          />
          <input
            v-if="isBtnLogin"
            type="submit"
            value="Şifre Sıfırla"
            class="alert btn-alert"
            id="login-btn"
          />
          <alert v-if="alert" :message="alert" class="alert" />
          <error v-if="error" :message="error" class="error" />
        </div>
      </form>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Resetpass",
  data() {
    return {
      setPass: {
        user: null,
        nick: null,
        pass: null,
      },
      isBtnLogin: true,
      alert: null,
      error: null,
    };
  },
  methods: {
    async resetPass() {
      await axios.put("/api/resetpass", this.setPass).then((result) => {
        if (result.data.code === 200) {
          this.error = false;
          this.isBtnLogin = false;
          this.alert = result.data.message;
          setTimeout(
            function () {
              this.$router.push("/");
            }.bind(this),
            1000
          );
        } else {
          this.isBtnLogin = false;
          this.error = result.data.message;
          setTimeout(() => {
            this.error = false;
            this.isBtnLogin = true;
          }, 2000);
        }
      });
    },
  },
};
</script>
