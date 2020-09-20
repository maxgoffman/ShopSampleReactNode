import * as ActionTypes from '../ActionTypes';
import { baseUrl } from '../../../shared/baseUrl';

  /** 
  * @desc Post Products Reviews:
  * Post new product review data to server, and
  * sends message to Redux Store.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux redux-thunk
  */
export const postProductReviews = (product_id, review, rating, name, token) => async (dispatch) => {
    const product = {review:review, name:name, rating:rating};
    dispatch(offlineAddProductReview(product_id, product));
    const formData  = new FormData();
  
    formData.append('review', review);
    formData.append('rating', rating);
    
    try {
      const response = await fetch(baseUrl + 'products/'+ product_id + '/reviews', {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Authorization': token
          },
          credentials: "same-origin"
      });
      if (!response.ok) {
        let error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
      dispatch(fetchProductReviews({product_id:product_id}));
    } catch(error) {
      dispatch(addProductReviewFailed(product_id, error.message));
    }
  };
  
  const addProductReviewFailed = (product_id, errMess) => ({
    type: ActionTypes.ADD_PRODUCT_REVIEW_FAILED,
    payload: errMess,
    id:product_id
  });
  
  
  const offlineAddProductReview = (product_id, productReview) => ({
    type: ActionTypes.OFFLINE_ADD_PRODUCT_REVIEW,
    payload: productReview,
    id:product_id
  });
  
  /** 
  * @desc Fetch Products Reviews:
  * Fetch single product reviews data from server, and
  * sends message to Redux Store.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux redux-thunk
  */
  export const fetchProductReviews = (product) => async (dispatch) => {
    dispatch(productReviewsLoading(product.product_id));
    
    try {
      const response = await fetch(baseUrl + 'products/'+ product.product_id + '/reviews');
      if (!response.ok) {
        let error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
      const productReviews = await response.json();
      dispatch(createProductReviews(product.product_id, productReviews));
    } catch(error) {
      dispatch(productReviewsFailed(product.product_id, error.message));
    }
  };
  
  const productReviewsLoading = (product_id) => ({
    type: ActionTypes.PRODUCT_REVIEWS_LOADING,
    id:product_id
  });
  
  const productReviewsFailed = (product_id, errMess) => ({
    type: ActionTypes.PRODUCT_REVIEWS_FAILED,
    payload: errMess,
    id:product_id
  });
  
  const createProductReviews = (product_id, productReviews) => ({
      type: ActionTypes.PRODUCT_REVIEWS_READY,
      payload: productReviews,
      id:product_id
  });