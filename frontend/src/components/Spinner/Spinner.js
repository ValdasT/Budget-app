import React, { Fragment} from 'react';
import BackDrop from '../Backdrop/Backdrop';

import './Spinner.css';

const spinner = () => (
    <Fragment>
        <BackDrop />
        <div className="cssload-loader">
            <div className="cssload-inner cssload-one"></div>
            <div className="cssload-inner cssload-two"></div>
            <div className="cssload-inner cssload-three"></div>
        </div>
    </Fragment>
);

export default spinner;
