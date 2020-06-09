<template>
  <div id="app">
    <div class="container">
      <ReactiveBarChart
          :chart-data="chartData"
          :options="chartOptions"
      />
<!--      <p v-for="(year, i) in records" :key="i">-->
<!--        {{ Object.keys(year) }}-->
<!--      </p>-->
      <h2>{{ years }}</h2>
      <h2>{{ districts }}</h2>
    </div>
  </div>
</template>

<script>
  // import {fetchXLSXDataMixin} from "@/mixins/fetchXLSXDataMixin";

  // import HelloWorld from '@/charts/HelloWorld.vue'
  import ReactiveBarChart from "@/components/charts/ReactiveBar";
  import store from '@/store';
  import { mapActions, mapGetters } from 'vuex';
  import { COLORS, MONTHS } from "@/configs";

  export default {
    name: 'App',
    store,
    components: {
      ReactiveBarChart
    },
    data() {
      return {
        title: "Dashboard App",
        chartData: {},
        chartOptions: {
          title: {
            display: true,
            text: 'Chart.js Bar Chart - Stacked'
          },
          tooltips: {
            mode: 'index',
            intersect: false
          },
          responsive: true,
          scales: {
            xAxes: [{
              stacked: true,
            }],
            yAxes: [{
              stacked: true,
              display: false
            }]
          },
          animation: {
            duration: 450
          },
          /*plugins: {
            datalabels: {
              color: 'white',
              textAlign: 'center',
              font: {
                weight: "bold",
                size: 14
              }
            }
          }*/
        }
      };
    },
    computed: {
      ...mapGetters([
        'accountingSections',
        'records',
        'years',
        'districts',
      ])
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

        this.accountingSections.forEach((v, i) =>
          this.chartData.datasets[i].label = v
        );

        /*
        *   В зависимости от выбранных годов, создаём компоненты
        *
        *
        * */

        // const years = [2011, 2001];
        //
        // console.log(
        //   this.records
        //     .filter(rs => years.includes(rs.date.getFullYear()))
        //     .groupByMonths()
        // );

      }
    },
    async mounted() {
      /*
      *   waiting for download
      * */
      await store.dispatch('fetchData');

      this.setupChart();

      // console.log(store.getters.records);
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

  .container {
    margin: 0 auto;
    width: 600px;
  }
</style>
