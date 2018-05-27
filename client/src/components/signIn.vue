<template>
  <div class="uk-card uk-card-default uk-card-body">
    <span class="uk-card-title">{{ L.sign_in }}</span><br/>
    <div class="uk-margin">
      <input :class="emailClass(email)" type="email" :placeholder="L.email" v-model="email"
       @keyup.enter="signIn()"/>
    </div>
    <div class="uk-margin">
      <input :class="requiredClass(password,8)" type="password" :placeholder="L.password"
      v-model="password"
       @keyup.enter="signIn()"/>
    </div>
    <div class="uk-margin">
      <button class="uk-button uk-button-primary" @click="signIn()">
        {{ L.sign_in }}
      </button>
    </div>
  </div>
</template>

<script>
import AuthMixin from '@/framework/mixins/authMixin';
import FormMixin from '@/framework/mixins/formMixin';

export default {
  name: 'SignIn',
  mixins: [FormMixin, AuthMixin],
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    // Sign in
    signIn() {
      if (this.valid) {
        this.authSignIn(this.email, this.password).then((response) => {
          if (response.data.status === 'ko') {
            this.displayError(response.data.message);
          } else {
            this.authGetUserInfo();
            this.navigate({ name: 'Home' });
          }
        }).catch(() => this.messagesService.error('error_unexpected'));
      }
    },
  },
  computed: {
    valid() {
      return this.authIsEmailValid(this.email)
        && this.authIsPasswordValid(this.password);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
