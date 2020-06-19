import { Bar, mixins } from "vue-chartjs";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { createPaddingBetweenPlugin, totalizerPlugin } from "@/components/charts/plugins";
import { toLocalCurrency } from "@/utils/currency";

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
        legend: {
          onClick(e, legendItem) {
            // eslint-disable-next-line no-unused-vars
            const accounts = store.getters.filterAccounts;
            const filtered = accounts.filter(acc => acc !== legendItem.text);
            // console.log(filtered);

            const index = legendItem.datasetIndex;
            const ci = this.chart;
            const meta = ci.getDatasetMeta(index);
            // eslint-disable-next-line no-unused-vars
            const text = legendItem.text;

            // console.log('meta.hidden === null');
            // console.log(ci.data.datasets);


            if (meta.hidden === null) {
              store.commit('setFilterAccounts', filtered);

              console.log(index);
              meta.hidden = !ci.data.datasets[index].hidden;
            } else {
              store.commit('setFilterAccounts', [...accounts, text]);

              console.log(index);

              meta.hidden = null;
            }

            // We hid a dataset ... rerender the chart
            ci.update();
          }
        },
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

              return `${ title }: ${ toLocalCurrency(value) }`;
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
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  }
};