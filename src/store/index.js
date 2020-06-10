import Vue from 'vue';
import Vuex from 'vuex';
import { DATA_URL } from "@/configs";
// eslint-disable-next-line no-unused-vars
import { fetchData, usedSheetNames, gt, getRows, getRowValue, toWorkBookMap, toRecords, getYears } from "@/utils/dataSet";
// eslint-disable-next-line no-unused-vars
import { mergeRecords, Records } from "@/models/Records";

// eslint-disable-next-line no-unused-vars
import _ from 'lodash';
// import { Record } from "@/models/Record";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    test: null,
    /*
    *   All records
    * */
    records: [],
    /*
    *   filters
    * */
    districts: [],
    institutions: [],
    accountingSections: [],
    years: [],
  },
  getters: {
    test: ({test}) => test,

    records: ({records}) => records,
    recordsCount: ({records}) => records.length,
    // totalAmountMonths: ({records}) => records,
    // totalAmountYears: ({records}) => records,

    districts: ({districts}) => districts,
    institutions: ({institutions}) => institutions,
    accountingSections: ({accountingSections}) => accountingSections,
    years: ({years}) => years,
  },
  mutations: {
    setTest: (state, payload) => state.test = payload,

    setRecords: (state, payload) => state.records = payload,

    setDistricts: (state, payload) => state.districts = payload,
    setInstitutions: (state, payload) => state.institution = payload,
    setAccountingSections: (state, payload) => state.accountingSections = payload,
    setYears: (state, payload) => state.years = payload
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    async fetchData({commit,/* state*/}) {
      const workBook = await fetchData(DATA_URL);

      // const sheetNames = usedSheetNames(workBook);
      const data = toWorkBookMap(workBook);
      const sheetNames = Object.keys(data);

      const records = toRecords(data);
      const years = getYears(records);

      commit('setAccountingSections', sheetNames);
      commit('setRecords', records);
      commit('setYears', years);


      console.log(
       years
      )

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