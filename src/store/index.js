import Vue from 'vue';
import Vuex from 'vuex';
import { DATA_URL } from "@/configs";
import { fetchData, getFilteredSheetNames } from "@/utils/dataSet";
import { mergeRecords, Records } from "@/models/Records";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    records: [],
    titles: [],
    /*
    *   filters
    * */
    districts: [],
    institutions: [],
    accountingSections: [],
    years: [],
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

      commit('setAccountingSections', getFilteredSheetNames(workBook));

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

      // eslint-disable-next-line no-unused-vars
      const buildings = new Records(buildingsSheet);
      buildings.add({accountingSections: buildingsSheetName});

      const transport = new Records(transportSheet);
      transport.add({accountingSections: transportSheetName});

      // eslint-disable-next-line no-unused-vars
      const lands = new Records(landsSheet);
      lands.add({accountingSections: landsSheetName});

      const allRecords = mergeRecords(lands, transport, buildings) ;

      const year2020 = allRecords
        .filter(r => r.date.getFullYear() > 2019)
        .filter(r => r.amount < 500)
        /*.filter(r => r.institution.includes('БУ_РПНИ'))*/;

      console.log(year2020);
    }
  }
});