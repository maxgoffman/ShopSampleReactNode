import * as ActionTypes from '../ActionTypes';
import { baseUrl } from '../../../shared/baseUrl';

/** 
  * @desc Fetch Products Attributes:
  * Fetch single product attributes data from server, and
  * sends message to Redux Store.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux redux-thunk
  */
export const fetchProductAttributes = (product) => async (dispatch) => {
    dispatch(productAttributesLoading(product.product_id));
    
    try {
      const response = await fetch(baseUrl + 'attributes/inProduct/'+ product.product_id);
      if (!response.ok) {
        let error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
      const productAttributes = await response.json();
      dispatch(createProductAttributes(product.product_id, productAttributes));
    } catch(error) {
      dispatch(productAttributesFailed(product.product_id, error.message));
    }
  }
  
  const productAttributesLoading = (product_id) => ({
    type: ActionTypes.PRODUCT_ATTRIBUTES_LOADING,
    id:product_id
  });
  
  const productAttributesFailed = (product_id, errMess) => ({
    type: ActionTypes.PRODUCT_ATTRIBUTES_FAILED,
    payload: errMess,
    id:product_id
  });
  
  const createProductAttributes = (product_id, productAttributes) => ({
      type: ActionTypes.PRODUCT_ATTRIBUTES_READY,
      payload: productAttributes,
      id:product_id
  });