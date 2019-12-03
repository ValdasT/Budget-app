import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

describe('Render application', () => {
    it('render without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App />, div);
    });
});