import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, Collapse, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircle, faShoppingBag} from '@fortawesome/free-solid-svg-icons';
import LoginModal from '../../../modals/usermodal/LoginModalComponent';
import RegisterModal from '../../../modals/usermodal/RegisterModalComponent';
import { postCustomerLoginOrRegister, postFacebookLoginOrRegister, customerLogout} from '../../../../redux/customer/ActionCreators';
import UserSection from './UserSectionComponent';
import { baseLocalRoute } from '../../../../shared/baseUrl';
import styles from './TopBarComponent.module.scss';

/** 
  * @desc Top Bar component:
  * Shows user section, a menu that is not implemented and the Shopping bag
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required User Section Component, font-awesome 5
*/
function TopBar(props) {
    //get customer and general cart data from redux store
    const reduxProps = useSelector(state => ({
        customer:state.customer.customer,
        customerLoading:state.customer.isLoading,
        customerErrMess:state.customer.errMess,
        cartQuantity:state.cart.totalProducts,
        cartTotalAmount:state.cart.totalAmount  
      }), shallowEqual);
    
    const dispatch = useDispatch();
    
          
    const [isNavOpen] = useState(false);
    const [isLoginModalOpen, updateIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, updateIsRegisterModalOpen] = useState(false);
    
    //toggles login modal
    const toggleLoginModal = () => {
        updateIsRegisterModalOpen(false);
        updateIsLoginModalOpen(!isLoginModalOpen);
    }
    
    //toggles register modal
    const toggleRegisterModal = () => {
        updateIsLoginModalOpen(false);
        updateIsRegisterModalOpen(!isRegisterModalOpen);   
    }

    //kind of like ComponentDidUpdate lifecycle method
    const didMountRef = useRef(false);
    const didUpdate = () => {
        if (reduxProps.customer && (Object.keys(reduxProps.customer).length !== 0 && reduxProps.customer.constructor === Object) && (isLoginModalOpen || isRegisterModalOpen)) {
            updateIsLoginModalOpen(false);
            updateIsRegisterModalOpen(false);
        }
    }
    useEffect(() => {
        if (didMountRef.current) {
            didUpdate();
        } 
        else 
            didMountRef.current = true;
    });
    
    //navigates to cart page
    const navigateToCart = () => {
        props.history.push(`${baseLocalRoute}cart/`); 
    }

    //logs out user
    const logout = () => { dispatch(customerLogout())};
              
    //logins or registers customer
    const customerCallback= (email, password, name, newCustomer) => {dispatch(postCustomerLoginOrRegister(email, password, name, newCustomer))};
    
    //logins or registers customer
    const facebookCallback= (access_token) => {dispatch(postFacebookLoginOrRegister(access_token))};
    

    //render top bar
    return(
        <React.Fragment>
            <Navbar dark expand="md" className={styles['navbar-style']}>
                <div className="container">
                    <UserSection customer={reduxProps.customer} loginModal={toggleLoginModal} registerModal={toggleRegisterModal} logout={logout} callbackToCart={navigateToCart} facebookCallback={facebookCallback} />
                    <Collapse isOpen={isNavOpen} navbar>
                        <Nav navbar className="mx-auto">
                            <NavItem className="px-3">
                                <NavLink className={styles['nav-link']}  to={baseLocalRoute}>Daily Deals</NavLink>
                            </NavItem>
                            <NavItem className="px-3">
                                <NavLink className={styles['nav-link']} to={baseLocalRoute}>Sell</NavLink>
                            </NavItem>
                            <NavItem className="px-3">
                                <NavLink className={styles['nav-link']}  to={baseLocalRoute}>Help &amp; Contact</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink className={styles.baglink}  to={`${baseLocalRoute}cart/`}><ShoppingBagIcon cartQuantity={reduxProps.cartQuantity} /><span>&nbsp;&nbsp;Your Bag: <span className={styles.fucsiatextcolor}>${reduxProps.cartTotalAmount.toFixed(2)}</span></span></NavLink>
                        </NavItem>
                    </Nav>
                </div>
            </Navbar>
            <LoginModal customerErrMess={reduxProps.customerErrMess} customerLoading={reduxProps.customerLoading} isModalOpen={isLoginModalOpen} toggleModal={toggleLoginModal} toggleRegister={toggleRegisterModal} customerCallback={customerCallback} facebookCallback={facebookCallback} />
            <RegisterModal customerErrMess={reduxProps.customerErrMess} customerLoading={reduxProps.customerLoading} isModalOpen={isRegisterModalOpen} toggleModal={toggleRegisterModal} toggleLogin={toggleLoginModal} customerCallback={customerCallback} facebookCallback={facebookCallback} />
        </React.Fragment>
    );
}

function ShoppingBagIcon(props) {
    if (props.cartQuantity === 0) {
        return (<FontAwesomeIcon icon={faShoppingBag} />);
    }
    else {
        return (
        <span className="fa-stack has-badge" data-count={props.cartQuantity}>
            <FontAwesomeIcon icon={faCircle} className="white-background-color" />
            <FontAwesomeIcon icon={faShoppingBag} />
        </span>);
    }
}

export default withRouter(TopBar);