<template>
  <div :hidden="tokenStatus!=='ok'" class="uk-card uk-card-default uk-card-body">
    <span class="uk-card-title">{{ L.registration_for }}</span><br/>
    {{email}}
    <div class="uk-margin">
      <input  :class="requiredClass(password, 8)" type="password" v-model="password"
      :placeholder="L.enter_password" @keyup.enter="register()"/>
    </div>
    <div class="uk-margin">
      <input  :class="sameAsClass(password, passwordConfirmation)" type="password"
    v-model="passwordConfirmation" :placeholder="L.enter_password_confirmation"
    @keyup.enter="register()"/>
    </div>
    <div class="uk-margin">
      <button :hidden="!valid" class="uk-button uk-button-primary" @click="register()">
        {{ L.register }}
      </button>
    </div>
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
    this.authCheckToken(token).then((response) => {
      if (response.data.status === 'ko') {
        this.displayError(response.data.message);
        this.tokenStatus = 'ko';
      } else {
        this.email = response.data.login;
        this.tokenStatus = 'ok';
      }
    }).catch(() => this.displayError('error_unexpected'));
  },
  methods: {
    // Registers user
    register() {
      if (this.valid) {
        const token = this.$route.params.token;
        this.authRegister(token, this.password).then((response) => {
          if (response.data.status === 'ko') {
            this.displayError(response.data.message);
          } else {
            this.navigate({ name: 'SignIn' });
            this.displayInfo('register_ok');
            this.authGetUserInfo();
          }
        }).catch(() => this.displayError('error_unexpected'));
      }
    },
  },
  computed: {
    valid() {
      return this.password === this.passwordConfirmation
        && this.authIsPasswordValid(this.password);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
