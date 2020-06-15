<template>
  <div>
    <label for="institutions">Учреждения</label>
    <Multiselect
        id="institutions"
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
        group-values="institutions"
        placeholder=""
        v-model="selectedInstitutions"
    />
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';

  import store from '@/store';
  import {mapGetters, mapMutations} from 'vuex';

  export default {
    name: "Institutions",
    store,
    components: {
      Multiselect
    },
    computed: {
      ...mapGetters(['institutions', 'filterInstitutions']),
      selectedInstitutions: {
        get() { return this.filterInstitutions; },
        set(value) { this.$store.commit('setFilterInstitutions', value); }
      },
      group() { return [{category: 'Все', institutions: this.institutions}]; },
    },
    methods: {
      ...mapMutations(['setFilterInstitutions']),
    },
    mounted() {

      this.selectedInstitutions = this.institutions;
    }
  }
</script>

<style scoped>

</style>