import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import MainLayout from '../main-layout/MainLayout.jsx';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store/index.js';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<Provider store={store}>
				<Toaster position="top-center" reverseOrder={false} />
				<MainLayout />
		</Provider>
	</BrowserRouter>,
);
