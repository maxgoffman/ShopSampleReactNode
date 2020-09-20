import * as ActionTypes from '../ActionTypes';
import { baseUrl } from '../../../shared/baseUrl';
import { fetchProductDetails, fetchProductAttributes, fetchProductReviews } from '../ActionCreators';

/** 
  * @desc Fetch Products:
  * Paged fetch data from server with category and departments filters,
  * sends message to Redux Store, and then
  * calls for Details, Attributes and Reviews data.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux redux-thunk
*/
export const fetchProducts = (page=1, categoryId='', departmentId='', limit=8, description_length=100) => async (dispatch) => {
  dispatch(productsLoading());

    const queryString = `?page=${page}&limit=${limit}&description_length=${description_length}`;
    const categoryString = (categoryId ? `/inCategory/${categoryId}` : '');
    const departmentString = (categoryString || !departmentId ? '' : `/inDepartment/${departmentId}`);
    try {
      const response = await fetch(baseUrl + 'products'+ categoryString + departmentString + queryString);
      if (!response.ok) {
        let error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
      const products = await response.json();
      const convertedProducts = dispatch(createProducts(products, page, categoryId, departmentId));
      dispatch(setProductDetails(convertedProducts.payload.rows ? convertedProducts.payload.rows : [convertedProducts.payload]));
    } catch(error) {
      dispatch(productsFailed(error.message));
    }
};

/** 
  * @desc Search Products:
  * Paged fetch data from server by using a string query,
  * sends message to Redux Store, and then
  * calls for Details, Attributes and Reviews data.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux redux-thunk
*/
export const searchProducts = (query_string, all_words='off', page=1, limit=8, description_length=100) => async (dispatch) => {
    
    dispatch(productsLoading());

    const queryString = `?query_string=${encodeURI(query_string)}&all_words=${all_words}&page=${page}&limit=${limit}&description_length=${description_length}`;
    try {
      const response = await fetch(baseUrl + 'products/search' + queryString);
      if (!response.ok) {
        let error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
      const products = await response.json();
      const convertedProducts = dispatch(createProducts(products, page, '', ''));
      dispatch(setProductDetails(convertedProducts.payload.rows ? convertedProducts.payload.rows : [convertedProducts.payload]));
    } catch(error) {
      dispatch(productsFailed(error.message));
    }
};

const productsLoading = () => ({
    type: ActionTypes.PRODUCTS_LOADING
});

const productsFailed = (errmess) => ({
    type: ActionTypes.PRODUCTS_FAILED,
    payload: errmess
});

const createProducts = (products, page, categoryId, departmentId) => {
    products.page = page;
    products.categoryId = categoryId;
    products.departmentId = departmentId;
    
    return ({
      type: ActionTypes.PRODUCTS_CREATE,
      payload: products
    });
};

const setProductDetails = (products) => (dispatch) => {
  
  for(const item of products) {
    dispatch(fetchProductDetails(item)); 
    dispatch(fetchProductReviews(item));
    dispatch(fetchProductAttributes(item));
  }
};