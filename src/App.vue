<template>
  <div id="app">
    <HelloWorld :msg="title"/>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import { fetchXLSXDataMixin } from "@/mixins/fetchXLSXDataMixin";

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mixins: [fetchXLSXDataMixin],
  data() {
    return {
      title: "Dashboard App"
    };
  },
  mounted() {
    this.fetchData();
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
