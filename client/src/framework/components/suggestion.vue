<template>
  <div>
    <input class="uk-input" type="text" v-model="query"
      v-on:input="queryUpdated($event.target.value)"
      v-on:focus="dropdown=true;inputlock=true;"
      v-on:blur="inputlock=false;dropdownOff()"
      :placeholder="placeholder"
      ref="input"/>
    <div :class="{ 'uk-dropdown':true, 'uk-open': (dropdown && suggestions.length>0) }"
      ref="dropdown"
      v-on:mouseover="droplock=true;"
      v-on:mouseleave="droplock=false;dropdownOff();">
          <div v-for="suggestion in suggestions" :key="suggestion.id"
              v-on:click="notify(suggestion.value)">
          <button class="uk-button uk-button-default suggestion">
              {{ suggestion.display }}
          </button>
          </div>
    </div>
    <a v-if="query !==''"
        class="uk-form-icon-flip uk-display-inline-block"
        uk-icon="icon: plus-circle; ratio: 2"
        v-on:click="$emit('create', query)"
        v-on:mouseover="createlock=true;"
        v-on:mouseleave="createlock=false;dropdownOff();">
    </a>
  </div >
</template>

<script>
import debounce from 'lodash.debounce';

export default {
  name: 'Suggestion',
  props: { value: Object,
    suggestions: Array,
    minChars: { type: Number, default: 0 },
    placeholder: String,
    createSuggestion: Function,
  },
  data() {
    return {
      query: '', dropdown: false, droplock: false, inputlock: false, createlock: false,
    };
  },
  created() {
    this.queryUpdated = debounce(this.queryUpdated, 500);
    this.queryUpdated(this.query);
  },
  methods: {
    notify(suggestion) {
      this.$emit('input', suggestion);
    },
    queryUpdated(query) {
      if (query.length >= this.minChars) {
        this.$emit('update:query', query);
      }
    },
    dropdownOff() {
      if (!this.droplock && !this.inputlock && !this.createlock) {
        this.dropdown = false;
        this.$emit('blur');
      }
    },
    focus() {
      this.$nextTick(() => this.$refs.input.focus());
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.suggestion {
  width:100%;
}
</style>
