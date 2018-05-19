import en from '@/locales/en';

// Locales object
const locales = {
  $current: 'en',
  $languages: { en },
  $load(languageName) {
    Object.assign(this, this.$languages[languageName]);
  },
};
locales.$load('en');

// Mixin to be imported in Vue
export default {
  created() {
    this.L = locales;
  },
};
