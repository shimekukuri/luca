import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './error.tsx';
import Layout from './Layout.tsx';
import SessionPicker, { SessionLoader } from './routes/sessionpicker/SessionLog.tsx';
import SessionLog, { SessionLogLoader } from './routes/sessionlog/SessionLogger.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "session",
        loader: SessionLoader,
        element: <SessionPicker />
      },
      {
        path: "session/:session_id",
        loader: SessionLogLoader,
        element: <SessionLog />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
