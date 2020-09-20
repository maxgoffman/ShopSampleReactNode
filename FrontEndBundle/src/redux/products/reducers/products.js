import reduceReducers from 'reduce-reducers';
import reviewsReducer from './reviews';
import attributesReducer from './attributes';
import detailsReducer from './details';
import * as ActionTypes from '../ActionTypes';


const initialState = { isLoading: true,
    errMess: null,
    details:{},
    reviews: {},
    attributes: {},
    products:[],
    currentPage:1,
    categoryId:0,
    departmentId:0,
    totalProducts:0};

/** 
  * @desc Products Reducer:
  * Handles basic actions of the Products model.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required redux
*/
const productsReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.PRODUCTS_CREATE:
            return {...state, isLoading: false, errMess: null, products: (action.payload.rows ? action.payload.rows : [action.payload]), 
                currentPage:action.payload.page, categoryId:action.payload.categoryId, 
                departmentId:action.payload.departmentId, totalProducts: action.payload.count};

        case ActionTypes.PRODUCTS_LOADING:
            return {...state, isLoading: true,  errMess: null, products: []};

        case ActionTypes.PRODUCTS_FAILED:
            return {...state, isLoading: false, errMess: action.payload};

        default:
            return state;
    }
};

//unlike combine reducers, reduce reducers allows us to keep the same state while neatly separating the code
//this is an advantange with big reducer functions like this one, makes the code more readable
export const Products = reduceReducers(initialState, productsReducer, detailsReducer, attributesReducer, reviewsReducer);