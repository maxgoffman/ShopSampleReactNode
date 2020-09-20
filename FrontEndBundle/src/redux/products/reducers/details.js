import * as ActionTypes from '../ActionTypes';

/** 
  * @desc Product Details Reducer:
  * Handles details actions of the Products model.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux
*/
const detailsReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.PRODUCT_DETAILS_LOADING:
            return {...state, details:{...state.details, [action.id]: {errMess:null, isLoading:true, details:{}}}};
        
        case ActionTypes.PRODUCT_DETAILS_READY:
            return {...state, details:{...state.details, [action.payload.product_id]: {...state.details[action.payload.product_id], isLoading:false, details:action.payload}}};
        
        case ActionTypes.PRODUCT_DETAILS_FAILED:
            return {...state, details:{...state.details, [action.payload.product_id]: {...state.details[action.payload.product_id], errMess:action.payload, isLoading:false}}};
        
        default:
            return state;
    }
};

export default detailsReducer;