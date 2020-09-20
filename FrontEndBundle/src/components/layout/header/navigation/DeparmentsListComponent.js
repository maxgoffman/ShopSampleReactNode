import React from 'react';
import { Nav, NavItem } from 'reactstrap';
import { Loading } from '../../../controls/loadplaceholder/LoadingComponent';
import styles from './MainNavComponent.module.scss';

/** 
  * @desc Header Departments List component:
  * Shows an inline list of the departments.
  * @author Maximiliano Goffman maxgoffman@gmail.com
*/
function DepartmentsList({departments, isLoading, errMess, categoriesCallback}) {
    //if loading show placeholder
    if (isLoading) {
        return(
                <Loading spinnerStyle="fucsia-text-color" />
        );
    }
    else if (errMess) {
        //if error show message
        return(
                <h4>{errMess}</h4>
        );
    }
    else
        //render departments list
        return (
            <ListItems departments={departments} categoriesCallback={categoriesCallback} />
        );

        
}

function ListItems(props) {
    const navItems = props.departments.map((item) => {
        return (
            <CustomNavItem key={item.department_id} 
            padding={3} 
            style={styles['nav-link']}
            linkText={item.name}
            departmentId={item.department_id}
            categoriesCallback={props.categoriesCallback} />
        );
    });
    return (
        <Nav navbar className="mx-auto">
            {navItems}
        </Nav>
    );
}

function CustomNavItem(props) {
    
    const onCallbackButtonClick = () => {
        props.categoriesCallback(props.departmentId);
    }
    
    const paddingClass = "px-" + props.padding;
    return (
        <NavItem className={paddingClass}>
            <button className={`${props.style} btn btn-link`} onClick={onCallbackButtonClick}>{props.linkText}</button>
        </NavItem>
    );
}

export default DepartmentsList;