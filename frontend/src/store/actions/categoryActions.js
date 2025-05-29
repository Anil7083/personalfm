// Fetch categories
export const fetchCategories = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'FETCH_CATEGORIES_START' });
    
    // We're using the mock data already in the state
    const { categories } = getState().categories;
    
    dispatch({
      type: 'FETCH_CATEGORIES_SUCCESS',
      payload: categories
    });
  };
};

// Add category
export const addCategory = (category) => {
  return dispatch => {
    // Generate ID (would be handled by backend)
    const newCategory = {
      ...category,
      id: `c-${Date.now()}`
    };
    
    dispatch({
      type: 'ADD_CATEGORY',
      payload: newCategory
    });
  };
};

// Update category
export const updateCategory = (category) => {
  return dispatch => {
    dispatch({
      type: 'UPDATE_CATEGORY',
      payload: category
    });
  };
};

// Delete category
export const deleteCategory = (id) => {
  return dispatch => {
    dispatch({
      type: 'DELETE_CATEGORY',
      payload: id
    });
  };
};