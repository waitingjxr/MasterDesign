import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "reset-css"
import { BrowserRouter } from 'react-router-dom';

// 状态管理
import { Provider } from 'react-redux';
import store from './redux_store/store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter> 
            <App />
        </BrowserRouter>
    </Provider>
);
