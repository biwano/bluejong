<template>

  <div uk-sticky="sel-target: .uk-navbar-container;
  cls-active: uk-navbar-sticky; bottom: #transparent-sticky-navbar">

    <nav class="uk-navbar-container" uk-navbar>
      <div class="uk-navbar-left">

          <ul class="uk-navbar-nav">
              <li :class="classActive('/home')">
                <icon url="#/home" icon="home" :size="2"></icon>
              </li>
          </ul>

      </div>
      <div class="uk-navbar-center">
        <ul class="uk-navbar-nav">
            <li><a href="#/home">{{ L.bluejong }}</a></li>
        </ul>
      </div>
      <div class="uk-navbar-right">

          <ul class="uk-navbar-nav">
              <li>
                <icon icon="menu" :size="2"></icon>
                <div class="uk-navbar-dropdown">
                    <ul class="uk-nav uk-navbar-dropdown-nav">
                        <li class="uk-nav-header">{{ name }}</li>
                        <li class="uk-nav-divider"></li>
                        <li :class="classActive('/games')">
                          <a href="#/games">{{ L.my_games }}</a>
                        </li>
                    </ul>
                </div>
              </li>
          </ul>
      </div>
    </nav>
  </div>

</template>

<script>

export default {
  name: 'Nav',
  data() {
    return {
    };
  },
  computed: {
    name() {
      const type = this.$store.getters['auth/type'];
      const name = this.$store.getters['auth/name'];
      return type === 'guest' ? this.L.guest : name;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
