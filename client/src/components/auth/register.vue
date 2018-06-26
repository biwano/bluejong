<template>
  <div :hidden="tokenStatus!=='ok'" class="uk-card uk-card-default uk-card-body">
    <form>
      <div class="uk-margin">
        <span class="uk-card-title">{{ L.registration_for }}</span><br/>
      </div>
      <div class="uk-margin">
        <input  class="uk-input"
        autocomplete="username"
        type="text" v-model="email"
        disabled/>
      </div>
      <div class="uk-margin">
        <input  class="uk-input"
        data-validation-definition="validateMinChars(password, 8)"
        autocomplete="new-password"
        type="password" v-model="password"
        :placeholder="L.enter_password" @keyup.enter="register()"/>
      </div>
      <div class="uk-margin">
        <input  class="uk-input" type="password"
        autocomplete="new-password"
        data-validation-definition="validateEqual(passwordConfirmation, password)"
      v-model="passwordConfirmation" :placeholder="L.enter_password_confirmation"
      @keyup.enter="register()"/>
      </div>
      <div class="uk-margin">
        <button :disabled="!validationStatus.valid"
          class="uk-button uk-button-primary" @click="register()">
          {{ L.register }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import AuthMixin from '@/framework/mixins/authMixin';
import FormMixin from '@/framework/mixins/formMixin';

export default {
  name: 'Register',
  mixins: [AuthMixin, FormMixin],
  data() {
    return {
      password: '',
      passwordConfirmation: '',
      tokenStatus: 'not_loaded',
      email: '',
    };
  },
  created() {
    const token = this.$route.params.token;
    this.messagePromiseCatcher(this.authCheckToken(token).then((data) => {
      this.email = data.login;
      this.tokenStatus = 'ok';
    }));
  },
  methods: {
    // Registers user
    register() {
      if (this.validationStatus.valid) {
        const token = this.$route.params.token;
        this.messagePromiseCatcher(this.authRegister(token, this.password).then(() => {
          this.displayInfo('register_ok');
          this.authGetUserInfo();
          this.$router.push({ name: 'SignIn' });
        }));
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
