import React from 'react';
import { Col, Row } from 'reactstrap';
import ImageDetails from '../../controls/image/ImageDetailsComponent';
import AttributesArea from '../../controls/attributes/AttributesAreaComponent';
import styles from './ProductDetailsModalComponent.module.scss';

/** 
  * @desc Product Details Content Component:
  * Renders Details Section in Product Details Modal
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required font-awesome 5, bootstrap 4
*/
function ProductDetailsContent(props) {
    if (props.productSelected)
        //render product details content
        return (
            <React.Fragment>
                <Row>
                    <Col xs={{offset:4}}>
                        <h2 className="modal-title">{props.productSelected.name}</h2>
                    </Col>
                </Row>
                <Row>
                    <ImageDetails productSelected={props.productSelected.product_id} details={props.details} />
                    <Col xs={7} className="ml-2 px-0">
                        <PriceArea productSelected={props.productSelected}  />
                        <DescriptionArea 
                        details={props.details} 
                        productSelected={props.productSelected.product_id}
                        description={props.productSelected.description} />
                        <AttributesArea
                        productSelected={props.productSelected.product_id} 
                        attributes={props.attributes} 
                        colorSelector={props.colorSelector} 
                        sizeSelector={props.sizeSelector} 
                        addToCart={props.addToCart}
                        disabled={props.disabled}
                        cartError={props.cartError} />
                    </Col>
                </Row>
            </React.Fragment>
        );
        else
            //render nothing
            return(<React.Fragment></React.Fragment>);       
}

function PriceArea(props) {
    if (props.productSelected.discounted_price) {
        return (
            <Row className="mb-2">
                <Col xs={12}>
                    <span className={`bodysmall fucsia-text-color ${styles.strikethrough}`}>{`$${props.productSelected.price.toFixed(2)}`}</span>
                    <span className={`fucsia-text-color ml-3 opensans-bold`}>{`$${props.productSelected.discounted_price.toFixed(2)}`}</span>
                </Col>
            </Row>
        );
    }
    else {
        return (
            <Row className="mb-2">
                <Col xs={12}>
                    <span className={`fucsia-text-color opensans-bold`}>{`$${props.productSelected.price.toFixed(2)}`}</span>
                </Col>
            </Row>
        );
    }
}

function DescriptionArea (props) {
    if (!props.details[props.productSelected] || props.details[props.productSelected].isLoading || props.details[props.productSelected].errMess) {
        return (
            <Row className="mb-2">
                <Col xs={12}>
                    <span className={`bodysmall`}>{props.description}</span>
                </Col>
            </Row>
        );
    }
    else {
        return (
            <Row className="mb-2">
                <Col xs={12}>
                    <span className={`bodysmall`}>{props.details[props.productSelected].details.description}</span>
                </Col>
            </Row>
        );
    }
}

export default ProductDetailsContent;