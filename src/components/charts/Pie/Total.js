import {Doughnut, mixins} from "vue-chartjs";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { paddingBetweenPlugin } from "@/components/charts/plugins";

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
              weight: 'bold',
              size: 13
            },
            color: 'black',
            // align: 'start',
            // anchor: 'end',
            rotation: 10,
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
            formatter(value, context) {
              const data = context.chart.data.datasets[0].data;
              const sum = data.reduce((acc, v) => acc + v, 0);

              console.log(context);

              const v = Number((value / sum) * 100).toFixed(2);
              if (context.dataIndex % 2 === 0) {
                return `${"\t".repeat(3)}${v}%`;
              } else {
                return `${"\n".repeat(2)}${v}%`;
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    this.addPlugin(paddingBetweenPlugin);
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  }
};