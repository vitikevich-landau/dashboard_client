import {Doughnut, mixins} from "vue-chartjs";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { createPaddingBetweenPlugin } from "@/components/charts/plugins";
import { toLocalCurrency } from "@/utils/currency";

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
        // title: {
        //   display: true,
        //   text: 'Общий расход'
        // },

        tooltips: {
          mode: 'dataset',
          intersect: true,
          callbacks: {
            label: (tooltipItem, data) => {
              const title = data.labels[tooltipItem.index];
              const value = data.datasets[tooltipItem.datasetIndex]
                .data[tooltipItem.index];

              return `${title}: ${toLocalCurrency(value)}`;
            }
          }
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
            rotation: 5,
            formatter(value, context) {
              const data = context.chart.data.datasets[0].data;
              const sum = data.reduce((acc, v) => acc + v, 0);

              const v = Number((value / sum) * 100)
                .toFixed(2)
                .replace('.', ',') + '%';

              if(data.length > 2) {
                if (context.dataIndex % 2 === 0) {
                  return `${"\t".repeat(3)}${v}`;
                } else {
                  return `${"\n".repeat(2)}${v}`;
                }
              } else {
                return v;
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    this.addPlugin(createPaddingBetweenPlugin(10));

    this.renderChart(this.chartData, this.options);
  }
};