const BalanceCard = ({ title, amount, icon, color, textColor }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-full mr-4`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-semibold ${textColor}`}>{formattedAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;