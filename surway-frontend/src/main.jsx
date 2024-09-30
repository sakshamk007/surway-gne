import React from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SurveyBuilder from "./pages/SurveyBuilder.jsx";
import Distributions from './pages/Distributions';
import DataAnalysis from './pages/DataAnalysis';
import Results from './pages/Results';
import Reports from './pages/Reports';
import App from './App.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path: '/survey-builder/:id',
        element: <SurveyBuilder />
      },
      // {
      //   path: '/survey-builder/:id/distributions',
      //   element: <Distributions />,
      // },
      // {
      //   path: '/survey-builder/:id/data-analysis',
      //   element: <DataAnalysis />,
      // },
      // {
      //   path: '/survey-builder/:id/results',
      //   element: <Results />,
      // },
      // {
      //   path: '/survey-builder/:id/reports',
      //   element: <Reports />,
      // },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
