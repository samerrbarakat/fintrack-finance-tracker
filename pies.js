const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills'];
const amounts = [450, 120, 300, 150, 280];
const backgroundColors = [
  '#d62839',
  '#ba324f', 
  '#175676', 
  '#4ba3c3', 
  '#cce6f4'  
];

const pieCtx = document.getElementById('pieChart').getContext('2d');

const pieChart = new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: categories,
    datasets: [{
      data: amounts,
      backgroundColor: backgroundColors
    }]
  },
  options: {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#f1f1f1',  
        font: {
          size: 14
        }
      }
    }
  }
}

});
