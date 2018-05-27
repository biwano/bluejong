export default {
  methods: {
    // Returns class for a boolean value
    baseClass(boolValue) {
      return {
        'uk-input': true,
        'uk-form-danger': !boolValue,
        //        'uk-form-success': emailOk,
      };
    },
    // Returns class for an email Field
    emailClass(email) {
      return this.baseClass(this.isEmailValid(email));
    },
    // Returns class for a required textfield
    requiredClass(text, minChars_) {
      let minChars = minChars_;
      if (minChars === undefined) minChars = 1;
      const valueOk = text !== undefined && text.length >= minChars;
      return this.baseClass(valueOk);
    },

    // Returns class for fields with same value
    sameAsClass(text1, text2) {
      return this.baseClass(text1 === text2);
    },
    // Checks if an email is valid
    isEmailValid(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
  },
};
