<template>
 <div class="uk-card uk-card-default uk-card-body">
    <span class="uk-card-title">{{ L.profile }}</span><br/>
    <div :hidden="!loggedIn">
      <div class="uk-margin">
        {{login}}
      </div>
      <hr/>
      <!-- Name -->
      <div class="uk-margin">
        {{L.name}}<input  type="text" v-model="name"
        class="uk-input"
        data-validation-definition="validateRequired(name)"
        @update:value="setDirty()"
        :placeholder="L.enter_name" @keyup.enter="save()"/>
      </div>
      <!-- Save on button -->
      <div class="uk-margin">
        <button :disabled="!dirty" class="uk-button uk-button-primary" @click="save()">
          {{ L.save }}
        </button>
      </div>
      <hr/>
      <!-- Danger zone on button -->
      <div class="uk-margin">
        <button :hidden="dangerZone" class="uk-button uk-button-danger"
          @click="dangerZone = true">
          {{ L.profile_danger }}
        </button>
      </div>
      <!-- Danger zone -->
      <div :hidden="!dangerZone">
        <!-- Danger zone off button -->
        <div class="uk-margin">
          <button class="uk-button uk-button-primary" @click="dangerZone = false">
            {{ L.profile_safe }}
          </button>
        </div>
        <!-- Delete account button -->
        <div class="uk-card uk-card-secondary uk-card-body" >
          <div :hidden="!dangerZone" class="uk-margin">
            <button class="uk-button uk-button-danger" @click="anonymizeProfile()">
              {{ L.profile_anonymize }}
            </button>
          </div>
          <ul>
            <li>{{ L.profile_anonymize_info_1 }}</li>
            <li>{{ L.profile_anonymize_info_2 }}</li>
            <li>{{ L.profile_anonymize_info_3 }}</li>
          </ul>
        </div>
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
      dangerZone: false,
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
    anonymizeProfile() {
      this.authAnonymizeProfile().then((response) => {
        if (response.data.status === 'ko') {
          this.displayError(response.data.message);
        } else {
          this.navigate({ name: 'Home' });
          this.authGetUserInfo();
        }
      }).catch(() => this.displayError('error_unexpected'));
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
