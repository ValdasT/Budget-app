import React, { useState, useContext, Fragment } from 'react';
import TestContext from '../../context/test-context';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const TwoTest = () => {

    const myQuery = gql`query {
        allFiles {
            _id
            title
            description
          }
      }`;
    
    let saySomething = () => {
        console.log("test!");
    }

    const { count, fruit, dataFromDb } = useContext(TestContext);

    let [name, setName] = useState('Baravykas');
    return (
        <div>
            <h1>----------------------</h1>
            <Query query={myQuery}>
                {
                    ({ loading, err, data }) => {
                        if (loading) return <h1>Loading</h1>;
                        if (err) return <h1>{err}</h1>;
                        if (data) {
                            { saySomething(); }
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
        </div>
    );
};

export { TwoTest as default };