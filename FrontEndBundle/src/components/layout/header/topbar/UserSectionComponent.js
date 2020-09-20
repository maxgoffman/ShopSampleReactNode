import React from 'react';
import { Button, UncontrolledDropdown,
    DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faShoppingBag, faUserCircle, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'; 
import {faFacebookF} from '@fortawesome/free-brands-svg-icons';
import FacebookLogin from 'react-facebook-login';
import styles from './TopBarComponent.module.scss';


  

/** 
  * @desc User Section component:
  * Shows a dropdown menu in case a Customer is logged in, or Sign in/Register links
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required font-awesome 5, bootstrap 4
*/
function UserSection (props) {
    const responseFacebook = (response) => {
        props.facebookCallback(response.accessToken);
    };
    
    if (props.customer.customer)
        return (
            <UncontrolledDropdown nav inNavbar>
                Hi! <DropdownToggle nav caret className={`${styles.dropdownbutton} ${styles.fucsiatextcolor}`} style={{display: 'inline-block'}}>{props.customer.customer.schema.name}
            </DropdownToggle>  
                <DropdownMenu className={styles.dropdownmenu}>
                    <DropdownItem onClick={props.callbackToCart} className={`${styles.bottomline}`}>
                        <FontAwesomeIcon icon={faShoppingBag} /> My Bag <hr />
                    </DropdownItem>
                    <DropdownItem className={`${styles.bottomline}`}>
                        <FontAwesomeIcon icon={faUserCircle} /> My Profile <hr />
                    </DropdownItem>
                    <DropdownItem onClick={props.logout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    else
        return (
            <li>Hi! <Button color="link" className={`${styles.usermenulink} ${styles.fucsiatextcolor}`} onClick={props.loginModal}>Sign in</Button>, <Button color="link" className={`${styles.usermenulink} ${styles.fucsiatextcolor}`} onClick={props.registerModal}>Register</Button> or Login with 
            <FacebookLogin
            appId="843168546139097"
            fields="name,email,picture"
            textButton=""
            cssClass={styles['facebook-button']}
            callback={responseFacebook}
            icon={<FontAwesomeIcon icon={faFacebookF} />} /></li> 
        );
};

export default UserSection;