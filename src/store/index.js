import Vue from 'vue';
import Vuex from 'vuex';
import { DATA_URL } from "@/configs";
import { fetchData, toRecords } from "@/utils/dataSet";
import { Records } from "@/models/Records";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dataIsLoaded: false,
    records: [],

    /*
    *   Filters
    * */
    filterYears: [],
    filterInstitutions: [],
    filterDistricts: []
  },
  getters: {
    dataIsLoaded: ({dataIsLoaded}) => dataIsLoaded,
    records: ({records}) => records,
    recordsCount: ({records}) => records.count(),

    /*
    *   Filters
    * */
    filterYears: ({filterYears}) => filterYears,
    filterInstitutions: ({filterInstitutions}) => filterInstitutions,
    filterDistricts: ({filterDistricts}) => filterDistricts,


    districts: ({records}) => records.districts,
    institutions: ({records}) => records.institutions,
    accounts: ({records}) => records.accounts,
    years: ({records}) => records.years,
    lastYear: (_, {years}) => years[years.length - 1],
  },
  mutations: {
    setDataIsLoaded: (state, payload) => state.dataIsLoaded = payload,
    setRecords: (state, payload) => state.records = payload,

    /*
    *   Filters
    * */
    setFilterYears: (state, payload) => state.filterYears = payload,
    setFilterInstitutions: (state, payload) => state.filterInstitutions = payload,
    setFilterDistricts: (state, payload) => state.filterDistricts = payload,
  },
  actions: {
    async fetchData({commit}) {
      const workBook = await fetchData(DATA_URL);
      commit('setDataIsLoaded', true);

      const recordsArray = toRecords(workBook);

      const records = new Records(recordsArray);
      commit('setRecords', records);
    }
  }
});