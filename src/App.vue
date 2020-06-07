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
  import {mapActions, mapGetters} from 'vuex';
  import {COLORS} from "@/configs";

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
              // display: false
            }]
          },
          animation: {
            duration: 450
          }
        }
      };
    },
    computed: {
      ...mapGetters(['months'])
    },
    methods: {
      ...mapActions(['fetchData']),
      setupChart() {
        this.chartData = {
          labels: this.months,
          datasets: [
            {
              label: "Bad Style",
              data: [40, 47, 44, 38, 27],
              backgroundColor: COLORS.blue,
              // borderColor: COLORS.red,
              // hoverBackgroundColor: "#7E57C2",
              // hoverBorderWidth: 0
            },
            {
              label: "Warning",
              data: [10, 12, 7, 5, 4],
              backgroundColor: COLORS.green,
              // hoverBackgroundColor: "#FFCA28",
              // hoverBorderWidth: 0
            },
            {
              label: "Error",
              data: [17, 11, 22, 18, 12],
              backgroundColor: COLORS.grey,
              // hoverBackgroundColor: "#EF5350",
              // hoverBorderWidth: 0
            }
          ],
        };
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
