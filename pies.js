const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills'];
const amounts = [450, 120, 300, 150, 280];

const pieCtx = document.getElementById('pieChart').getContext('2d');

const pieChart = new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: categories,
    datasets: [{
      data: amounts,
      backgroundColor: [
        '#e74c3c',  // red
        '#3498db',  // blue
        '#f1c40f',  // yellow
        '#9b59b6',  // purple
        '#2ecc71'   // green
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#f1f1f1'
        }
      }
    }
  }
});
