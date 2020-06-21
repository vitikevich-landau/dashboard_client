<template>
  <div class="row col-8">
    <div class="col">
      <Districts/>
    </div>
    <div class="col">
      <Institutions/>
    </div>
    <div class="col">
      <Accounts/>
    </div>
    <div class="col">
      <!-- Single option for test -->
      <Years/>
      <!-- Single option for test -->
    </div>
  </div>
</template>

<script>
  import Districts from '@/components/filters/Districts';
  import Institutions from '@/components/filters/Institutions';
  import Years from '@/components/filters/Years';
  import Accounts from '@/components/filters/Accounts'

  export default {
    name: "FiltersContainer",
    components: {
      Districts,
      Institutions,
      Accounts,
      Years
    }
  }
</script>

<style scoped>

</style>