import React, {useState} from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Navbar, Collapse, 
     NavbarBrand, NavbarToggler } from 'reactstrap';
import DepartmentsList from './DeparmentsListComponent';
import SearchField from '../../../controls/search/SearchFieldComponent';
import fetchCategories from '../../../../redux/categories/ActionCreators';
import { fetchProducts, searchProducts }  from '../../../../redux/products/ActionCreators';
import { baseLocalRoute } from '../../../../shared/baseUrl';
import styles from './MainNavComponent.module.scss';


/** 
  * @desc Main Nav component:
  * Shows the brand logo, navigational Menu and search field
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required Departments List Component, Search Field Component
*/
function MainNav(props) {
    const [isNavOpen, updateIsNavOpen] = useState(false);
    const [query, updateQuery] = useState('');

    
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
    
    //updates query state with input
    const handleInputChange = (event) =>  {
        const query = event.target.value;
    
        updateQuery(query);
    }

    //navigates to main page
    //fetch categories and products
    const navigateToMain = (event) => {
        event.preventDefault();
        event.target.blur();
        dispatch(fetchCategories());
        dispatch(fetchProducts());
        if (props.location.pathname !== baseLocalRoute)
            props.history.push(baseLocalRoute);
    }

    //Handle search event
    const onHandleSearch = (event) => {
        event.preventDefault();
        
        navigateToMain(event);
        dispatch(searchProducts(query));
    }

    //Handles Enter key (in case a search is wanted)
    const handleKeyDown = (event) =>  {
        if (event.key === 'Enter') {
            onHandleSearch(event);
        }
    }

    //toggles departments navigational menu in smaller resolutions (like mobile)
    const toggleNav = () => {
        updateIsNavOpen(!isNavOpen);
    }

    //render main nav
    return(
        <React.Fragment>
            <Navbar dark expand="md" className={styles['navbar-style']}>
                <div className="container">
                    <NavbarBrand className={`${styles.navbarbrandstyle} ml-3`} href={baseLocalRoute} onClick={navigateToMain}>BRAND NAME</NavbarBrand>
                    <Collapse isOpen={isNavOpen} navbar>
                        <DepartmentsList 
                        departments={reduxProps.departments} 
                        isLoading={reduxProps.departmentsLoading}
                        errMess={reduxProps.departmentsErrMess}  
                        categoriesCallback={callbackFetchCategories} 
                        />
                        <SearchField isLoading={reduxProps.departmentsLoading} handleKeyDown={handleKeyDown} handleInputChange={handleInputChange} handleSearch={onHandleSearch} />
                    </Collapse>
                    <NavbarToggler className="ml-auto" onClick={toggleNav} />
                </div>
            </Navbar>
        </React.Fragment>
    );
}

export default withRouter(MainNav);