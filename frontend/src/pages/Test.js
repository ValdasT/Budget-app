
import React, { useState, useEffect } from 'react';
import OneTest from '../components/OneTest/OneTest';
import TestContext from '../context/test-context';

const Example=() =>{
    // Declare a new state variable, which we'll call "count"
    let [count, setCount] = useState(0);
    let [fruit, setFruit] = useState('Fakama');

    const fruitPicker = () => {
        let frutList = ['Banana', 'Abricot', 'Apple', 'Kiwi'];
        let frutituti = frutList[Math.floor(Math.random() * frutList.length)];
        return frutituti;
    };

    const tesFunction = value => {
        console.log(value);
    };

    useEffect(() => {
        // Update the document title using the browser API
        document.title = `You clicked ${count} times`;
        tesFunction(fruit);
    }, [fruit]);

    return (
        <TestContext.Provider value={{ count , fruit}}>
            <OneTest/>
            <p>You clicked {count} times</p>
            <button className="btn" onClick={() => setCount(count + 1)}>
                Click me +1
            </button>
            <button className="btn" onClick={() => setCount(count - 1)}>
                Click me -1
            </button>
            <button className="btn" onClick={() => setCount((count = 0))}>
                reset
            </button>
            <div>
                <p>You faforite fruit is {fruit} </p>
                <button
                    className="btn"
                    onClick={() => setFruit((fruit = fruitPicker()))}
                >
                    pick fruit
                </button>
            </div>
        </TestContext.Provider>
    );
}

export { Example as default };
