import Vue from 'vue';
import Vuex from 'vuex';
// eslint-disable-next-line no-unused-vars
import { DATA_URL, MONTHS } from "@/configs";
import {
  fetchData,
  toWorkBookMap,
  toRecords,
  // eslint-disable-next-line no-unused-vars
  getYears, toRound, getDistricts, getInstitutions, mergeWithMonths
} from "@/utils/dataSet";
// eslint-disable-next-line no-unused-vars
import { mergeRecords, Records } from "@/models/Records";

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
    *   filters
    * */
    districts: [],
    institutions: [],
    accountingSections: [],
    years: [],
  },
  getters: {

    records: ({records}) => records,
    recordsCount: ({records}) => records.length,
    // totalAmountMonths: ({records}) => records,
    // totalAmountYears: ({records}) => records,

    districts: ({districts}) => districts,
    institutions: ({institutions}) => institutions,
    accountingSections: ({accountingSections}) => accountingSections,
    years: ({years}) => years,
    lastYear: ({years}) => years[years.length - 1],
  },
  mutations: {
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
      const years = getYears(records).sort((a, b) => a - b);
      const districts = getDistricts(records);
      const institutions = getInstitutions(records);

      // console.log(years);

      commit('setAccountingSections', sheetNames);
      commit('setRecords', records);
      commit('setYears', years);
      commit('setDistricts', districts);
      commit('setInstitutions', institutions);

      /*
      *   APPLYING FILTERS
      * */
      // const selectedYears = [2020, 2019, 2017, 2000, 2002];
      const selectedYears = [2018];
      const selectedAccSections = ["Участки", "Здания"];
      const selectedAccDistricts = ["Горно-Алтайск", "Улаганский", "Усть-Канский", "Усть-Коксинский"];
      const selectedInstitutions = ["ДПИ2", "ДПИ3", "ДПИ4", "УСПН_Город", "УСПН_Кокса", "УСПН_Кош_Агач", "УСПН_Майма", "УСПН_Онгудай"];

      const filtered = _(records)
        .filter(rec => selectedYears.includes(rec.date.getFullYear()))
        .filter(rec => selectedAccSections.includes(rec.accountingSection))
        .filter(rec => selectedAccDistricts.includes(rec.district))
        .filter(rec => selectedInstitutions.includes(rec.institution))
        .value();


      /*
      *   GROUP
      *   group by years -> accountSection
      * */

      const byYear = _.groupBy(filtered, r => r.year);
      const byMonths = _(byYear)
        .mapValues(row =>
          mergeWithMonths(
            _.groupBy(row, rec => rec.month)
          )
        )
        .value();

      /*
      *   Break Point here prepared data
      *
      * */

      console.log(
        _(_.values(byMonths)[0])
          .map(row => {
              if(row) {
                return row.reduce((acc, rec) => toRound(acc + rec.amount), 0)
              } else {
                return undefined
              }
            }
          )
          .value()
      );
    }
  }
});