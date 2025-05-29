import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../../store/actions/transactionActions';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import MonthlyExpensesByCategory from './MonthlyExpensesByCategory';
import IncomeVsExpenses from './IncomeVsExpenses';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const Reports = () => {
  const dispatch = useDispatch();
  const { transactions } = useSelector(state => state.transactions);
  
  const [timeRange, setTimeRange] = useState('6months');
  const [balanceData, setBalanceData] = useState(null);
  
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);
  
  useEffect(() => {
    if (transactions.length > 0) {
      prepareBalanceData();
    }
  }, [transactions, timeRange]);
  
  const prepareBalanceData = () => {
    const today = new Date();
    let startDate;
    
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
        
      const balance = income - expenses;
      
      return {
        month: format(date, 'MMM yyyy'),
        income,
        expenses,
        balance
      };
    });
    
    setBalanceData(monthlyData);
  };
  
  const getBalanceChartData = () => {
    if (!balanceData) return null;
    
    return {
      labels: balanceData.map(d => d.month),
      datasets: [
        {
          label: 'Balance',
          data: balanceData.map(d => d.balance),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };
  
  const balanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Balance: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Financial Reports</h1>
        
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>
      </div>
      
      {/* Balance Trend */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Balance Trend</h2>
        <div className="h-80">
          {balanceData ? (
            <Line data={getBalanceChartData()} options={balanceChartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Expenses by Category */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Expenses by Category</h2>
          <MonthlyExpensesByCategory transactions={transactions} />
        </div>
        
        {/* Income vs Expenses */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Income vs Expenses</h2>
          <IncomeVsExpenses transactions={transactions} timeRange={timeRange} />
        </div>
      </div>
      
      {/* Savings Rate */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Savings Rate</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {balanceData && balanceData.slice(-3).map((month, index) => {
            const totalIncome = month.income;
            const totalExpenses = month.expenses;
            const savings = month.balance;
            const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
            
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700">{month.month}</h3>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Income:</span>
                    <span className="font-medium">${totalIncome.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Expenses:</span>
                    <span className="font-medium">${totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Savings:</span>
                    <span className="font-medium">${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Savings Rate:</span>
                    <span className={`${savingsRate >= 20 ? 'text-green-500' : savingsRate >= 10 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {savingsRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${savingsRate >= 20 ? 'bg-green-500' : savingsRate >= 10 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(savingsRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reports;