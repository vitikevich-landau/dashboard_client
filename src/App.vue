<template>
  <div id="app">
    <div class="container-fluid" v-if="dataIsLoaded">

      <!--  Filters -->
      <div class="row col-8">
        <div class="col-md offset-sm-2">
          <FilterDistricts/>
        </div>
        <div class="col-sm">
          <FilterInstitutions/>
        </div>
        <div class="col-sm">
          <!-- Single option for test -->
          <FilterYears/>
          <!-- Single option for test -->
        </div>
      </div>
      <!--  Filters -->

      <div class="row chart-section">
        <div class="col-lg-9">
          <BarChart
              :chart-data="chartData"
          />
        </div>
        <!--<div class="col-lg-4">
          <BarChart
              :chart-data="chartData"
          />
        </div>-->
        <!--  <div class="col-lg-3">
            <BarChart
                :chart-data="chartData"
            />
          </div>-->
        <div class="col-lg-3">
          <PieChart
              :chart-data="pieChartData"
          />
        </div>
      </div>

      <h3>{{({[filterYears] : filtered.count()})}}</h3>
    </div>
    <!-- end -->
    <br>
  </div>
</template>

<script>
  import BarChart from "@/components/charts/Bar/Bar";
  import PieChart from "@/components/charts/Pie/Total";
  import store from '@/store';
  import {mapActions, mapGetters} from 'vuex';
  import {COLORS, MONTHS} from "@/configs";
  import _ from 'lodash';
  import {mergeWithMonths, toRound} from "@/utils/dataSet";

  import FilterYears from '@/components/filters/Years';
  import FilterInstitutions from '@/components/filters/Institutions';
  import FilterDistricts from '@/components/filters/Districts';

  export default {
    name: 'App',
    store,
    components: {
      BarChart,
      PieChart,
      FilterYears,
      FilterInstitutions,
      FilterDistricts
    },
    data() {
      return {
        title: "Dashboard App",
      };
    },
    computed: {
      ...mapGetters([
        'dataIsLoaded',
        'records',
        'recordsCount',

        'filterYears',
        'filterInstitutions',
        'filterDistricts'
      ]),

      chartColors: () => _.values(COLORS.chart),
      chartBorderColors: () => _.values(COLORS.chartBorder),

      /*
      *   Total chart
      * */
      pieChartData() {
        const groupByAccount = this.filtered.groupBy(['account']);
        const reducedTotalAmount = _.values(groupByAccount)
          .map(row => _.reduce(row, (acc, rec) =>
              toRound(acc + rec.amount), 0
            )
          );

        const accounts = _.keys(groupByAccount);

        return {
          hoverBackgroundColor: COLORS.red,
          labels: accounts,
          datasets: [
            {
              // borderColor: accounts.map((_, i) => this.chartBorderColors[i]),
              borderWidth: 0,
              backgroundColor: accounts.map((_, i) => this.chartBorderColors[i]),
              data: reducedTotalAmount,
              // datalabels: {
              //   labels: {
              //     title: {
              //       color: 'green'
              //     },
              //   },
              // }
            },
          ]
        };
      },

      filtered() {
        const filtered = this.records
          .filter(r => +this.filterYears === r.year)
          .filter(r => this.filterInstitutions.includes(r.institution))
          .filter(r => this.filterDistricts.includes(r.district));

        // console.log(filtered);

        return filtered;

        // return this.records
        //   // .filter(r => this.filterYears.includes(r.year))
        //   /*
        //   *   For single test
        //   * */
        //   .filter(r => +this.filterYears === r.year);
      },
      groupedByAccMonth() {
        return this.filtered.groupBy(['account', 'month']);
      },
      calculated() {
        const grouped = this.groupedByAccMonth;

        const amountByMonths = _(grouped)
          .values()
          .map(account =>
            _.map(mergeWithMonths(account), row =>
              _.reduce(row, (acc, r) => toRound(acc + r.amount), 0)
            )
          )
          .value();

        const accounts = _.keys(grouped);

        return {accounts, amountByMonths};
      },
      chartData() {
        const {accounts, amountByMonths} = this.calculated;

        const chartData = {
          labels: _.values(MONTHS),
        };

        const datasets = _.map(accounts, (a, i) =>
          ({
            data: amountByMonths[i],
            label: a,
            borderColor: this.chartBorderColors[i],
            borderWidth: 1.7,
            backgroundColor: this.chartColors[i]
          })
        );

        return {...chartData, datasets};
      }
    },
    methods: {
      ...mapActions([
        'fetchData',
      ]),
    },
    async mounted() {
      /*
      *   waiting for download
      * */
      await this.$store.dispatch('fetchData');
    }
  }
</script>

<style scoped>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
