import React from 'react';
import { Loading } from '../../../controls/loadplaceholder/LoadingComponent';
import { Row, Col, CardDeck, Card, CardBody, CardImg, CardText } from 'reactstrap';
import PageNav from '../../../controls/pages/PageNavComponent';
import PriceArea from './PriceAreaComponent';
import WrappingElement from './WrappingElementComponent';
import styles from '../HomeComponent.module.scss';
import { baseUrl, imagesUrl } from '../../../../shared/baseUrl';

/** 
  * @desc Products List Component:
  * Displays a list of product cards.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required bootstrap 4
*/
function ProductsList(props) {
    //still loading - show placeholder
    if (props.isLoading) {
        return(
            <Col sm={{size:10, offset:0}} xs={{size:10, offset:0}}>
                <Loading spinnerStyle="fucsia-text-color" />
            </Col>
        );
    }
    else if (props.errMess) {
        //error - show message
        return(
            <Col sm={{size:10, offset:0}} xs={{size:10, offset:0}}>
                <h4>{props.errMess}</h4>
            </Col>
        );
    }
    else
        //render products list
        return (
            <Col sm={{size:10, offset:0}} xs={{size:6, offset:2}}>
                <Row>
                    <Col sm={{offset:3}} className={styles.mleftxs}>
                        <PageNav productsDepartment={props.productsDepartment} productsCategory={props.productsCategory} productsPage={props.productsPage} productsTotal={props.productsTotal} productsCallback={props.productsCallback} />
                    </Col>
                </Row>
                <ListItems products={props.products} toggleProductDetailsModal={props.toggleProductDetailsModal} />
            </Col>
        );
}

function ListItems(props) {
    const items = props.products.map((item, index, list) => {
            
        return (
            <React.Fragment key={index}>
                <Card tag="a" onClick={() => props.toggleProductDetailsModal(item)} style={{ cursor: "pointer" }} className={`my-2 text-center ${styles.cardwidth}`}>
                    <h3 className="mt-3">{item.name}</h3>
                    <div className={`mx-auto ${styles.productcardthumbnail}`}>
                        <CardImg top src={`${baseUrl}${imagesUrl}${item.thumbnail}`} alt={item.name}  />
                    </div>
                    <CardBody>
                        <PriceArea item={item} index={index} />
                        <CardText className="bodysmall gray-text-color text-left">{item.description}</CardText>
                    </CardBody>
                </Card>
                <WrappingElement index={(index + 1)} totalElements={list.length} />
            </React.Fragment>
        );
    });
    return (<CardDeck className="pl-md-4">{items}</CardDeck>);
}

export default ProductsList;