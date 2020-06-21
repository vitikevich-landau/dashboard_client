import {Bar, mixins} from "vue-chartjs";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {createPaddingBetweenPlugin, totalizerPlugin} from "@/components/charts/plugins";
import {toLocalCurrency} from "@/utils/currency";

const {reactiveProp} = mixins;

import store from '@/store/index';

export default {
  extends: Bar,
  mixins: [reactiveProp],
  plugins: [ChartDataLabels],
  components: {
    store
  },
  data() {
    return {
      options: {
        title: {
          // display: true,
          // text: 'Analytics'
        },
        layout: {
          padding: {
            top: 0,
          },
          legend: {
            labels: {
              padding: 50
            }
          }
        },
        tooltips: {
          mode: 'index',
          intersect: true,
          callbacks: {
            label: (tooltipItem, data) => {
              const title = data.datasets[tooltipItem.datasetIndex].label;
              const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

              return `${title}: ${toLocalCurrency(value)}`;
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
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
        plugins: {
          datalabels: {
            color: 'black',
            // textAlign: 'center',
            font: {
              weight: "bold",
              // size: 14
            },
            formatter: (value, ctx) => {
              const total = ctx.chart.$totalizer.totals[ctx.dataIndex];

              return toLocalCurrency(total);
            },
            align: "end",
            anchor: "end",
            display: function (ctx) {
              return ctx.datasetIndex === ctx.chart.$totalizer.utmost;
            }
          }
        }
      }
    }
  },
  mounted() {
    this.addPlugin(totalizerPlugin);
    this.addPlugin(createPaddingBetweenPlugin(15));

    this.renderChart(this.chartData, this.options);
  }
};