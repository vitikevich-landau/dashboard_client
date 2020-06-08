import Vue from 'vue';
import Vuex from 'vuex';
import {DATA_URL} from "@/configs";
import {fetchData} from "@/utils/dataSet";
import {Records} from "@/models/Records";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    titles: [],
    /*
    *   filters
    * */
    districts: [],
    institutions: [],
    accountingSections: [],
    years: [],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  },
  getters: {
    titles({titles}) { return titles; },
    districts({districts}) { return districts; },
    institutions({institutions}) { return institutions; },
    accountingSections({accountingSections}) { return accountingSections; },
    years({years}) { return years; },
    months({months}) { return months; }
  },
  mutations: {
    setAccountingSections(state, payload) {
      state.accountingSections = payload;
    }
  },
  actions: {
    async fetchData({commit,/* state*/}) {
      const workBook = await fetchData(DATA_URL);
      const accountingSections = workBook.SheetNames
        /*
        *   Drop data update time
        * */
        .slice(0, workBook.SheetNames.length - 1);

      commit('setAccountingSections', accountingSections);

      const [
        buildingsSheetName,
        landsSheetName,
        transportSheetName,
        updateTimeSheetName
      ] = workBook.SheetNames;

      const buildingsSheet = workBook.Sheets[buildingsSheetName];
      const landsSheet = workBook.Sheets[landsSheetName];
      const transportSheet = workBook.Sheets[transportSheetName];
      const updateTimeSheet = workBook.Sheets[updateTimeSheetName];

      console.log(buildingsSheet, landsSheet, transportSheet, updateTimeSheet);

      // const buildings = new Records(buildingsSheet);
      const lands = new Records(landsSheet);

      // console.log(lands.getDistricts());
      console.log(lands);
    }
  }
});