import React, { useContext, useState, useCallback, Fragment } from 'react';
import ModalContext from '../../context/modal-context';
import Spinner from '../Spinner/Spinner';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { FiUpload } from "react-icons/fi";
import { Modal, Button } from 'react-bootstrap';
import { FiDelete } from "react-icons/fi";

import './Modal.css';

const InfoModal = () => {
    const { modalInfo, showImportModal, setShowIportModal } = useContext(ModalContext);
    let [allFiles, setAllFiles] = useState([]);
    let [uploadingFiles, setUploadingFiles] = useState(false);
    let [showWarning, setShowWarning] = useState(false);

    const handleClose = () => setShowIportModal(false);

    const formatBytes = bytes => {
        if (bytes < 1024) return bytes + ' Bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + ' KB';
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + ' MB';
        else return (bytes / 1073741824).toFixed(3) + ' GB';
    };

    const convertToCSV = files => {
        if (!files.length) {
            setShowWarning(true);
        } else {
            setUploadingFiles(true);
            files.forEach((file, i) => {
                Papa.parse(file, {
                    complete: function (results) {
                        console.log(results);
                        if (files.length == i + 1) {
                            modalInfo(true, 'Confirmation', 'File was uploaded');
                            setUploadingFiles(false);
                            setAllFiles([]);
                            handleClose();
                        }
                    }
                });
            });
        }
    };

    const removeFile = file => {
        let newFileList = [];
        allFiles.map(e => {
            if (e.name != file.name && e.size != file.size) {
                newFileList.push(e);
            }
        });
        setAllFiles(newFileList);
    };

    const makeShorter = text => {
        if (text.length > 20) {
            return text.substring(0, 20) + '...';
        } else {
            return text;
        }
    };

    const maxSize = 50173280;

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length) {
            // setAllFiles(oldAllFiles => [...oldAllFiles, acceptedFiles[0]]);
            setAllFiles(() => [acceptedFiles[0]]);
            setShowWarning(false);
        }
    }, []);

    const { isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles } = useDropzone({
        onDrop,
        accept: 'text/csv,application/pdf,text/xml,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        minSize: 0,
        maxSize,
    });

    const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;

    return (
        <Fragment>
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered show={showImportModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Import expenses {uploadingFiles}</Modal.Title>
                </Modal.Header>
                {
                    !uploadingFiles ?
                        <Fragment>
                            <Modal.Body>
                                {
                                    showWarning ?
                                        <div className="alert alert-danger" role="alert">
                                            Please select a file first!
                                        </div> : null
                                }
                                <div >
                                    <ul>
                                        {
                                            allFiles.map((file) => (
                                                <li className='' key={file.name}  >{`${makeShorter(file.name)}  - (${formatBytes(file.size)})`}
                                                    <button className='btn_remove' onClick={() => removeFile(file)}>
                                                        <i><FiDelete size={20} /></i>
                                                    </button>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    <div className="drop_zone container text-center mt-5" {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {!isDragActive && <i>Click here or drop a file to upload! <FiUpload size={20} /></i>}
                                        {isDragActive && !isDragReject && "Drop it here!"}
                                        {isDragReject && "File type not accepted, sorry!"}
                                        {isFileTooLarge && (
                                            <div className="text-danger mt-2">
                                                File is too large.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Modal.Body>
                        </Fragment> : <Spinner />
                }
                <Modal.Footer>
                    <Button type='button' variant="primary" disabled={uploadingFiles} onClick={() => convertToCSV(allFiles)}>
                        Upload
                    </Button>
                    <Button variant="secondary" disabled={uploadingFiles} onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default InfoModal;