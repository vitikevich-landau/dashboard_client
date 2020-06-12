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
                v-for="year in years" :key="year">{{year}}
            </option>
          </select>
        </label>
      </div>
      <div class="col-lg-12">
        <ReactiveBarChart
            :chart-data="chartData"
            :options="chartOptions"
            :height="160"
        />
        <h3>{{selectedYears}} - {{ filteredRecordsCount }}</h3>
        <!--        <pre>{{ grouped }}</pre>-->
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
  import { mapActions, mapGetters } from 'vuex';
  import { COLORS, MONTHS } from "@/configs";
  import chartOptions from '@/components/charts/options';
  // eslint-disable-next-line no-unused-vars
  import _ from 'lodash';
  import { groupByYearAccountMonth, toRound } from "@/utils/dataSet";


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
        chartOptions,
        selectedYears: undefined
      };
    },
    computed: {
      ...mapGetters([
        'accounts',
        'records',
        'recordsCount',
        'dataIsLoaded',
        'years',
        'lastYear',
        'districts',
        // 'totalAmountByAcc'
      ]),
      filteredRecords() {
        return this.records.filter(rec => rec.year === +this.selectedYears)
      },
      filteredRecordsCount() {
        return this.filteredRecords.length;
      },
      grouped() {
        return groupByYearAccountMonth(this.filteredRecords);
      },
      chartData() {
        const year = _.values(this.grouped)[0];
        const accounts = _(year)
          .mapValues(account =>
            _.mapValues(account, row =>
              row
                ? row.reduce((acc, rec) => toRound(acc + rec.amount), 0)
                : undefined
            )
          )
          .value();

        console.log(accounts);

        const datasets = _(accounts)
          .map()
          .map(row => _.values(row))
          .value();

        console.log(datasets);

        /*
        *   need forEach
        * */

        const chartData = {
          labels: Object.values(MONTHS),

          datasets: [
            {
              data: datasets[0],
              backgroundColor: COLORS.blue,
            },
            {
              data: datasets[1],
              backgroundColor: COLORS.green,
            },
            {
              data: datasets[2],
              backgroundColor: COLORS.red,
            }
          ],
        };

        this.accounts.forEach((v, i) =>
          chartData.datasets[i].label = v
        );

        return chartData;
      }
    },
    methods: {
      ...mapActions(['fetchData']),
    },
    async mounted() {
      /*
      *   waiting for download
      * */
      await this.$store.dispatch('fetchData');

      /*
      *   After loaded records
      *   Add default values to select options
      * */
      this.selectedYears = this.lastYear;
      // this.setupChart();
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
