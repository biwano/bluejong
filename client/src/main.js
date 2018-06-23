// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import 'uikit/dist/css/uikit.min.css';
import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import locales from '@/framework/mixins/localesMixin';
import nav from '@/framework/mixins/navMixin';
import messages from '@/framework/mixins/messagesMixin';
import createStore from '@/store/store';
import App from './App';
import Suggestion from './framework/components/suggestion';
import BooleanRadio from './framework/components/booleanRadio';
import Icon from './framework/components/icon';
import router from './router';

// loads the Icon plugin
UIkit.use(Icons);

Vue.config.productionTip = false;
Vue.use(Vuex);
const store = createStore();

Vue.filter('formatDate', value => (value ? moment(String(value)).format('DD MMM YYYY hh:mm') : undefined));
// Injecting mixins
Vue.mixin(locales);
Vue.mixin(nav);
Vue.mixin(messages);

// Importing components globally
Vue.component('suggestion', Suggestion);
Vue.component('icon', Icon);
Vue.component('boolean-radio', BooleanRadio);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
