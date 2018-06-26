<template>
  <div :hidden="done" class="uk-card uk-card-default uk-card-body">
    <div class="uk-margin">
      <span class="uk-card-title">{{ L.enter_email }}</span>
    </div>
    <input  class="uk-input"
     data-validation-definition="validateEmail(email)"
     :placeholder="L.email"
     type="email" v-model="email" @keyup.enter="register()"/>
    <button :disabled="!validationStatus.valid"
      class="uk-button uk-button-primary button-submit"
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
      if (this.validationStatus.valid) {
        this.messagePromiseCatcher(this.authRequestRegistration(this.email).then(() => {
          this.displayInfo('email_sent');
          this.done = true;
        }));
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
