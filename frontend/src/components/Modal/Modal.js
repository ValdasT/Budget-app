import React, { useContext, useState, Fragment } from 'react';
import ModalContext from '../../context/modal-context';
import { Modal, Button } from 'react-bootstrap';

import './Modal.css';

const InfoModal = () => {
    const { modalHeader, modalText, showModal, setShowModal } = useContext(ModalContext);
    const handleClose = () => setShowModal(false);

    return (
        <Fragment>
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalHeader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalText}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default InfoModal;