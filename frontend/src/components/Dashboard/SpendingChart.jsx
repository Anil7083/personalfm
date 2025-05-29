import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingChart = ({ transactions }) => {
  // Filter out income and only include expenses
  const expenses = transactions.filter(transaction => transaction.amount < 0);
  
  // Group expenses by category and calculate total for each
  const expensesByCategory = expenses.reduce((acc, transaction) => {
    const category = transaction.category;
    const amount = Math.abs(transaction.amount);
    
    if (!acc[category]) {
      acc[category] = 0;
    }
    
    acc[category] += amount;
    
    return acc;
  }, {});
  
  // Sort categories by amount (descending)
  const sortedCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 categories
  
  // Calculate total for "Other" category if there are more than 5 categories
  let otherTotal = 0;
  if (Object.keys(expensesByCategory).length > 5) {
    const topCategories = new Set(sortedCategories.map(([category]) => category));
    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      if (!topCategories.has(category)) {
        otherTotal += amount;
      }
    });
  }
  
  // Prepare data for chart
  const labels = sortedCategories.map(([category]) => category);
  const data = sortedCategories.map(([, amount]) => amount);
  
  // Add "Other" category if needed
  if (otherTotal > 0) {
    labels.push('Other');
    data.push(otherTotal);
  }
  
  // Define chart colors
  const backgroundColors = [
    '#10B981', // green
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#F59E0B', // yellow
    '#6B7280', // gray (for "Other")
  ];
  
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };
  
  // If no expenses, show a message
  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No expense data to display</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default SpendingChart;