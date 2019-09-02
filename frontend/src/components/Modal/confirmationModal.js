import React, { useContext, Fragment } from 'react';
import ModalContext from '../../context/modal-context';
import { Modal, Button } from 'react-bootstrap';

import './Modal.css';

const InfoModal = () => {
    const { modalText, showInfoModal, setShowInfoModal, actionFunction } = useContext(ModalContext);
    const handleClose = () => setShowInfoModal(false);

    return (
        <Fragment>
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered show={showInfoModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Please confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalText}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={actionFunction}>
                        Yes
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default InfoModal;