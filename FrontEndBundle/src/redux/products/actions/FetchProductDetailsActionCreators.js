import * as ActionTypes from '../ActionTypes';
import { baseUrl } from '../../../shared/baseUrl';

/** 
  * @desc Fetch Products Details:
  * Fetch single product details data from server, and
  * sends message to Redux Store.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux redux-thunk
*/
export const fetchProductDetails = (product) => async (dispatch) => {
    dispatch(productDetailsLoading(product.product_id));
    
    try {
      const response = await fetch(baseUrl + 'products/'+ product.product_id + '/details?description_length=100');
      if (!response.ok) {
        let error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
      const productDetails = await response.json();
      dispatch(createProductDetails(productDetails));
    } catch(error) {
      dispatch(productDetailsFailed(product.product_id, error.message));
    }
  }
  
  const productDetailsLoading = (product_id) => ({
    type: ActionTypes.PRODUCT_DETAILS_LOADING,
    id:product_id
  });
  
  const productDetailsFailed = (product_id, errMess) => ({
    type: ActionTypes.PRODUCT_DETAILS_FAILED,
    payload: errMess,
    id:product_id
  });
  
  const createProductDetails = (productDetails) => ({
      type: ActionTypes.PRODUCT_DETAILS_READY,
      payload: productDetails,
  });