<template>
  <div class="row col-6 offset-1">
    <div class="col">
      <Districts/>
    </div>
    <div class="col">
      <Institutions/>
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

  export default {
    name: "FiltersContainer",
    components: {
      Districts,
      Institutions,
      Years
    }
  }
</script>

<style scoped>

</style>