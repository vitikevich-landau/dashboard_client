<template>
  <div id="app">
    <!-- Контент разбит на 2 row, т.к. содержимое первого row логически не связано с контентом второго row -->
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
        <h3>{{recordsCount}} - {{ selectedYears }}</h3>
      </div>
    </div>
    <br>
  </div>
</template>

<script>

  // import HelloWorld from '@/charts/HelloWorld.vue'
  import ReactiveBarChart from "@/components/charts/ReactiveBar";
  import store from '@/store';
  import { mapActions, mapGetters } from 'vuex';
  // eslint-disable-next-line no-unused-vars
  import { COLORS, MONTHS } from "@/configs";
  import chartOptions from '@/components/charts/options';
  import _ from 'lodash';
  import { mergeWithMonths, toRound } from "@/utils/dataSet";

  export default {
    name: 'App',
    store,
    components: {
      ReactiveBarChart
    },
    data() {
      return {
        title: "Dashboard App",
        chartOptions,
        selectedYears: null
      };
    },
    computed: {
      ...mapGetters([
        'dataIsLoaded',
        'accounts',
        'records',
        'recordsCount',
        'years',
        'lastYear',
        'districts',
      ]),
      filtered() {
        return this.records
          .filter(r => r.year === +this.selectedYears)
      },
      grouped() {
        return this.filtered.groupBy(['account', 'month']);
      },
      calculated() {
        const byAccountMonth = this.grouped;

        return _(byAccountMonth)
          .values()
          .map(account =>
            _.map(mergeWithMonths(account), row =>
              _.reduce(row, (acc, r) => toRound(acc + r.amount), 0)
            )
          )
          .value();
      },
      chartData() {
        const prepared = this.calculated;

        const chartData = {
          labels: _.values(MONTHS)
        };

        const colors = _.values(COLORS);

        const datasets = _.map(this.accounts, (a, i) =>
          ({data: prepared[i], label: a, backgroundColor: colors[i]})
        ) ;

        return {...chartData, datasets};
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
