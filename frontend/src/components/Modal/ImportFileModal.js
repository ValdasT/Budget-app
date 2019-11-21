import React, { useContext, useState, useCallback, Fragment } from 'react';
import ModalContext from '../../context/modal-context';
import ExpensesContext from '../../context/expenses-context';
import Spinner from '../Spinner/Spinner';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import XLSX from 'xlsx';
import { Modal, Button } from 'react-bootstrap';
import { FiDelete, FiUpload } from "react-icons/fi";
import { FaFileExcel } from "react-icons/fa";
import FileSaver from 'file-saver';
import axios from 'axios';

import './Modal.css';

const ImportModal = () => {
    const { modalInfo, showImportModal, setShowIportModal } = useContext(ModalContext);
    const { submitExpenseFromImport, setAllExpenses } = useContext(ExpensesContext);
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
            let extension = files[0].name.split('.');
            extension = extension[extension.length - 1].toLowerCase();
            if (extension === 'csv') {
                csvToJson(files[0]);
            } else {
                const reader = new FileReader();
                reader.onload = function (e) {
                    let bstr = e.target.result;
                    let wb = XLSX.read(bstr, { type: 'binary', header: 1, cellDates: true, dateNF: 'MM/DD/YYYY' });
                    let wsname = wb.SheetNames[0];
                    let ws = wb.Sheets[wsname];
                    let csv = XLSX.utils.sheet_to_csv(ws, { header: 1, raw: false });
                    csvToJson(csv);
                };
                let binaryFile = reader.readAsBinaryString(files[0]); // it triger reader, don't delete
            }
        }
    };

    const csvToJson = csv => {
        Papa.parse(csv, {
            complete: function (results) {
                createNewCards(results);
            }
        });
    };

    const createNewCards = async fromFile => {
        let formatedArray = [{
            title: '',
            description: '',
            price: '',
            group: '',
            createdAt: '',
            tag: ''
        }];
        let preparedToDb = [];
        let fields = await searchFields(fromFile.data[0]);
        fields.forEach((fromFile, j) => {
            if (fromFile.name.toLowerCase() === 'title') {
                formatedArray[0].title = fields[j].id;
            }
            if (fromFile.name.toLowerCase() === 'description') {
                formatedArray[0].description = fields[j].id;
            }
            if (fromFile.name.toLowerCase() === 'price') {
                formatedArray[0].price = fields[j].id;
            }
            if (fromFile.name.toLowerCase() === 'group') {
                formatedArray[0].group = fields[j].id;
            }
            if (fromFile.name.toLowerCase() === 'date') {
                formatedArray[0].createdAt = fields[j].id;
            }
            if (fromFile.name.toLowerCase() === 'type') {
                formatedArray[0].tag = fields[j].id;
            }
        });
        fromFile.data.forEach((element, i) => {
            if (i !== 0 && element[0].length) {
                preparedToDb.push({
                    title: element[formatedArray[0].title],
                    description: element[formatedArray[0].description],
                    price: element[formatedArray[0].price],
                    group: element[formatedArray[0].group],
                    createdAt: element[formatedArray[0].createdAt],
                    tag: element[formatedArray[0].tag]
                });
            }
        });
        let newFromDb = [];
        preparedToDb.forEach(async e => {
            newFromDb.push(await submitExpenseFromImport(e));
            if (formatedArray.length === newFromDb.length) {
                await setAllExpenses(newFromDb);
                modalInfo(true, 'Confirmation', 'File was uploaded');
                setUploadingFiles(false);
                setAllFiles([]);
                handleClose();
            }
        });
    };

    const searchFields = fieldsArray => {
        return new Promise((res, rej) => {
            let mandataryFields = ['Title', 'Price', 'Group', 'Date', 'Type', 'Description'];
            let numbers = [];
            let missingFields = [];
            mandataryFields.forEach(name => {
                let found = false;
                fieldsArray.forEach((field, i) => {
                    if (name.toLocaleLowerCase() === field.toLowerCase()) {
                        found = true;
                        numbers.push({
                            name: name,
                            id: i
                        });
                    }
                });
                if (!found) {
                    missingFields.push(name);
                }
            });
            if (missingFields.length) {
                let createErrMsg = '';
                missingFields.forEach((field, i) => {
                    if (missingFields.length === i + 1) {
                        createErrMsg += ` "${field}".`;
                    } else {
                        createErrMsg += ` "${field}";`;
                    }
                });
                modalInfo(true, 'Error', `Inappropriate file. Missing fields in the file:${createErrMsg}`);
                setUploadingFiles(false);
                setAllFiles([]);
                handleClose();
            } else {
                res(numbers);
            }
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

    const downloadFileFromDb = (name) => {
        axios({
            method: "GET",
            url: `/file/${name}`,
            responseType: "blob",
        })
            .then(response => {
                console.log(response);
                FileSaver.saveAs(response.data, `example.xlsx`);
            })
            .then(() => {
                console.log("Completed");
            }).catch(error => {
                console.log(error)
            });
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
        // accept: 'text/csv,application/pdf,text/xml,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        accept: 'text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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
                                <div className="mt-2">
                                    <a onClick={() => { downloadFileFromDb(`9d51495ee31655607488187b3b3f4b14.xlsx`) }} style={{ cursor: 'pointer' }}>
                                        <i><FaFileExcel size={20} color={"grey"} /></i> - Download template file.
                                    </a>
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

export default ImportModal;