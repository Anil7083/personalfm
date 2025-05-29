const BudgetOverview = ({ budgets, transactions }) => {
  // Group expenses by category
  const expensesByCategory = transactions
    .filter(transaction => transaction.amount < 0)
    .reduce((acc, transaction) => {
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);
      
      if (!acc[category]) {
        acc[category] = 0;
      }
      
      acc[category] += amount;
      
      return acc;
    }, {});
  
  return (
    <div className="space-y-4">
      {budgets.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No budgets set</p>
        </div>
      ) : (
        budgets.map((budget) => {
          const spent = expensesByCategory[budget.category] || 0;
          const percentage = (spent / budget.amount) * 100;
          const remaining = budget.amount - spent;
          
          // Determine color based on percentage spent
          let progressColor = 'bg-green-500';
          if (percentage >= 90) {
            progressColor = 'bg-red-500';
          } else if (percentage >= 75) {
            progressColor = 'bg-yellow-500';
          }
          
          return (
            <div key={budget._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">{budget.category}</h3>
                <span className="text-sm text-gray-500">
                  ${spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`${progressColor} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {percentage.toFixed(0)}% spent
                </span>
                <span className={`text-xs ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {remaining >= 0 ? `$${remaining.toFixed(2)} remaining` : `$${Math.abs(remaining).toFixed(2)} over budget`}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default BudgetOverview;