import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgets, addBudget, updateBudget, deleteBudget } from '../../store/actions/budgetActions';
import { fetchCategories } from '../../store/actions/categoryActions';
import { fetchTransactions } from '../../store/actions/transactionActions';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

const Budget = () => {
  const dispatch = useDispatch();
  const { budgets } = useSelector(state => state.budgets);
  const { categories } = useSelector(state => state.categories);
  const { transactions } = useSelector(state => state.transactions);
  
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });
  
  useEffect(() => {
    dispatch(fetchBudgets());
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
  }, [dispatch]);
  
  // Calculate expenses for each budget
  const getBudgetStatus = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transaction.amount < 0 && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    // Group expenses by category
    const expensesByCategory = currentMonthTransactions.reduce((acc, transaction) => {
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);
      
      if (!acc[category]) {
        acc[category] = 0;
      }
      
      acc[category] += amount;
      
      return acc;
    }, {});
    
    // Calculate status for each budget
    return budgets.map(budget => {
      const spent = expensesByCategory[budget.category] || 0;
      const percentage = (spent / budget.amount) * 100;
      const remaining = budget.amount - spent;
      const status = percentage >= 100 ? 'over' : percentage >= 90 ? 'warning' : 'good';
      
      return {
        ...budget,
        spent,
        percentage,
        remaining,
        status
      };
    });
  };
  
  const budgetsWithStatus = getBudgetStatus();
  
  const handleOpenForm = (budget = null) => {
    if (budget) {
      setFormData({
        category: budget.category,
        amount: budget.amount.toString(),
        period: budget.period
      });
      setCurrentBudget(budget);
      setIsEditing(true);
    } else {
      setFormData({
        category: '',
        amount: '',
        period: 'monthly'
      });
      setCurrentBudget(null);
      setIsEditing(false);
    }
    
    setShowForm(true);
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentBudget(null);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const budgetData = {
      category: formData.category,
      amount: parseFloat(formData.amount),
      period: formData.period
    };
    
    if (isEditing && currentBudget) {
      dispatch(updateBudget({
        ...budgetData,
        _id: currentBudget._id
      }));
    } else {
      dispatch(addBudget(budgetData));
    }
    
    handleCloseForm();
  };
  
  const handleDeleteBudget = (_id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      dispatch(deleteBudget(_id));
    }
  };
  
  // Get expense categories only
  const expenseCategories = categories.filter(category => category.name !== 'Income');
  
  // Check if a category already has a budget
  const getCategoriesWithoutBudget = () => {
    const budgetCategories = new Set(budgets.map(budget => budget.category));
    return expenseCategories.filter(category => !budgetCategories.has(category.name));
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Budget Management</h1>
        {!showForm && (
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} className="mr-1" />
            <span>Add Budget</span>
          </button>
        )}
      </div>
      
      {/* Budget Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {isEditing ? 'Edit Budget' : 'Create New Budget'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={isEditing}
                >
                  <option value="">Select a category</option>
                  {(isEditing ? expenseCategories : getCategoriesWithoutBudget()).map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Amount
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    step="0.01"
                    className="block w-full pl-7 pr-12 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">USD</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <select
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditing ? 'Update Budget' : 'Create Budget'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Budgets List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Your Budgets</h2>
          <p className="text-gray-500 text-sm mt-1">Track your spending against your monthly budgets</p>
        </div>
        
        {budgetsWithStatus.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No budgets set. Create your first budget to start tracking expenses.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {budgetsWithStatus.map(budget => (
              <div key={budget._id} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{budget.category}</h3>
                    <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenForm(budget)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    ${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                  </span>
                  <span className={`text-sm ${budget.status === 'over' ? 'text-red-500' : budget.status === 'warning' ? 'text-yellow-500' : 'text-green-500'}`}>
                    {budget.percentage.toFixed(0)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${
                      budget.status === 'over' ? 'bg-red-500' : budget.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${budget.remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {budget.remaining >= 0 ? `$${budget.remaining.toFixed(2)} remaining` : `$${Math.abs(budget.remaining).toFixed(2)} over budget`}
                  </span>
                  
                  {budget.status === 'over' && (
                    <div className="flex items-center text-red-500 text-sm">
                      <AlertCircle size={16} className="mr-1" />
                      <span>Over budget</span>
                    </div>
                  )}
                  
                  {budget.status === 'warning' && (
                    <div className="flex items-center text-yellow-500 text-sm">
                      <AlertCircle size={16} className="mr-1" />
                      <span>Almost over budget</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;