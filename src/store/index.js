import Vue from 'vue';
import Vuex from 'vuex';
import {DATA_URL} from "@/configs";
// eslint-disable-next-line no-unused-vars
import {fetchData, getNecessarySheetNames, gt} from "@/utils/dataSet";
import {mergeRecords, Records} from "@/models/Records";

// eslint-disable-next-line no-unused-vars
import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
    records: ({records}) => records,
    // totalAmountMonths: ({records}) => records,
    // totalAmountYears: ({records}) => records,

    districts: ({districts}) => districts,
    institutions: ({institutions}) => institutions,
    accountingSections: ({accountingSections}) => accountingSections,
    years: ({years}) => years,
  },
  mutations: {
    setRecords: (state, payload) => state.records = payload,

    setDistricts: (state, payload) => state.districts = payload,
    setInstitutions: (state, payload) => state.institution = payload,
    setAccountingSections: (state, payload) => state.accountingSections = payload,
    setYears: (state, payload) => state.years = payload
  },
  actions: {
    async fetchData({commit,/* state*/}) {
      const workBook = await fetchData(DATA_URL);

      commit('setAccountingSections', getNecessarySheetNames(workBook));

      const [
        buildingsSheetName,
        landsSheetName,
        transportSheetName,
        updateTimeSheetName
      ] = workBook.SheetNames;

      const buildingsSheet = workBook.Sheets[buildingsSheetName];
      const landsSheet = workBook.Sheets[landsSheetName];
      const transportSheet = workBook.Sheets[transportSheetName];
      // eslint-disable-next-line no-unused-vars
      const updateTimeSheet = workBook.Sheets[updateTimeSheetName];

      // console.log(buildingsSheet, landsSheet, transportSheet, updateTimeSheet);

      /*
      *   Add sheetName key
      * */
      // eslint-disable-next-line no-unused-vars
      const buildings = new Records(buildingsSheet);
      buildings.add({accountingSection: buildingsSheetName});

      const transport = new Records(transportSheet);
      transport.add({accountingSection: transportSheetName});

      // eslint-disable-next-line no-unused-vars
      const lands = new Records(landsSheet);
      lands.add({accountingSection: landsSheetName});

      const allRecords = mergeRecords(lands, transport, buildings);
      commit('setRecords', allRecords);

      const years = allRecords.years();
      commit('setYears', years);

      const districts = allRecords.districtsUniq();
      commit('setDistricts', districts);

      const institutions = allRecords.institutionUniq();
      commit('setInstitutions', institutions);

      // console.log(allRecords.filter(r => institutions.includes(r.institution)));

      console.log(
        _.chain(allRecords.records)
          .filter(r => r.accountingSection === landsSheetName)
          .groupBy(r => r.institution)
          .mapValues((rs, k) => [
              k,
              rs.reduce((acc, r) => _.round(acc + r.amount, 2), 0),
              rs.map(r => r.toHumanDate()),
              rs.map(r => r.amount)
            ]
          )
          .orderBy(r => r[1], ['desc'])
          .value()
      )

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