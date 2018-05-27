<template>
 <div class="uk-card uk-card-default uk-card-body">
    <span class="uk-card-title">{{ L.profile }}</span><br/>
    <div :hidden="!loggedIn">
      {{login}}
      <hr/>
      <div class="uk-margin">
        {{L.name}}<input  :class="requiredClass(name)" type="text" v-model="name"
        @update:value="setDirty()"
        :placeholder="L.enter_name" @keyup.enter="save()"/>
      </div>
      <div class="uk-margin">
        <button :disabled="!dirty" class="uk-button uk-button-primary" @click="save()">
          {{ L.save }}
        </button>
      </div>
    </div>
    <div :hidden="loggedIn">
      {{ L.forbidden_page_not_logged_in }}
    </div>
  </div>

</template>

<script>
import AuthMixin from '@/framework/mixins/authMixin';
import FormMixin from '@/framework/mixins/formMixin';

export default {
  name: 'Profile',
  mixins: [AuthMixin, FormMixin],
  data() {
    return {
      login: '',
      name: '',
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.authGetUserInfo().then(() => {
        this.login = this.userLogin;
        this.name = this.userName;
      });
    },
    // Saves modification to profile
    save() {
      if (this.dirty) {
        this.authUpdateProfile({ name: this.name }).then((response) => {
          if (response.data.status === 'ko') {
            this.displayError(response.data.message);
          } else {
            this.displayInfo('profile_saved');
            this.load();
          }
        }).catch(() => this.displayError('error_unexpected'));
      }
    },
  },
  computed: {
    dirty() {
      return this.name !== this.userName
      && this.name.length > 0;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
