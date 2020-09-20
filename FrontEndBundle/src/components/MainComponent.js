import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import TopBar from './layout/header/topbar/TopBarComponent';
import MainNav from './layout/header/navigation/MainNavComponent';
import Footer from './layout/footer/FooterComponent'
import HomePage from './pages/home/HomeComponent';
import CartPage from './pages/cart/CartComponent';
import ShippingPage from './pages/shipping/ShippingComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { fetchCartUniqueId, fetchCartProducts } from '../redux/shoppingcart/ActionCreators';
import fetchDepartments from '../redux/departments/ActionCreators';
import fetchCategories from '../redux/categories/ActionCreators';
import { fetchProducts }  from '../redux/products/ActionCreators';
import ProductDetailsModal from './modals/productdetails/ProductDetailsModalComponent';
import { baseLocalRoute } from '../shared/baseUrl';

/** 
  * @desc Main react component:
  * it'll handle initial data fetching and router updates.
  * Using React.memo to avoid needless re renders (kind of 
  * like using PureComponent). 
  * Added redux hooks useSelector and useDispatch
  * This allows us to simplify the Virtual Dom hierarchy because
  * we don't need to use the connect wrapping component.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required react react-router-dom react-redux ...
*/
const Main = React.memo( (props) => {

  //State variables to open or close Product details modal
  const [isProductDetailsModalOpen, updateIsProductDetailsModalOpen] = useState(false);
  const [productSelected, updateProductSelected] = useState(null);
  
  const reduxProps = useSelector(state => ({
    cartId: state.cart.cartId
  }), shallowEqual);
  
  const dispatch = useDispatch();
 
  //Toggles Product Details modal
  const toggleProductDetailsModal = (product) => {
    if (isProductDetailsModalOpen)
      product = null;
    
      updateProductSelected(product);
      updateIsProductDetailsModalOpen(!isProductDetailsModalOpen);
  };

  //Kind of like ComponentDidMount lifecycle method
  //Fetches initial data
  useEffect( () => {
    if (reduxProps.cartId)
      dispatch(fetchCartProducts(reduxProps.cartId, true));
    else
      dispatch(fetchCartUniqueId());
    dispatch(fetchDepartments());
    dispatch(fetchCategories());
    dispatch(fetchProducts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  //render main
  return (
      <div>
        <TopBar />
        <MainNav />
        <ProductDetailsModal 
        isModalOpen={isProductDetailsModalOpen} 
        toggleModal={toggleProductDetailsModal} 
        productSelected={productSelected} 
        />
        <div>
            {/* Wrapping Switch for React Router */}
            <Switch location={props.location}>
                <Route exact path={baseLocalRoute} render={() => HomePage({toggleProductDetailsModal:toggleProductDetailsModal})} />
                <Route path={`${baseLocalRoute}cart/`} render={() => CartPage({})} />
                <Route path={`${baseLocalRoute}shipping/`} render={ShippingPage} />
                <Redirect to={baseLocalRoute} />
            </Switch>
        </div>
        <Footer />
      </div>
    );
  });
  
  export default withRouter(Main);