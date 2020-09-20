import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { fetchProducts }  from '../../../redux/products/ActionCreators';
import CategoriesList from './category/CategoriesListComponent';
import ProductsList from './product/ProductsListComponent';

/** 
  * @desc Home Page Component:
  * Handles all about the default page.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required Categories List Component, Products List Component
*/
function Home(props) {
    const reduxProps = useSelector(state => ({
        categories:state.categories.categories,
        categoriesLoading:state.categories.isLoading,
        categoriesErrMess:state.categories.errMess,
        productsDepartment:state.categories.departmentId,
        products: state.products.products,
        productsLoading: state.products.isLoading,
        productsErrMess: state.products.errMess,
        productsCategory: state.products.categoryId,
        productsTotal: state.products.totalProducts,
        productsPage: state.products.currentPage,
          
    }), shallowEqual);

    const dispatch = useDispatch();

    //fetch products in case a category was selected
    const productsCallback = (...args) => {
        dispatch(fetchProducts(...args));
    }

    //render home
    return(
        <div className="container">
            <Row>
                <Col xs={{size:2, offset:3}} md={{size:2, offset:0}}>
                    <CategoriesList
                        categories={reduxProps.categories}
                        isLoading={reduxProps.categoriesLoading}
                        errMess={reduxProps.categoriesErrMess}
                        productsCallback={productsCallback}  
                        />
                </Col>
                <ProductsList
                    products={reduxProps.products}
                    isLoading={reduxProps.productsLoading}
                    errMess={reduxProps.productsErrMess}
                    productsPage={reduxProps.productsPage}
                    productsCategory={reduxProps.productsCategory}
                    productsDepartment={reduxProps.productsDepartment}
                    productsTotal={reduxProps.productsTotal}
                    productsCallback={productsCallback}
                    toggleProductDetailsModal={props.toggleProductDetailsModal}
                    />
            </Row>
        </div>
    );
}

function HomePage(props) {
    return(
      <Home {...props} />
    );
  }

export default HomePage;