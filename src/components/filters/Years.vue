<template>
  <div>
    <label for="year">Год</label>
    <Multiselect
        id="year"
        :options="years"
        :selected="lastYear"
        select-label="Выбрать"
        selected-label="Выбрано"
        deselectLabel="Удалить"
        :searchable="false"
        placeholder=""
        v-model="selectedYears"
    />
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';

  import store from '@/store';
  import {mapGetters, mapMutations} from 'vuex';

  export default {
    name: "Years",
    store,
    components: {
      Multiselect
    },
    computed: {
      ...mapGetters(['years', 'lastYear', 'filterYears']),
      selectedYears: {
        get() { return this.filterYears; },
        set(value) { this.$store.commit('setFilterYears', value); }
      },
    },
    methods: {
      ...mapMutations(['setFilterYears']),
    },
    mounted() {

      this.selectedYears = this.lastYear;
    }
  }
</script>

<style scoped>

</style>