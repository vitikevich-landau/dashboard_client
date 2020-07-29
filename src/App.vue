<template>
  <div id="app">
    <div class="container-fluid" v-if="dataIsLoaded">


      <div class="row mb-3">
        <!--  Filters -->
        <Filters/>
        <!--  Filters -->
        <div class="row offset-1">
          <div class="alert font-italic" role="alert">
            Общий расход: <strong>{{ totalAmount }}</strong>
          </div>
        </div>

      </div>


      <div class="row chart-section">
        <div class="col-8">
          <DetailChart
              :chart-data="detailChartData"
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
        <div class="col-3">
          <TotalChart :chart-data="totalChartData"/>
        </div>
        <!--
          Dynamic ...
        -->
        <div class="col-1">
          <div
              class="alert font-italic"
              role="alert"
              v-for="(v, k) in totalAccountsAmount" :key="k">
            {{ v[0] }}: <strong>{{ v[1] }}</strong>
          </div>
        </div>
      </div>

      <h3>{{({[filterYears] : selectedItems.count()})}}</h3>
    </div>
    <div class="spinner-border text-success mt-5" role="status" v-else>
      <span class="sr-only">Loading...</span>
    </div>
    <!-- end -->
    <br>
  </div>
</template>

<script>
  import DetailChart from "@/components/charts/Detail/Detail";
  import TotalChart from "@/components/charts/Total/Total";
  import store from '@/store';
  import { mapActions, mapGetters } from 'vuex';
  import { COLORS, MONTHS } from "@/configs";
  import _ from 'lodash';
  import { mergeWithMonths, toRound } from "@/utils/dataSet";

  import Filters from '@/components/filters/Container';
  import { toColor } from "@/utils/colors";

  export default {
    name: 'App',
    store,
    components: {
      DetailChart,
      TotalChart,
      Filters
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
        'accounts',

        'filterYears',
        'filterInstitutions',
        'filterDistricts',
        'filterAccounts'
      ]),
      totalAmount() {
        return this
          .accountsMonthsAmount
          .amountByMonths
          .reduce((acc, v) =>
            acc + v.reduce((acc, v) => acc + v, 0), 0
          )
          .toLocaleString('ru-RU', {
            style: "currency",
            currency: "RUB"
          });
      },
      totalAccountsAmount() {
        const {accounts, amountByMonths} = this.accountsMonthsAmount;

        return accounts.map((v, i) =>
          [
            v, amountByMonths[i].reduce((acc, v) =>
            acc + v, 0
          ).toLocaleString('ru-RU', {
            style: "currency",
            currency: "RUB"
          })
          ]
        );
      },
      chartColors: () => _.values(COLORS.chart),
      chartBorderColors: () => _.values(COLORS.chartBorder),

      /*
      *   Total chart
      * */
      totalChartData() {
        const groupByAccount = this.selectedItems.groupBy(['account']);
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
              borderWidth: 1,
              backgroundColor: accounts.map(v => toColor(v)),
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
      selectedItems() {
        const filtered = this.records
          .filter(r => +this.filterYears === r.year)
          .filter(r => this.filterInstitutions.includes(r.institution))
          .filter(r => this.filterDistricts.includes(r.district))
          .filter(r => this.filterAccounts.includes(r.account));

        // console.log(filtered);

        return filtered;

        // return this.records
        //   // .filter(r => this.filterYears.includes(r.year))
        //   /*
        //   *   For single test
        //   * */
        //   .filter(r => +this.filterYears === r.year);
      },
      byAccountsMonths() {
        return this.selectedItems.groupBy(['account', 'month']);
      },
      accountsMonthsAmount() {
        const grouped = this.byAccountsMonths;

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
      detailChartData() {
        const {accounts, amountByMonths} = this.accountsMonthsAmount;

        const chartData = {
          labels: _.values(MONTHS),
        };

        const datasets = _.map(accounts, (a, i) =>
          ({
            data: amountByMonths[i],
            label: a,
            borderColor: toColor(a),
            borderWidth: 1.7,
            backgroundColor: toColor(a)
          })
        );

        return {...chartData, datasets};
      }
    },
    methods: {
      ...mapActions([
        'fetchData'
      ]),
    },
    async mounted() {
      /*
      *   remove spinner before fetching data
      * */
      document
        .querySelector('#spinner')
        .remove();

      /*
      *   waiting for download
      * */
      await this.$store.dispatch('fetchData');


      this.$store.commit('setFilterAccounts', this.accounts);
      // console.log(this.fAccounts);
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
    margin-top: 20px;
  }

  .container-fluid {
    min-width: 1366px !important;
  }
</style>
