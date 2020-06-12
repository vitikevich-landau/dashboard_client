import Vue from 'vue';
import Vuex from 'vuex';
// eslint-disable-next-line no-unused-vars
import {DATA_URL} from "@/configs";
import {
  fetchData,
  getDistricts,
  getInstitutions,
  getYears, groupBy,
  // eslint-disable-next-line no-unused-vars
  mergeWithMonths,
  toRecords,
  toWorkBookMap
} from "@/utils/dataSet";
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import _ from 'lodash';
// import { Record } from "@/models/Record";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /*
    *   All records
    * */
    records: [],
    /*
    *   Preloader
    * */
    dataIsLoaded: false,
    /*
    *   filters
    * */
    districts: [],
    institutions: [],
    accounts: [],
    years: [],
  },
  getters: {

    records: ({records}) => records,
    recordsCount: ({records}) => records.length,
    dataIsLoaded: ({dataIsLoaded}) => dataIsLoaded,

    districts: ({districts}) => districts,
    institutions: ({institutions}) => institutions,
    accounts: ({accounts}) => accounts,
    years: ({years}) => years,
    lastYear: ({years}) => years[years.length - 1],
  },
  mutations: {
    setRecords: (state, payload) => state.records = payload,
    setDataIsLoaded: (state, payload) => state.dataIsLoaded = payload,

    setDistricts: (state, payload) => state.districts = payload,
    setInstitutions: (state, payload) => state.institution = payload,
    setAccounts: (state, payload) => state.accounts = payload,
    setYears: (state, payload) => state.years = payload
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    async fetchData({commit,/* state*/}) {
      const workBook = await fetchData(DATA_URL);

      // const sheetNames = usedSheetNames(workBook);
      const data = toWorkBookMap(workBook);
      commit('setDataIsLoaded', true);


      const sheetNames = Object.keys(data);

      const records = toRecords(data);
      const years = getYears(records).sort((a, b) => a - b);
      const districts = getDistricts(records);
      const institutions = getInstitutions(records);

      // console.log(years);

      commit('setAccounts', sheetNames);
      commit('setRecords', records);
      commit('setYears', years);
      commit('setDistricts', districts);
      commit('setInstitutions', institutions);

      /*
      *   APPLYING FILTERS
      * */
      // const selectedYears = [2020, 2019, 2017, 2000, 2002];
      const selectedYears = [2018];
      const selectedAccSections = sheetNames;
      const selectedAccDistricts = ["Горно-Алтайск", "Улаганский", "Усть-Канский", "Усть-Коксинский"];
      const selectedInstitutions = ["ДПИ2", "ДПИ3", "ДПИ4", "УСПН_Город", "УСПН_Кокса", "УСПН_Кош_Агач", "УСПН_Майма", "УСПН_Онгудай"];

      // eslint-disable-next-line no-unused-vars
      const filtered = _(records)
        .filter(rec => selectedYears.includes(rec.year))
        .filter(rec => selectedAccSections.includes(rec.account))
        .filter(rec => selectedAccDistricts.includes(rec.district))
        .filter(rec => selectedInstitutions.includes(rec.institution))
        .value();


      console.log(
        groupBy(records, ['serviceType', 'year', 'account'])
      );


      /*
      *   GROUP
      *   group by years -> accountSection -> months
      * */
      // console.log(groupByYear(filtered));
      // console.log(groupByYearAccount(filtered));
      // console.log(groupByYearAccountMonth(filtered))

      // const grouped = groupByYearAccountMonth(filtered);

      /*
      *   prepared data
      *
      * */
      // console.log(
      //   _(_.values(byMonths)[0])
      //     .map(row =>
      //       row
      //         ? row.reduce((acc, rec) => toRound(acc + rec.amount), 0)
      //         : undefined
      //     )
      //     .value()
      // );

      /*
      *   GROUPINGS
      * */
      // console.log(
      //   _(records)
      //     .groupBy(rec => rec.accountingSection)
      //     // .mapValues(
      //     //   row => row.reduce(
      //     //     (acc, rec) => toRound(acc + rec.amount), 0)
      //     .mapValues(section =>
      //       _(section)
      //         .groupBy(rec => rec.date.getFullYear())
      //         .mapValues(rec =>
      //           _.groupBy(rec, r => r.date.getMonth())
      //         )
      //         /*
      //         *   pad missing months values with undefined
      //         * */
      //         .mapValues(rec => _.merge(_.zipObject(_.keys(MONTHS)), rec))
      //         .value()
      //     )
      //     .value()
      // );


      // console.log(
      //  records.filter(r => r.date.getFullYear() !== 2014)
      // )

      // console.log(
      //   _.chain(allRecords.records)
      //     .filter(r => r.accountingSection === landsSheetName)
      //     .groupBy(r => r.institution)
      //     .mapValues((rs, k) => [
      //         k,
      //         rs.reduce((acc, r) => _.round(acc + r.amount, 2), 0),
      //         rs.map(r => r.toHumanDate()),
      //         rs.map(r => r.amount)
      //       ]
      //     )
      //     .orderBy(r => r[1], ['desc'])
      //     .value()
      // )

      // console.log(lands.groupByMonths());

      // console.log(lands.groupByYears());
      // console.log(lands.groupByMonths());

      // const detalization = _.chain(allRecords.records)
      //   // .filter(r => r.accountingSection === landsSheetName)
      //   .groupBy(r => r.institution)
      //   .mapValues(
      //     (rs, k) => [
      //       k,
      //       rs.reduce((acc, r) => _.round(acc + r.amount, 2), 0),
      //       [...new Set(rs.map(r => r.district))][0],
      //     ]
      //   )
      //   .map(r => r)
      //   .value();
      //
      //
      // console.log(detalization);
    }
  }
});