import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

const IncomeVsExpenses = ({ transactions, timeRange }) => {
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (transactions.length > 0) {
      prepareChartData();
    }
  }, [transactions, timeRange]);
  
  const prepareChartData = () => {
    const today = new Date();
    let startDate;
    
    // Determine start date based on time range
    switch (timeRange) {
      case '3months':
        startDate = subMonths(today, 3);
        break;
      case '6months':
        startDate = subMonths(today, 6);
        break;
      case '12months':
        startDate = subMonths(today, 12);
        break;
      default:
        startDate = subMonths(today, 6);
    }
    
    // Get all months in the interval
    const monthsInRange = eachMonthOfInterval({
      start: startDate,
      end: today
    });
    
    // Initialize data for each month
    const monthlyData = monthsInRange.map(date => {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      // Filter transactions for this month
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });
      
      // Calculate income and expenses
      const income = monthTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expenses = monthTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      return {
        month: format(date, 'MMM'),
        income,
        expenses
      };
    });
    
    const data = {
      labels: monthlyData.map(d => d.month),
      datasets: [
        {
          label: 'Income',
          data: monthlyData.map(d => d.income),
          backgroundColor: '#10B981', // green
        },
        {
          label: 'Expenses',
          data: monthlyData.map(d => d.expenses),
          backgroundColor: '#EF4444', // red
        }
      ]
    };
    
    setChartData(data);
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
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
  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default IncomeVsExpenses;