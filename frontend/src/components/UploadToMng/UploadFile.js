import React, { useContext, useState, useCallback, Fragment } from 'react';
import Spinner from '../Spinner/Spinner';
import InfoModal from '../Modal/Modal';
import ModalContext from '../../context/modal-context';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from "react-icons/fi";
import { FiDelete } from "react-icons/fi";
import FileSaver from 'file-saver';
import axios from 'axios';

import './UploadFile.css';

const UploadFile = () => {
    let [allFiles, setAllFiles] = useState([]);
    let [uploadingFiles, setUploadingFiles] = useState(false);
    let [showWarning, setShowWarning] = useState(false);
    let [modalHeader, setModalHeader] = useState('');
    let [modalText, setModalText] = useState();
    let [showInfoModal, setShowInfoModal] = useState(false);
    let [image, setImage] = useState('');

    const modalInfo = (show, header, text) => {
        setShowInfoModal(show);
        setModalHeader(header);
        setModalText(text);
    };

    const formatBytes = bytes => {
        if (bytes < 1024) return bytes + ' Bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + ' KB';
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + ' MB';
        else return (bytes / 1073741824).toFixed(3) + ' GB';
    };

    const uploadFileToDb = files => {
        if (!files.length) {
            setShowWarning(true);
        } else {
            let data = new FormData()
            data.append('file', files[0])
            setUploadingFiles(true);
            fetch('/upload', {
                method: 'POST',
                body: data,
            })
                .then(res => {
                    console.log(res);
                    setUploadingFiles(false);
                    if (res.status !== 200 && res.status !== 201) {
                        throw new Error('Failed!');
                    }
                    return res;
                })
                .then(resData => {
                    setAllFiles([]);
                    modalInfo(true, 'Succsess', 'File was uploaded to db.');
                    setUploadingFiles(false);
                })
                .catch(err => {
                    setUploadingFiles(false);
                    modalInfo(true, 'Error', err);
                    console.log(err);
                });
        }
    };

    const downloadFileFromDb = () => {
        let fileName = '7c6ee306971e226ac39f2b5ffc53d192.png';

        axios({
            method: "GET",
            url: `/file/${fileName}`,
            responseType: "blob",
        })
            .then(response => {
                console.log(response);
                FileSaver.saveAs(response.data, fileName);
            })
            .then(() => {
                console.log("Completed");
            }).catch(error => {
                console.log(error)
            });
    };

    const removeFile = file => {
        let newFileList = [];
        allFiles.map(e => {
            if (e.name !== file.name && e.size !== file.size) {
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

    const { isDragActive, getRootProps, getInputProps, isDragReject, rejectedFiles } = useDropzone({
        onDrop,
        accept: 'text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, image/png, image/jpeg, application/pdf',
        minSize: 0,
        maxSize,
    });

    const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;

    return (
        <Fragment>
            <ModalContext.Provider value={{ showInfoModal, setShowInfoModal, modalHeader, modalText, modalInfo }}>
                {
                    !uploadingFiles ?
                        <Fragment>
                            <InfoModal />
                            <div className="container h-100">
                                <div className="row h-100 justify-content-center">
                                    <div className='dropBox'>
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
                                                        <li className='text-left' key={file.name}  >{`${makeShorter(file.name)}  - (${formatBytes(file.size)})`}
                                                            <button className='btn_remove' onClick={() => removeFile(file)}>
                                                                <i><FiDelete size={20} /></i>
                                                            </button>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                            <div className="drop_zone container text-center " {...getRootProps()}>
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
                                        <button className="btn btn_main button_Upload" onClick={() => { uploadFileToDb(allFiles) }}> Upload</button>
                                        <button className="btn btn_main button_Upload" onClick={() => { downloadFileFromDb() }}> Download</button>
                                    </div>
                                </div>
                            </div>
                        </Fragment> : <Spinner />
                }
            </ModalContext.Provider>
        </Fragment>
    );
};

export default UploadFile;