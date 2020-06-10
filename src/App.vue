<template>
  <div id="app">
    <!-- Контент разбит на 2 row, т.к. содержимое первого row логически не связано с контентом второго row -->
    <div class="row">
      <div class="col-lg-12">
        <ReactiveBarChart
            :chart-data="chartData"
            :options="chartOptions"
            :height="160"
        />
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
            duration: 350
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
        'test',
        'accountingSections',
        'records',
        'recordsCount',
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
</style>
