import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../../shared/baseUrl';

/** 
  * @desc Login Or Register Customer:
  * Send data to server and then send response to Redux Store.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux redux-thunk
*/
export const postCustomerLoginOrRegister = (email, password, name='', newCustomer=false) => async (dispatch) => {
  dispatch(customerLoginOrRegister());

  var formData  = new FormData();

  formData.append('email', email);
  formData.append('password', password);
  formData.append('name', name);
  
  try {
    const response = await fetch(baseUrl + (newCustomer ? 'customers' : 'customers/login' ), {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        },
        credentials: "same-origin"
    });
    if (!response.ok) {
      let error = new Error('Error ' + response.status + ': ' + response.statusText);
      error.response = response;
      throw error;
    }
    const customer = await response.json();
    dispatch(loginCustomer(customer));
  } catch(error) {
    dispatch(loginFailed(error.message));
  }
};

/** 
  * @desc Logout Customer:
  * Notify Redux Store to remove all data from customer.
  * @author Maximiliano Goffman maxgoffman@gmail.com
*/
export const customerLogout = () => ({
  type: ActionTypes.CUSTOMER_LOGOUT
});

const customerLoginOrRegister = () => ({
  type: ActionTypes.CUSTOMER_TRY_LOGIN_OR_REGISTER
});

const loginCustomer = (customer) => ({
  type: ActionTypes.CUSTOMER_SUCCESS_LOGIN,
  payload: customer
});

const loginFailed = (errmess) => ({
  type: ActionTypes.CUSTOMER_FAILED_LOGIN,
  payload: errmess
});


/** 
  * @desc Login Or Register Customer Using Facebook OAuth:
  * Send data to server and then send response to Redux Store.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux redux-thunk
*/
export const postFacebookLoginOrRegister = (access_token) => async (dispatch) => {
  dispatch(customerLoginOrRegister());

  var formData  = new FormData();

  formData.append('access_token', access_token);
  
  try {
    const response = await fetch(baseUrl + 'customers/facebook' , {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        },
        credentials: "same-origin"
    });
    if (!response.ok) {
      let error = new Error('Error ' + response.status + ': ' + response.statusText);
      error.response = response;
      throw error;
    }
    const customer = await response.json();
    dispatch(loginCustomer(customer));
  } catch(error) {
    dispatch(loginFailed(error.message));
  }
};

