<template>
  <div id="app">
    <div class="container-fluid" v-if="dataIsLoaded">

      <!--  Filters -->
      <div class="row col-8">
        <div class="col-md offset-sm-2">
          <label for="year">Год</label>
          <!--          <Multiselect-->
          <!--              required="true"-->
          <!--              id="year"-->
          <!--              :options="VMGroupYear"-->
          <!--              :selected="lastYear"-->
          <!--              select-label="Выбрать"-->
          <!--              selected-label="Выбрано"-->
          <!--              deselectLabel="Удалить"-->
          <!--              :closeOnSelect="false"-->
          <!--              :multiple="true"-->
          <!--              :limit="2"-->
          <!--              :limitText="count => `и ещё ${count}`"-->
          <!--              :searchable="false"-->
          <!--              :group-select="true"-->
          <!--              selectGroupLabel=""-->
          <!--              deselectGroupLabel=""-->
          <!--              group-label="category"-->
          <!--              group-values="years"-->
          <!--              placeholder=""-->
          <!--              v-model="selectedYears"-->
          <!--          />-->

          <!-- Single option for test -->
          <Multiselect
              required="true"
              id="year"
              :options="years"
              :selected="lastYear"
              select-label="Выбрать"
              selected-label="Выбрано"
              deselectLabel="Удалить"
              :searchable="false"
              placeholder=""
              v-model="selectedYears"
          />
          <!-- Single option for test -->

        </div>
        <div class="col-sm">
          <label for="institutions">Учреждение</label>
          <Multiselect
              required="true"
              id="institutions"
              :options="VMGroupInstitutions"
              select-label="Выбрать"
              selected-label="Выбрано"
              deselectLabel="Удалить"
              :closeOnSelect="false"
              :multiple="true"
              :limit="1"
              :limitText="count => `и ещё ${count}`"
              :searchable="false"
              :group-select="true"
              selectGroupLabel=""
              deselectGroupLabel=""
              group-label="category"
              group-values="institutions"
              placeholder=""
              v-model="selectedInstitutions"
          />
        </div>
        <div class="col-sm">
          <label for="districts">Район</label>
          <Multiselect
              required="true"
              id="districts"
              :options="VMGroupDistricts"
              select-label="Выбрать"
              selected-label="Выбрано"
              deselectLabel="Удалить"
              :closeOnSelect="false"
              :multiple="true"
              :limit="1"
              :limitText="count => `и ещё ${count}`"
              :searchable="false"
              :group-select="true"
              selectGroupLabel=""
              deselectGroupLabel=""
              group-label="category"
              group-values="districts"
              placeholder=""
              v-model="selectedDistricts"
          />
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

      <h3>{{({[selectedYears] : filtered.count()})}}</h3>
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
  // eslint-disable-next-line no-unused-vars
  import {COLORS, MONTHS} from "@/configs";
  import _ from 'lodash';
  import {mergeWithMonths, toRound} from "@/utils/dataSet";
  import Multiselect from 'vue-multiselect';

  export default {
    name: 'App',
    store,
    components: {
      BarChart,
      PieChart,
      // eslint-disable-next-line vue/no-unused-components
      Multiselect
    },
    data() {
      return {
        title: "Dashboard App",
        /*
        *   Filters
        * */
        selectedYears: [],
        selectedInstitutions: [],
        selectedDistricts: [],
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
        'institutions'
      ]),

      colors: () => _.values(COLORS),

      /*
      *   VM - vue Multiselect
      * */
      // VMGroupYear() { return [{category: 'Все', years: this.years}]; },
      VMGroupInstitutions() { return [{category: 'Все', institutions: this.institutions}]; },
      VMGroupDistricts() { return [{category: 'Все', districts: this.districts}]; },

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
              backgroundColor: accounts.map((_, i) => this.colors[i]),
              data: reducedTotalAmount
            }
          ]
        };
      },

      filtered() {
        const filtered = this.records
          .filter(r => +this.selectedYears === r.year)
          .filter(r => this.selectedDistricts.includes(r.district))
          .filter(r => this.selectedInstitutions.includes(r.institution));

        console.log(filtered);

        return filtered;

        // return this.records
        //   // .filter(r => this.selectedYears.includes(r.year))
        //   /*
        //   *   For single test
        //   * */
        //   .filter(r => +this.selectedYears === r.year);
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
          ({data: amountByMonths[i], label: a, backgroundColor: this.colors[i]})
        );

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

      // this.selectedYears = [this.lastYear];
      /*
      *   For single test
      * */
      this.selectedYears = this.lastYear;
      this.selectedDistricts = this.districts;
      this.selectedInstitutions = this.institutions;
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
