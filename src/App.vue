<template>
  <div id="app">
    <!-- Контент разбит на 2 row, т.к. содержимое первого row логически не связано с контентом второго row -->
    <!--
      Need preloader
    -->
    <div class="row" v-if="dataIsLoaded">
      <div class="col-2">
        <label>
          <select class="custom-select" v-model="selectedYears">
            <option
                v-for="year in years" :key="year">{{year}}</option>
          </select>
        </label>
      </div>
      <div class="col-lg-12">
        <ReactiveBarChart
            :chart-data="chartData"
            :options="chartOptions"
            :height="160"
        />
        <h3>{{selectedYears}} - {{ recordsCount }}</h3>
      </div>
      <!--      <div class="col-lg-8">-->
      <!--        <ReactiveBarChart :chart-data="chartData" :options="chartOptions"/>-->
      <!--      </div>-->
      <!--      <div class="col-lg-8">-->
      <!--        <ReactiveBarChart :chart-data="chartData" :options="chartOptions"/>-->
      <!--      </div>-->
    </div>
    <br>
  </div>
</template>

<script>

  // import HelloWorld from '@/charts/HelloWorld.vue'
  import ReactiveBarChart from "@/components/charts/ReactiveBar";
  import store from '@/store';
  import {mapActions, mapGetters} from 'vuex';
  import {COLORS, MONTHS} from "@/configs";
  import chartOptions from '@/components/charts/options';

  export default {
    name: 'App',
    store,
    components: {
      ReactiveBarChart
    },
    data() {
      // console.log(this.$store.getters.lastYear);
      return {
        title: "Dashboard App",
        chartData: {},
        chartOptions,
        selectedYears: undefined
      };
    },
    computed: {
      ...mapGetters([
        'test',
        'account',
        'records',
        'recordsCount',
        'dataIsLoaded',
        'years',
        'lastYear',
        'districts',
      ]),
    },
    methods: {
      ...mapActions(['fetchData']),
      setupChart() {




        this.chartData = {
          labels: Object.values(MONTHS),

          datasets: [
            {
              data: [130, 47, 44, 38, 27, undefined, 0, 39],
              backgroundColor: COLORS.blue,
            },
            {
              data: [10, 12, 7, 5, 1],
              backgroundColor: COLORS.green,
            },
            {
              data: [17, 11, 22, 18, 12],
              backgroundColor: COLORS.red,
            }
          ],
        };

        this.account.forEach((v, i) =>
          this.chartData.datasets[i].label = v
        );
      }
    },
    async mounted() {
      /*
      *   waiting for download
      * */
      await this.$store.dispatch('fetchData');

      this.setupChart();
      this.selectedYears = this.lastYear;

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
