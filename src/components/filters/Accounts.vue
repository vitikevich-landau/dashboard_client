<template>
  <div>
    <label for="accounts">Раздел учёта</label>
    <Multiselect
        id="accounts"
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
        group-values="accounts"
        placeholder=""
        v-model="selectedAccounts"
    >
      <template slot="selection"
                slot-scope="{ isOpen }">
        <span class="multiselect__single"
              v-if="selectedAccounts.length === accounts.length && !isOpen">
          <strong>Все</strong>
        </span>
      </template>
    </Multiselect>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';

  import store from '@/store';
  import {mapGetters, mapMutations} from 'vuex';

  export default {
    name: "Accounts",
    store,
    components: {
      Multiselect
    },
    computed: {
      ...mapGetters(['accounts', 'filterAccounts']),
      selectedAccounts: {
        get() { return this.filterAccounts; },
        set(value) { this.$store.commit('setFilterAccounts', value); }
      },
      group() { return [{category: 'Все', accounts: this.accounts}]; },
    },
    methods: {
      ...mapMutations(['setFilterAccounts']),
    },
    mounted() {

      this.selectedAccounts = this.accounts;
    }
  }
</script>

<style scoped>

</style>