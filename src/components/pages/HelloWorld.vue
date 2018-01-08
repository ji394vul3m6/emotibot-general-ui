<template>
  <div class="hello">
    <h1>Hello, {{ robotName }} in {{ enterpriseName }}</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HelloWorld',
  computed: mapGetters([
    'robotName',
    'enterpriseName',
  ]),
  data() {
    return {
      msg: '',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
h1, h2 {
  font-weight: bold;
  font-size: 24px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
