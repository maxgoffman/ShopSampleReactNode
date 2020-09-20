import * as ActionTypes from '../ActionTypes';

/** 
  * @desc Product Reviews Reducer:
  * Handles reviews actions of the Products model.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux
*/
const reviewsReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.OFFLINE_ADD_PRODUCT_REVIEW:
            const insertItem = {...action.payload, id: (state.reviews[action.id].reviews.length + 1), created_on:(new Date()).toISOString()};    
            return {...state, reviews:{...state.reviews, [action.id]: {...state.reviews[action.id], isLoading:false, reviews:[...state.reviews[action.id].reviews, insertItem]}}};
        
        case ActionTypes.ADD_PRODUCT_REVIEW_FAILED:
            return {...state, reviews:{...state.reviews, [action.id]: {...state.reviews[action.id], errMess:action.payload, isLoading:false, reviews:[...state.reviews[action.id].reviews.slice(0, state.reviews[action.id].reviews.length - 1)]}}};
                    
        case ActionTypes.PRODUCT_REVIEWS_LOADING:
            return {...state, reviews:{...state.reviews, [action.id]: {errMess:null, isLoading:true, reviews:[]}}};

        case ActionTypes.PRODUCT_REVIEWS_READY:
            return {...state, reviews:{...state.reviews, [action.id]: {...state.reviews[action.id], isLoading:false, reviews:action.payload}}};
                
        case ActionTypes.PRODUCT_REVIEWS_FAILED:
            return {...state, reviews:{...state.reviews, [action.id]: {...state.reviews[action.id], errMess:action.payload, isLoading:false}}};
        
        default:
            return state;
    }
};

export default reviewsReducer;