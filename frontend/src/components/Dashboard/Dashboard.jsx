import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTransactions } from '../../store/actions/transactionActions';
import { fetchBudgets } from '../../store/actions/budgetActions';

import { Plus, ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp } from 'lucide-react';
import BalanceCard from './BalanceCard';
import RecentTransactions from './RecentTransactions';
import SpendingChart from './SpendingChart';
import BudgetOverview from './BudgetOverview';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { transactions } = useSelector(state => state.transactions);
  const { budgets } = useSelector(state => state.budgets);
  
  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBudgets());
  }, [dispatch]);
  
  // Get current month transactions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });
  
  // Calculate total income and expenses for current month
  const totalIncome = currentMonthTransactions
    .filter(transaction => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);
    
  const totalExpenses = currentMonthTransactions
    .filter(transaction => transaction.amount < 0)
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
    
  const balance = totalIncome - totalExpenses;
  
  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Link
            to="/transactions/add"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} className="mr-1" />
            <span>Add Transaction</span>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <BalanceCard 
          title="Current Balance"
          amount={balance}
          icon={<DollarSign size={24} />}
          color="bg-blue-500"
          textColor="text-blue-500"
        />
        <BalanceCard 
          title="Total Income"
          amount={totalIncome}
          icon={<ArrowUpRight size={24} />}
          color="bg-green-500"
          textColor="text-green-500"
        />
        <BalanceCard 
          title="Total Expenses"
          amount={totalExpenses}
          icon={<ArrowDownRight size={24} />}
          color="bg-red-500"
          textColor="text-red-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Spending Overview</h2>
            <Link to="/reports" className="text-sm text-blue-500 hover:text-blue-600">
              View Reports
            </Link>
          </div>
          <SpendingChart transactions={currentMonthTransactions} />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Budget Overview</h2>
            <Link to="/budget" className="text-sm text-blue-500 hover:text-blue-600">
              Manage Budgets
            </Link>
          </div>
          <BudgetOverview budgets={budgets} transactions={currentMonthTransactions} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
          <Link to="/transactions" className="text-sm text-blue-500 hover:text-blue-600">
            View All
          </Link>
        </div>
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;