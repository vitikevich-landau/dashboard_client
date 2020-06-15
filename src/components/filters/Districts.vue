<template>
  <div>
    <label for="districts">Район</label>
    <Multiselect
        id="districts"
        :options="group"
        select-label="Выбрать"
        selected-label="Выбрано"
        deselectLabel="Удалить"
        :closeOnSelect="false"
        :multiple="true"
        :limit="1"
        :limitText="count => `и ещё ${count}`"
        :searchable="false"
        :group-select="true"
        selectGroupLabel=""
        deselectGroupLabel=""
        group-label="category"
        group-values="districts"
        placeholder=""
        v-model="selectedDistricts"
    />
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';

  import store from '@/store';
  import {mapGetters, mapMutations} from 'vuex';

  export default {
    name: "Districts",
    store,
    components: {
      Multiselect
    },
    computed: {
      ...mapGetters(['districts', 'filterDistricts']),
      selectedDistricts: {
        get() { return this.filterDistricts; },
        set(value) { this.$store.commit('setFilterDistricts', value); }
      },
      group() { return [{category: 'Все', districts: this.districts}]; },
    },
    methods: {
      ...mapMutations(['setFilterDistricts']),
    },
    mounted() {

      this.selectedDistricts = this.districts;
    }
  }
</script>

<style scoped>

</style>