import {Doughnut, mixins} from "vue-chartjs";
import ChartDataLabels from 'chartjs-plugin-datalabels';
// eslint-disable-next-line no-unused-vars
import {COLORS} from "@/configs";

const {reactiveProp} = mixins;

export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  plugins: [ChartDataLabels],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Общий расход'
        },
        tooltips: {
          mode: 'dataset',
          intersect: true
        },
        animation: {
          duration: 450
        },
        plugins: {
          datalabels: {
            font: {
              weight: 'bold'
            },
            color: 'black',
            // align: 'start',
            // anchor: 'end',
            rotation: 15,
            // padding: 20
            // labels: {
            //   title: {
            //     font: {
            //       weight: 'bold'
            //     }
            //   },
            //   value: {
            //     color: 'green'
            //   }
            // }
          }
        }
      }
    }
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  }
};