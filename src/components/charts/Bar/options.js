export default {
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
    duration: 350
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
};