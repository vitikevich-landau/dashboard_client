export const createPaddingBetweenPlugin = (addHeight = 0) => {
 return {
   beforeInit: function(chart) {
     chart.legend.afterFit = function() {
       this.height += addHeight;
     };
   }
 };
};

export const totalizerPlugin = {
  id: "totalizer",

  beforeUpdate: chart => {
    let totals = {};
    let utmost = 0;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (chart.isDatasetVisible(datasetIndex)) {
        utmost = datasetIndex;
        dataset.data.forEach((value, index) => {
          totals[index] = (totals[index] || 0) + value;
        });
      }
    });

    chart.$totalizer = {
      totals: totals,
      utmost: utmost
    };
  }
};