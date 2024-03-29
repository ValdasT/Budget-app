
import React, { useState, useEffect, Fragment } from 'react';
import OneTest from '../components/OneTest/OneTest';
import TwoTest from '../components/OneTest/TwoTest';
import TestContext from '../context/test-context';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const Example = () => {


    const myQuery = gql`query {
        allFiles {
            _id
            title
            description
          }
      }`;

    let [show, setshow] = useState(false);

    let showChnge = () => {
        setshow(show = <div>
            <h1>----------------------</h1>
            <Query query={myQuery}>
                {
                    ({ loading, err, data }) => {
                        if (loading) return <h1>Loading</h1>;
                        if (err) return <h1>{err}</h1>;
                        if (data) {
                            { setFruit((fruit = fruitPicker())) }
                            return (<Fragment >{
                                data.allFiles.map(e => (
                                    <div key={e._id}>{e._id}</div>
                                    
                                ))
                            }</Fragment>);
                        }

                    }
                }
            </Query>
            <h1>----------------------</h1>
        </div>);
    };
    // Declare a new state variable, which we'll call "count"
    let [count, setCount] = useState(0);
    let [fruit, setFruit] = useState('Fakama');
    let [dataFromDb, setdataFromDb] = useState([]);

    const fruitPicker = () => {
        let frutList = ['Banana', 'Abricot', 'Apple', 'Kiwi'];
        let frutituti = frutList[Math.floor(Math.random() * frutList.length)];
        return frutituti;
    };

    const tesFunction = value => {
        console.log(value);
    };

    useEffect(() => {
        document.title = `You clicked ${count} times`;
        tesFunction(fruit);
    }, [fruit]);

    const clearMagick = () => {
        setdataFromDb (dataFromDb = []);
    };

    const makemagick = () => {
        const requestBody = {
            query: `
              query {
                allFiles {
                    _id
                    title
                    description
                  }
              }
            `
        };
    
        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                setdataFromDb (dataFromDb=resData.data.allFiles);
                console.log(dataFromDb);
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <TestContext.Provider value={{ count, fruit, dataFromDb }}>
            <OneTest />
            {show}
            <button onClick={() => { showChnge(); }}>Show?</button>
            {/* <Query query={myQuery}>
                {
                    ({ loading, err, data }) => {
                        if (loading) return <h1>Loading</h1>;
                        if (err) console.log(err);
                        if (data) {
                            return (<Fragment>{

                                data.allFiles.map(e => (
                                    <div key={e._id}>{e._id}</div>
                                    
                                ))
                            }</Fragment>);
                        }

                    }
                }
            </Query> */}
            <button className="btn btn-primary btn-sm mr-2" onClick={() => makemagick()}>
                Get Files from db!
            </button>
            <button disabled={!dataFromDb.length} className="btn btn-primary btn-sm" onClick={() => clearMagick()}>
                Clear from screen
            </button>
            <Fragment>
                <div>
                There is {dataFromDb.length} in db!
                </div>
                {
                    
                    dataFromDb.map(e => (
                        <div key={e._id}>{e._id}</div>
                    ))
                }
            </Fragment>
            <p>You clicked {count} times</p>
            <button className="btn btn-primary btn-sm" onClick={() => setCount(count + 1)}>
                Click me +1
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setCount(count - 1)}>
                Click me -1
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setCount((count = 0))}>
                reset
            </button>
            <div>
                <p>You faforite fruit is {fruit} </p>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setFruit((fruit = fruitPicker()))}
                >
                    pick fruit
                </button>
            </div>
        </TestContext.Provider>
    );
};

export { Example as default };
