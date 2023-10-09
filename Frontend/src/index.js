import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";

import App from './app'

const BACKEND_HOST = 'http://localhost:8000'
export default BACKEND_HOST

// const router = createBrowserRouter([
// 	{
// 		path: "/",
// 		element: <PageHome />,
// 		errorElement: <PageError />,
// 	},
// 	{
// 		path: "account",
// 		element: <PageUserBase />,
// 		errorElement: <PageError />,
// 		children: [
// 			{
// 				path: "login",
// 				element: <PageUserLogin />,
// 			},
// 			{
// 				path: "logout",
// 				element: <PageUserLogout />,
// 			},
// 		],
// 	},
// ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		{/* <RouterProvider router={router} /> */}
		<App />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
