<template>
  <div id="app">
    <div class="container">
      <ReactiveBarChart
          :chart-data="chartData"
          :options="chartOptions"
      />
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
      ...mapGetters(['months', 'accountingSections'])
    },
    methods: {
      ...mapActions(['fetchData']),
      setupChart() {
        this.chartData = {
          labels: MONTHS,
          datasets: [
            {
              data: [130, 47, 44, 38, 27],
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

      }
    },
    async mounted() {
      /*
      *   waiting for download
      * */
      await store.dispatch('fetchData');

      this.setupChart();
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
    width: 750px;
  }
</style>
