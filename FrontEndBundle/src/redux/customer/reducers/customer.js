import * as ActionTypes from '../ActionTypes';
import { loadUser, saveUser } from "../../persistedstate";

const persistedUser = loadUser();
const initialState = { errMess: null, isLoading:false, customer:{}};

/** 
  * @desc Customer Reducer:
  * Handles all about Customer model. Load/Saves data to cookie
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux
*/
export const Customer = (state = {...initialState, customer:(persistedUser ? persistedUser : {})}, action) => {
    switch (action.type) {
      case ActionTypes.CUSTOMER_SUCCESS_LOGIN:
        saveUser(action.payload); 
        return {...state, isLoading: false, errMess: null, customer: action.payload};

      case ActionTypes.CUSTOMER_TRY_LOGIN_OR_REGISTER:
      case ActionTypes.CUSTOMER_FACEBOOK_LOGIN_OR_REGISTER:
          return {...state, isLoading: true, errMess: null, customer: {}};

      case ActionTypes.CUSTOMER_FAILED_LOGIN:
          return {...state, isLoading: false, errMess: action.payload};
      
      case ActionTypes.CUSTOMER_LOGOUT:
        saveUser({}); 
        return {...initialState};
  
      default:
        return state;
    }
};