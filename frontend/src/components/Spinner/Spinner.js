import React, { Fragment} from 'react';
import BackDrop from '../Backdrop/Backdrop'

import './Spinner.css';

const spinner = () => (
    <Fragment>
        <BackDrop />
        <div class="cssload-loader">
            <div class="cssload-inner cssload-one"></div>
            <div class="cssload-inner cssload-two"></div>
            <div class="cssload-inner cssload-three"></div>
        </div>
    </Fragment>
);

export default spinner;
