import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ImageProvider } from './context/ImageContext';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <ImageProvider>
                <App />
            </ImageProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
