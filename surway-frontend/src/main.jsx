import React from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SurveyBuilder from "./pages/SurveyBuilder.jsx";
import Distributions from './pages/Distributions';
import DataAnalysis from './pages/DataAnalysis';
import Results from './pages/Results';
import Reports from './pages/Reports';
import Signup from './pages/Signup';
import VerifyUser from './pages/VerifyUser';
import Login from './pages/Login'; 
import App from './App.jsx'
import SurveyRespondent from "./pages/SurveyRespondent";
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children:[
      {
        path:'/',
        element:<Signup/>
      },
      {
        path:'/verify-user',
        element:<VerifyUser/>
      },
      {
        path:'/login',
        element:<Login/>
      },
      {
        path:'/home',
        element:<Home/>
      },
      {
        path: '/survey-builder/:id',
        element: <SurveyBuilder />
      },
      {
        path: '/survey/:id',
        element: <SurveyRespondent />
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
