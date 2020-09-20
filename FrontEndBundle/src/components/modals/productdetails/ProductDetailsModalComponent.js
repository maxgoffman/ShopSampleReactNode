import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import ReviewsArea from '../../controls/reviews/ReviewsAreaComponent';
import { addToCart } from '../../pages/cart/CartComponent';
import { addProductToCart, updateProductInCart } from '../../../redux/shoppingcart/ActionCreators';
import { postProductReviews }  from '../../../redux/products/ActionCreators';
import { postCustomerLoginOrRegister, postFacebookLoginOrRegister} from '../../../redux/customer/ActionCreators';
import ProductDetailsContent from './ProductDetailsContentComponent';
import LoginModal from '../usermodal/LoginModalComponent';
import styles from './ProductDetailsModalComponent.module.scss';
import RegisterModal from '../usermodal/RegisterModalComponent';

/** 
  * @desc Product Details Modal Component:
  * Shows a modal with images, attributes controls, add to cart button and product reviews.
  * Using connect instead of hooks because it really saves on rerenders, 
  * a detailed explanation about this is below.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required Cart Component, font-awesome 5, bootstrap 4
*/
const ProductDetailsModal = React.memo((props) => {
    const [colorIndex, updateColorIndex] = useState(null);
    const [isLoginModalOpen, updateIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, updateIsRegisterModalOpen] = useState(false);
    const [sizeIndex, updateSizeIndex] = useState(null);
    const [ratingIndex, updateRatingIndex] = useState(1);
    
    //adds product to cart
    const addToCartCallback = (event) => {
        event.preventDefault();
        const color = props.attributes[props.productSelected.product_id].attributes[props.attributes[props.productSelected.product_id].attributes.findIndex(item => item.attribute_value_id === colorIndex)].attribute_value;
        const size = props.attributes[props.productSelected.product_id].attributes[props.attributes[props.productSelected.product_id].attributes.findIndex(item => item.attribute_value_id === sizeIndex)].attribute_value;
        addToCart(props.productSelected.product_id, 
            `${color}, ${size}`, 
            (props.productSelected.discounted_price ? parseFloat(props.productSelected.discounted_price.toFixed(2)) : parseFloat(props.productSelected.price.toFixed(2))), 
            props.productSelected.name, props.details[props.productSelected.product_id].details.image,
            props.cartId,
            props.cartProducts,
            props.addToCart,
            props.updateInCart);
    }

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
        if (props.customer.customer && (Object.keys(props.customer.customer).length !== 0 && props.customer.customer.constructor === Object) && (isLoginModalOpen || isRegisterModalOpen)) {
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

    //adds review to product 
    const leaveReview = (event) => {
        event.preventDefault();
        if (Object.keys(props.customer.customer).length === 0) {
            toggleLoginModal();
            return;
        }
        const data = new FormData(event.target);
        const comment = data.get('reviewComment');
        const rating = ratingIndex;
        const name = props.customer.customer.customer.schema.name;
        const token = props.customer.customer.accessToken;
        props.postProductReviews(props.productSelected.product_id, comment, rating, name, token);
    }
    
    //render product details modal
    return (
        <Modal isOpen={props.isModalOpen} contentClassName={`p-3 ${styles.roundedborders}`} className={`${styles.modalstyle} modal-lg`} toggle={props.toggleModal}>
            <button type="button" className={`close ml-auto ${styles.nooutline}`} aria-label="Close" onClick={props.toggleModal}><FontAwesomeIcon icon={faTimesCircle} className="fucsia-text-color" /></button>
            <ProductDetailsContent
            productSelected={props.productSelected}
            details={props.details}
            attributes={props.attributes} 
            colorSelector={updateColorIndex} 
            sizeSelector={updateSizeIndex} 
            addToCart={addToCartCallback}
            disabled={!props.shoppingCartEnabled}
            cartError={props.cartErr} />
            <ReviewsArea leaveReview={leaveReview} product={props.productSelected} reviews={props.reviews} customer={props.customer} reviewRatingSelector={updateRatingIndex} />
            <LoginModal customerErrMess={props.customer.errMess} customerLoading={props.customer.isLoading} isModalOpen={isLoginModalOpen} toggleModal={toggleLoginModal} toggleRegister={toggleRegisterModal} customerCallback={props.customerCallback} facebookCallback={props.facebookCallback} />
            <RegisterModal customerErrMess={props.customer.errMess} customerLoading={props.customer.isLoading} isModalOpen={isRegisterModalOpen} toggleModal={toggleRegisterModal} toggleLogin={toggleLoginModal} customerCallback={props.customerCallback} facebookCallback={props.facebookCallback} />
        </Modal>
    );
},(props, nextProps) => {
    /* this is the real trick to avoid needless rerenders:
    it's like shouldComponentUpdate lifecycle method, it makes sure
    we don't re render when the modal is closed.
    It also checks that if the product details/reviews/attributes is updated
    it rerenders only if the selected product is modified.
    Finally, re renders when cart is updated.*/
    if (props.isModalOpen 
        && props.isModalOpen === nextProps.isModalOpen  
        && props.shoppingCartEnabled === nextProps.shoppingCartEnabled
        && props.cartId === nextProps.cartId
        && props.cartErr === nextProps.cartErr
        && props.productSelected
        && props.reviews[props.productSelected.product_id] === nextProps.reviews[props.productSelected.product_id]
        && props.attributes[props.productSelected.product_id] === nextProps.attributes[props.productSelected.product_id]
        && props.details[props.productSelected.product_id] === nextProps.details[props.productSelected.product_id]
        && props.customer.customer === nextProps.customer.customer
        && JSON.stringify(props.cartProducts) === JSON.stringify(nextProps.cartProducts))
        return true;
    return !(props.isModalOpen || nextProps.isModalOpen);
});

const mapStateToProps = state => {
    return {
        reviews: state.products.reviews,
        attributes: state.products.attributes,
        details: state.products.details,
        customer: state.customer,
        shoppingCartEnabled: (state.cart.cartId && state.cart.cartId !== '' && !state.cart.isLoading && !state.cart.errMess),
        cartId: state.cart.cartId,
        cartErr: state.cart.errMess,
        cartProducts: state.cart.products
    }
};
  
const mapDispatchToProps = dispatch => ({
    postProductReviews: (product_id, comment, rating, name, token) => dispatch(postProductReviews(product_id, comment, rating, name, token)),
    addToCart: (product_id, attributes, price, name, image) => dispatch(addProductToCart(product_id, attributes, price, name, image)),
    updateInCart: (product_id, attributes, item_id, prevQuantity, quantity, price, cart_id) => dispatch(updateProductInCart(product_id, attributes, item_id, prevQuantity, quantity, price, cart_id)),
    customerCallback: (email, password, name, newCustomer) => {dispatch(postCustomerLoginOrRegister(email, password, name, newCustomer))},
    facebookCallback: (access_token) => {dispatch(postFacebookLoginOrRegister(access_token))}
});

export default connect(mapStateToProps, mapDispatchToProps) (ProductDetailsModal);