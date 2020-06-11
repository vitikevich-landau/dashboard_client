import Vue from 'vue';
import Vuex from 'vuex';
// eslint-disable-next-line no-unused-vars
import { DATA_URL, MONTHS } from "@/configs";
import {
  fetchData,
  // eslint-disable-next-line no-unused-vars
  getYears, toRound, getDistricts, getInstitutions, mergeWithMonths
} from "@/utils/dataSet";
// eslint-disable-next-line no-unused-vars
import { Records } from "@/models/Records";

// eslint-disable-next-line no-unused-vars
import _ from 'lodash';
// import { Record } from "@/models/Record";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /*
    *   All records
    * */
    records: null,
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
    // eslint-disable-next-line no-unused-vars
    recordsCount: (state, getters) => {
      console.log(getters.records.count());
      return 111;
    },

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
      const records = new Records(workBook);
      commit('setRecords', records);

      // console.log(records);

    }
  }
});