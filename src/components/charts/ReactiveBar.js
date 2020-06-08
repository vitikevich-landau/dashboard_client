import {Bar, mixins} from "vue-chartjs";
// import ChartDataLabels from 'chartjs-plugin-datalabels';

const {reactiveProp} = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  // plugins: [ChartDataLabels],
  props: ["options"],
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  }
};