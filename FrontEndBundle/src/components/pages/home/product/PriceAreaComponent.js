import React from 'react';
import { Row, Col } from 'reactstrap';
import styles from '../HomeComponent.module.scss';

/** 
  * @desc Price Area Component:
  * Separated this to make it more readable.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required bootstrap 4
*/
function PriceArea(props) {
    if (props.item.discounted_price) {
        return (
            <Row key={props.index} className="mb-3">
                <Col>
                    <span className={`bodynormal fucsia-text-color ${styles.strikethrough}`}>{`$${props.item.price.toFixed(2)}`}</span>
                </Col>
                <Col className="d-flex">
                    <span className={` ${styles.pricetag} py-0 px-1 bodynormal`}>{`$${props.item.discounted_price.toFixed(2)}`}</span>
                </Col>
            </Row>
        );
    }
    else {
        return (
            <Row key={props.index} className="mb-3">
                <Col xs={{offset:7}}>
                    <span className={` ${styles.pricetag} py-0 px-1 bodynormal`}>{`$${props.item.price.toFixed(2)}`}</span>
                </Col>
            </Row>
        );
    }
}

export default PriceArea;