import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Transactions from './components/Transactions/Transactions';
import TransactionForm from './components/Transactions/TransactionForm';
import Reports from './components/Reports/Reports';
import Budget from './components/Budget/Budget';
import Layout from './components/Layout/Layout';
import { checkAuthStatus } from './store/actions/authActions';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/add" element={<TransactionForm />} />
        <Route path="transactions/edit/:id" element={<TransactionForm />} />
        <Route path="reports" element={<Reports />} />
        <Route path="budget" element={<Budget />} />
      </Route>
    </Routes>
  );
}

export default App;