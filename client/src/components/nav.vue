<template>

  <div uk-sticky="sel-target: .uk-navbar-container;
  cls-active: uk-navbar-sticky; bottom: #transparent-sticky-navbar">

    <nav class="uk-navbar-container" uk-navbar>
      <div class="uk-navbar-left">

          <ul class="uk-navbar-nav">
              <li class="uk-active">
                <a href="#/home">
                  <span class="uk-icon-flip uk-display-inline-block"
                    uk-icon="icon: home; ratio: 2">
                  </span>
                </a>
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
                  <a href="#/home">
                    <span class="uk-icon-flip uk-display-inline-block"
                      uk-icon="icon: menu; ratio: 2">
                    </span>
                  </a>
                  <div class="uk-navbar-dropdown">
                      <ul class="uk-nav uk-navbar-dropdown-nav">
                          <li class="uk-active"><a href="#/games">{{ L.my_games }}</a></li>
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
  mixins: [],
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
