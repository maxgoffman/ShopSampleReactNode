import React from 'react';
import { Row, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Loading } from '../../controls/loadplaceholder/LoadingComponent';
import styles from './FooterComponent.module.scss';
import { baseLocalRoute } from '../../../shared/baseUrl';

function CustomNavItem(props) {
    
    const onCallbackButtonClick = () => {
        props.categoriesCallback(props.departmentId);
    }
    
    return (
        <Col sm={12} md={4} className="px-0">
            <NavLink className={styles['nav-link']} to={baseLocalRoute} onClick={onCallbackButtonClick}>{props.linkText}</NavLink>
        </Col>
    );
}

function ListItems(props) {
    const navItems = props.departments.map((item) => {
        return (
            <CustomNavItem key={item.department_id} 
            linkText={item.name}
            departmentId={item.department_id}
            categoriesCallback={props.categoriesCallback} />
        );
    });
    return (
        <Row>
            {navItems}
        </Row>
    );
}

/** 
  * @desc Footer Departments List component:
  * Shows an inline list of the departments.
  * @author Maximiliano Goffman maxgoffman@gmail.com
*/
function DepartmentsList({departments, isLoading, errMess, categoriesCallback}) {
    //if loading show placeholder
    if (isLoading) {
        return(
            <Row>    
                <Loading spinnerStyle="fucsia-text-color" />
            </Row>
        );
    }
    else if (errMess) {
        //if error show message
        return(
            <Row>
                <h4>{errMess}</h4>
            </Row>
        );
    }
    else
        //render departments list
        return (
            <ListItems departments={departments} categoriesCallback={categoriesCallback} />
        );

        
}

export default DepartmentsList;