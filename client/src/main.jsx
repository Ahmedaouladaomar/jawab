import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { MantineProvider } from '@mantine/core';
import { Security } from './context/index.jsx';
import { NavigationProgress } from '@mantine/nprogress';
import { Notifications } from '@mantine/notifications';

ReactDOM.createRoot(document.getElementById('root')).render(
    <MantineProvider>
        <NavigationProgress />
        <Notifications position="top-right" zIndex={1000} containerWidth="300" />
        <Security>
            <App />
        </Security>
    </MantineProvider>
);
