import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const MonthlyExpensesByCategory = ({ transactions }) => {
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (transactions.length > 0) {
      prepareChartData();
    }
  }, [transactions]);
  
  const prepareChartData = () => {
    const today = new Date();
    const lastMonth = subMonths(today, 1);
    const monthStart = startOfMonth(lastMonth);
    const monthEnd = endOfMonth(lastMonth);
    
    // Filter transactions for last month
    const monthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transaction.amount < 0 && transactionDate >= monthStart && transactionDate <= monthEnd;
    });
    
    // Group by category
    const expensesByCategory = monthTransactions.reduce((acc, transaction) => {
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
      .sort((a, b) => b[1] - a[1]);
    
    const data = {
      labels: sortedCategories.map(([category]) => category),
      datasets: [
        {
          label: format(lastMonth, 'MMMM yyyy'),
          data: sortedCategories.map(([, amount]) => amount),
          backgroundColor: [
            '#10B981', // green
            '#3B82F6', // blue
            '#8B5CF6', // purple
            '#EC4899', // pink
            '#F59E0B', // yellow
            '#6366F1', // indigo
            '#EF4444', // red
            '#0EA5E9', // sky
            '#14B8A6', // teal
          ]
        }
      ]
    };
    
    setChartData(data);
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };
  
  // If no data, show a message
  if (!chartData || chartData.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No expense data available for last month</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlyExpensesByCategory;