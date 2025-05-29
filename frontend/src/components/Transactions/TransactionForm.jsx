import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addTransaction, updateTransaction, setCurrentTransaction } from '../../store/actions/transactionActions';
import { fetchCategories } from '../../store/actions/categoryActions';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

const TransactionForm = () => {
      const { id } = useParams();
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const { currentTransaction } = useSelector(state => state.transactions);
      const { categories } = useSelector(state => state.categories);

      const [formData, setFormData] = useState({
            type: 'expense',
            amount: '',
            category: '',
            description: '',
            date: format(new Date(), 'yyyy-MM-dd')
      });

      const [errors, setErrors] = useState({});

      useEffect(() => {
            dispatch(fetchCategories());

            // If editing an existing transaction
            if (id) {
                  dispatch(setCurrentTransaction(id));
                  console.log(setCurrentTransaction(id));
            }
      }, [dispatch, id]);

      useEffect(() => {
            // Populate form when editing
            if (currentTransaction && id) {
                  const type = currentTransaction.amount > 0 ? 'income' : 'expense';
                  setFormData({
                        type,
                        amount: Math.abs(currentTransaction.amount).toString(),
                        category: currentTransaction.category,
                        description: currentTransaction.description,
                        date: currentTransaction.date
                  });
            }
      }, [currentTransaction, id]);

      const validateForm = () => {
            const newErrors = {};

            if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
                  newErrors.amount = 'Please enter a valid amount greater than zero';
            }

            if (!formData.category) {
                  newErrors.category = 'Please select a category';
            }

            if (!formData.description) {
                  newErrors.description = 'Please enter a description';
            }

            if (!formData.date) {
                  newErrors.date = 'Please select a date';
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = (e) => {
            e.preventDefault();

            if (!validateForm()) {
                  return;
            }

            // Prepare transaction data
            const amount = parseFloat(formData.amount);
            const finalAmount = formData.type === 'expense' ? -amount : amount;

            const transactionData = {
                  amount: finalAmount,
                  category: formData.category,
                  description: formData.description,
                  date: formData.date,
                  type: formData.type
            };

            if (id) {
                  // Update existing transaction
                  dispatch(updateTransaction({
                        ...transactionData,
                        _id:id
                  }));
            } else {
                  // Add new transaction
                  dispatch(addTransaction(transactionData));
            }

            // Redirect back to transactions list
            navigate('/transactions');
      };
      

      const handleChange = (e) => {
            const { name, value } = e.target;

            setFormData(prev => ({
                  ...prev,
                  [name]: value
            }));

            // Clear error when field is edited
            if (errors[name]) {
                  setErrors(prev => ({
                        ...prev,
                        [name]: undefined
                  }));
            }
      };

      return (
            <div>
                  <div className="flex items-center mb-6">
                        <button
                              onClick={() => navigate('/transactions')}
                              className="mr-4 text-gray-600 hover:text-gray-900"
                        >
                              <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-800">
                              {id ? 'Edit Transaction' : 'Add Transaction'}
                        </h1>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                        <form onSubmit={handleSubmit}>
                              <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Transaction Type
                                    </label>
                                    <div className="flex space-x-4">
                                          <label className="inline-flex items-center">
                                                <input
                                                      type="radio"
                                                      name="type"
                                                      value="income"
                                                      checked={formData.type === 'income'}
                                                      onChange={handleChange}
                                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-gray-700">Income</span>
                                          </label>
                                          <label className="inline-flex items-center">
                                                <input
                                                      type="radio"
                                                      name="type"
                                                      value="expense"
                                                      checked={formData.type === 'expense'}
                                                      onChange={handleChange}
                                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-gray-700">Expense</span>
                                          </label>
                                    </div>
                              </div>

                              <div className="mb-6">
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                          Amount
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
                                                step="0.01"
                                                min="0"
                                                className={`
                  block w-full pl-7 pr-12 py-2 rounded-md 
                  ${errors.amount ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                `}
                                                placeholder="0.00"
                                          />
                                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">USD</span>
                                          </div>
                                    </div>
                                    {errors.amount && (
                                          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                    )}
                              </div>

                              <div className="mb-6">
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                          Category
                                    </label>
                                    <select
                                          id="category"
                                          name="category"
                                          value={formData.category}
                                          onChange={handleChange}
                                          className={`
                block w-full rounded-md shadow-sm
                ${errors.category ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
              `}
                                    >
                                          <option value="">Select a category</option>
                                          {categories
                                                .filter(category =>
                                                      formData.type === 'income'
                                                            ? category.name === 'Income'
                                                            : category.name !== 'Income'
                                                )
                                                .map(category => (
                                                      <option key={category.id} value={category.name}>
                                                            {category.name}
                                                      </option>
                                                ))
                                          }
                                    </select>
                                    {errors.category && (
                                          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                    )}
                              </div>

                              <div className="mb-6">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                          Description
                                    </label>
                                    <input
                                          type="text"
                                          id="description"
                                          name="description"
                                          value={formData.description}
                                          onChange={handleChange}
                                          className={`
                block w-full rounded-md shadow-sm 
                ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
              `}
                                          placeholder="e.g., Grocery shopping, Rent payment"
                                    />
                                    {errors.description && (
                                          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                              </div>

                              <div className="mb-6">
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                          Date
                                    </label>
                                    <input
                                          type="date"
                                          id="date"
                                          name="date"
                                          value={formData.date}
                                          onChange={handleChange}
                                          className={`
                block w-full rounded-md shadow-sm 
                ${errors.date ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
              `}
                                    />
                                    {errors.date && (
                                          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                                    )}
                              </div>

                              <div className="flex justify-end space-x-3">
                                    <button
                                          type="button"
                                          onClick={() => navigate('/transactions')}
                                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                          Cancel
                                    </button>
                                    <button
                                          type="submit"
                                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                          {id ? 'Update Transaction' : 'Add Transaction'}
                                    </button>
                              </div>
                        </form>
                  </div>
            </div>
      );
};

export default TransactionForm;