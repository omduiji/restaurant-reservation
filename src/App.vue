<template>
  <div id="app">
    <BranchList />
  </div>
</template>

<script>
import BranchList from './components/BranchList.vue';

export default {
  name: 'App',
  components: {
    BranchList,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  @apply bg-slate-100 ;
}
</style>
