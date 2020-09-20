import React from 'react';
import { Button, Modal, ModalBody,
    Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import FacebookLogin from 'react-facebook-login';
import {Loading} from '../../controls/loadplaceholder/LoadingComponent';
import ErrorLine from '../../controls/error/ErrorLineComponent';
import styles from './UserModalComponent.module.scss';

/** 
  * @desc Login Modal Component:
  * Self explanatory
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required font-awesome 5, bootstrap 4
*/
function LoginModal(props) {
    
    let username;
    let password;
    
    //logins
    const handleLogin = (event) => {
        event.preventDefault();
        props.customerCallback(username.value, password.value);
    }

    const responseFacebook = (response) => {
        props.facebookCallback(response.accessToken);
    };

    const LoginModalContent = () => {
        if (props.customerLoading) {
            return (<Loading divStyle={styles.loadingheight} spinnerStyle="fucsia-text-color" />);
        }
        else {
            return(
                <ModalBody>
                    <Form onSubmit={handleLogin}>
                        <FormGroup className="my-0 py-0">
                            <Label htmlFor="username" className={styles.labelmodal}>Email *</Label>
                            <Input className={`${styles.modalinputfield} ${styles.nooutline} my-0`} type="text" id="username" name="username"
                                    innerRef={(input) => username = input} />
                        </FormGroup>
                        <FormGroup className="my-0 py-0">
                                <Label htmlFor="password" className={styles.labelmodal}>Password *</Label>
                                <Input className={`${styles.modalinputfield} ${styles.nooutline} mb-3`} type="password" id="password" name="password"
                                    innerRef={(input) => password = input}/>
                                <ErrorLine errorstyle="bodysmall fucsia-text-color" errMess={props.customerErrMess} />
                        </FormGroup>
                        <div className="text-center mb-3">
                            <Button type="submit" value="submit" color="secondary" className={styles.modalbutton}>SIGN IN</Button>
                        </div>
                        {/*Register link*/}
                        <div className="bodysmall gray-text-color">Don't have an account? <Button color="link" className={styles.registerlink} onClick={props.toggleRegister}>Register</Button></div>
                    </Form>
                </ModalBody>
            );
        }
    };
    return (
        <Modal isOpen={props.isModalOpen} contentClassName={`p-3 ${styles.roundedborders}`} className={`${styles.modalstyle} modal-sm`} toggle={props.toggleModal} centered>
            <button type="button" className={`close ml-auto ${styles.nooutline}`} aria-label="Close" onClick={props.toggleModal}><FontAwesomeIcon icon={faTimesCircle} className="fucsia-text-color" /></button>
            <div className="mx-auto">
                <h1 className="modal-title">Sign in</h1>
            </div>
            <div className={`${styles.modalsmall} text-center`}>* All Fields Are Required!</div>    
            <LoginModalContent />
            <Row className="justify-content-center">
                <FacebookLogin
                appId="843168546139097"
                fields="name,email,picture"
                cssClass={styles['facebook-button']}
                callback={responseFacebook} />
            </Row>
        </Modal>
    );
}

export default LoginModal;