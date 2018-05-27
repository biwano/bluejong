<template>
  <div :hidden="done" class="uk-card uk-card-default uk-card-body">
    <span class="uk-card-title">{{ L.enter_email }}</span>
      <input  :class="emailClass(email)" :placeholder="L.email"
       type="email" v-model="email" @keyup.enter="register()"/>
      <button :hidden="!valid" class="uk-button uk-button-primary button-submit"
        @click="requestRegistration()">
        {{ L.request_registration }}
      </button>

  </div>
</template>

<script>
import AuthMixin from '@/framework/mixins/authMixin';
import FormMixin from '@/framework/mixins/formMixin';

export default {
  name: 'RegistrationRequest',
  mixins: [AuthMixin, FormMixin],
  data() {
    return {
      email: '',
      done: false,
    };
  },
  methods: {
    // Registers user
    requestRegistration() {
      if (this.valid) {
        this.authRequestRegistration(this.email).then((response) => {
          if (response.data.status === 'ko') {
            this.displayError(response.data.message);
          } else {
            this.displayInfo('email_sent');
            this.done = true;
          }
        }).catch(() => this.displayError('error_unexpected'));
      }
    },
  },
  computed: {
    valid() {
      return this.authIsEmailValid(this.email);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
