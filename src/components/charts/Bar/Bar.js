import {Bar, mixins} from "vue-chartjs";
// import ChartDataLabels from 'chartjs-plugin-datalabels';

const {reactiveProp} = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  // plugins: [ChartDataLabels],
  // props: ["options"],
  data() {
    return {
      options: {
        title: {
          display: true,
          text: 'Analytics'
        },
        tooltips: {
          mode: 'index',
          intersect: true
        },
        responsive: true,
        scales: {
          xAxes: [{
            stacked: true,
          }],
          yAxes: [{
            stacked: true,
            display: true
          }]
        },
        animation: {
          duration: 450
        },
        /*plugins: {
          datalabels: {
            color: 'white',
            textAlign: 'center',
            font: {
              weight: "bold",
              size: 14
            }
          }
        }*/
      }
    }
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  }
};