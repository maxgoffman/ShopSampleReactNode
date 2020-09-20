import {createStore, combineReducers, applyMiddleware } from 'redux';
import { Departments } from './departments/reducers/departments';
import { Categories } from './categories/reducers/categories';
import { Products } from './products/reducers/products';
import { Customer } from './customer/reducers/customer';
import { ShoppingCart } from './shoppingcart/reducers/shoppingcart';

import thunk from 'redux-thunk';

//Create Redux Store by Combining Reducers and apply Redux-Thunk middleware
export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            departments: Departments,
            categories: Categories,
            products: Products,
            customer: Customer,
            cart: ShoppingCart
        }),
        applyMiddleware(thunk)
    );
    
    return store;
}