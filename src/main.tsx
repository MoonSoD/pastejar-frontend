import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './pages/index.tsx'
import './App.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorPage } from './error-page.tsx';
import Login from './pages/login.tsx';
import Register from './pages/register.tsx';
import PastesPage from './pages/pastes.tsx';
import PastePage from './pages/paste.tsx';
import TagsPage from './pages/tags.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/pastes",
    element: <PastesPage />,
  },
  {
    path: "/paste/:id",
    element: <PastePage />,
  },
  {
    path: "/tags",
    element: <TagsPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
