import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';
import transactionReducer from './reducers/transactionReducer';
import categoryReducer from './reducers/categoryReducer';
import budgetReducer from './reducers/budgetReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionReducer,
  categories: categoryReducer,
  budgets: budgetReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;