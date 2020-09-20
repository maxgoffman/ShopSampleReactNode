import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faInstagram, faFacebookF, faLinkedinIn, faTwitter, faYoutube, faPinterest} from '@fortawesome/free-brands-svg-icons';
import DepartmentsList from './DepartmentsListComponent';
import fetchCategories from '../../../redux/categories/ActionCreators';
import { fetchProducts }  from '../../../redux/products/ActionCreators';
import { baseLocalRoute } from '../../../shared/baseUrl';
import styles from './FooterComponent.module.scss';

/** 
  * @desc Footer component:
  * Shows the footer elements.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required Departments List Component, font-awesome 5
*/
function Footer(props) {
    
    //get list of departments from redux store
    const reduxProps = useSelector(state => ({
        departments:state.departments.departments,
        departmentsLoading:state.departments.isLoading,
        departmentsErrMess:state.departments.errMess
    }), shallowEqual);

    const dispatch = useDispatch();

    //dispatchs a fetch in case a department is clicked
    const callbackFetchCategories = (departmentId) => {
        dispatch(fetchCategories(departmentId));
        dispatch(fetchProducts(1, '', departmentId));
        if (props.location.pathname !== baseLocalRoute)
            props.history.push(baseLocalRoute);  
    };

    //render footer
    return(
        <React.Fragment>
            {/*first row: departments list*/}
            <Row  className={styles['navbar-style']}>
                <div className="col-12 col-sm-4 align-self-center mx-auto my-3">
                    <div className="text-center">
                        <DepartmentsList 
                            departments={reduxProps.departments} 
                            isLoading={reduxProps.departmentsLoading}
                            errMess={reduxProps.departmentsErrMess}  
                            categoriesCallback={callbackFetchCategories} 
                            />
                    </div>
                </div>
            </Row>
            {/*second row: social icons list*/}
            <Row  className={styles['navbar-style']}>
                <div className="col-12 col-sm-4 align-self-center mx-auto mb-3">
                    <div className="text-center">
                        <Row>
                            <Col xs={12} sm={4} md={2}><a className="btn btn-light rounded-circle p-2 m-1" href="http://instagram.com/"><div style={{width: '24px', height:'24px'}}><FontAwesomeIcon icon={faInstagram} /></div></a></Col>
                            <Col xs={12} sm={4} md={2}><a className="btn btn-light rounded-circle p-2 m-1" href="http://www.facebook.com/profile.php?id="><div style={{width: '24px', height:'24px'}}><FontAwesomeIcon icon={faFacebookF} /></div></a></Col>
                            <Col xs={12} sm={4} md={2}><a className="btn btn-light rounded-circle p-2 m-1" href="http://www.linkedin.com/in/"><div style={{width: '24px', height:'24px'}}><FontAwesomeIcon icon={faLinkedinIn} /></div></a></Col>
                            <Col xs={12} sm={4} md={2}><a className="btn btn-light rounded-circle p-2 m-1" href="http://twitter.com/"><div style={{width: '24px', height:'24px'}}><FontAwesomeIcon icon={faTwitter} /></div></a></Col>
                            <Col xs={12} sm={4} md={2}><a className="btn btn-light rounded-circle p-2 m-1" href="http://youtube.com/"><div style={{width: '24px', height:'24px'}}><FontAwesomeIcon icon={faYoutube} /></div></a></Col>
                            <Col xs={12} sm={4} md={2}><a className="btn btn-light rounded-circle p-2 m-1" href="http://pinterest.com/"><div style={{width: '24px', height:'24px'}}><FontAwesomeIcon icon={faPinterest} /></div></a></Col>
                        </Row>
                    </div>
                </div>
            </Row>
            {/*third row: Copyright, contact and legal links*/}
            <Row  className={styles['navbar-style']}>
                <div className="col-12 col-sm-4 align-self-center mx-auto">
                    <div className="text-center mb-3">
                        <Row>
                            <Col xs={12} sm={4} className="px-0"><NavLink className={styles['footersmall']} to={baseLocalRoute}>&copy;2019 Max Goffman</NavLink></Col>
                            <Col xs={12}  sm={4} className="px-0">
                                <NavLink className={styles['footersmall']} to={baseLocalRoute}>Contact</NavLink>
                            </Col>
                            <Col xs={12}  sm={4} className="px-0">
                                <NavLink className={styles['footersmall']}  to={baseLocalRoute}>Privacy policy</NavLink>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Row>
        </React.Fragment>
    );

}

export default withRouter(Footer);