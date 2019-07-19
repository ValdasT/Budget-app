import React, { useState, useContext } from 'react';
import TestContext from '../../context/test-context';

const OneTest = () => {

    const { count, fruit } = useContext(TestContext);

    let [name, setName] = useState('Baravykas');


    return (
        <div>
            <p>Your name is {name} {count}</p>
            <button className="btn" onClick={() => setName(name = 'Johan')}>
                Johan
            </button>
            <button className="btn" onClick={() => setName(name = 'Perter')}>
                Peter
            </button>
            <button className="btn" onClick={() => setName((name = fruit))}>
                Putin
            </button>
        </div>
    );
};

export { OneTest as default };