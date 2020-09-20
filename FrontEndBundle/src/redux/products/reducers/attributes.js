import * as ActionTypes from '../ActionTypes';

/** 
  * @desc Product Attributes Reducer:
  * Handles attributes actions of the Products model.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux
*/
const attributesReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.PRODUCT_ATTRIBUTES_LOADING:
            return {...state, attributes:{...state.attributes, [action.id]: {errMess:null, isLoading:true, attributes:[]}}};

        case ActionTypes.PRODUCT_ATTRIBUTES_READY:
            return {...state, attributes:{...state.attributes, [action.id]: {...state.attributes[action.id], isLoading:false, attributes:action.payload}}};

        case ActionTypes.PRODUCT_ATTRIBUTES_FAILED:
            return {...state, attributes:{...state.attributes, [action.id]: {...state.attributes[action.id], errMess:action.payload, isLoading:false}}};
        
        default:
            return state;
    }
};

export default attributesReducer;