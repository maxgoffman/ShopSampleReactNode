import React, { useState } from 'react';
import { Button, Modal, ModalBody,
    Form, FormGroup, Input, Label, Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';    
import FacebookLogin from 'react-facebook-login';
import {Loading} from '../../controls/loadplaceholder/LoadingComponent';
import ErrorLine from '../../controls/error/ErrorLineComponent';
import styles from './UserModalComponent.module.scss';

/** 
  * @desc Register Modal Component:
  * Self explanatory
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required font-awesome 5, bootstrap 4
*/
function RegisterModal(props) {
    
    let username;
    let email;
    let password;
    let passwordconfirm;
    const [localErrMess, updateLocalErrMess]  = useState(null);
    
    //Register user
    const handleRegister = (event) => {
        event.preventDefault();
        if (passwordconfirm.value !== password.value)
        {
            updateLocalErrMess("Passwords don't match!");
            return;
        }
        updateLocalErrMess(null);
        props.customerCallback(email.value, password.value, username.value, true);
    }

    const responseFacebook = (response) => {
        props.facebookCallback(response.accessToken);
    };

    const RegisterModalContent = () => {
        if (props.customerLoading) {
            return (<Loading divStyle={styles.loadingheight} spinnerStyle="fucsia-text-color" />);
        }
        else {
            return(
                <ModalBody>
                    <Form onSubmit={handleRegister}>
                        <FormGroup className="my-0 py-0">
                            <Label htmlFor="username" className={styles.labelmodal}>Name *</Label>
                            <Input className={`${styles.modalinputfield} ${styles.nooutline} my-0`} type="text" id="username" name="username"
                                    innerRef={(input) => username = input} />
                        </FormGroup>
                        <FormGroup className="my-0 py-0">
                            <Label htmlFor="email" className={styles.labelmodal}>Email *</Label>
                            <Input className={`${styles.modalinputfield} ${styles.nooutline} my-0`} type="text" id="email" name="email"
                                    innerRef={(input) => email = input} />
                        </FormGroup>
                        <FormGroup className="my-3 py-0 row">
                                <Col xs={6}>
                                    <Label htmlFor="password" className={styles.labelmodal}>Password *</Label>
                                    <Input className={`${styles.modalinputfield} ${styles.nooutline} mb-3`} type="password" id="password" name="password"
                                        innerRef={(input) => password = input}/>
                                </Col>
                                <Col xs={6}>
                                    <Label htmlFor="passwordconfirm" className={styles.labelmodal}>Confirm your Password *</Label>
                                    <Input className={`${styles.modalinputfield} ${styles.nooutline} mb-3`} type="password" id="passwordconfirm" name="passwordconfirm"
                                        innerRef={(input) => passwordconfirm = input}/>
                                </Col>
                                <ErrorLine errorstyle="bodysmall fucsia-text-color" errMess={localErrMess ? localErrMess : props.customerErrMess} />
                        </FormGroup>
                        <div className="text-center mb-2">
                            <Button type="submit" value="submit" color="secondary" className={styles.modalbutton}>CREATE ACCOUNT</Button>
                        </div>
                        {/*Login modal Link */}
                        <div className="bodysmall gray-text-color">Already have an account? <Button color="link" className={styles.registerlink} onClick={props.toggleLogin}>Login</Button></div>
                    </Form>
                </ModalBody>
            );
        }
    };
    return (
        <Modal isOpen={props.isModalOpen} contentClassName={`p-3 ${styles.roundedborders}`} className={`${styles.modalstyle} ${styles.registermodalwidth}`} toggle={props.toggleModal} centered>
            <button type="button" className={`close ml-auto ${styles.nooutline}`} aria-label="Close" onClick={props.toggleModal}><FontAwesomeIcon icon={faTimesCircle} className="fucsia-text-color" /></button>
            <div className="mx-auto">
                <h1 className="modal-title">Register</h1>
            </div>
            <div className={`${styles.modalsmall} text-center`}>* All Fields Are Required!</div>    
            
            <RegisterModalContent />
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

export default RegisterModal;