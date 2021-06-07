import React from 'react'
import { Navigate } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import DashboardLayout from './components/DashboardLayout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ProductList from './pages/ProductList'
import ProjectList from './pages/ProjectList'
import Settings from './pages/Settings'
import Account from './pages/Account'
import CreateAccount from './pages/CreateAccount'
import Company from './pages/Company'
import CreateCompany from './components/company/CreateCompany'
import EditCompany from './components/company/EditCompany'
import CustomerList from './pages/CustomerList'
import Dashboard from './pages/Dashboard'

import CreateProject from './components/project/CreateProject'
import EditProject from './components/project/EditProject'
// import ProjectDetails from './components/project/ProjectDetails'
import ProjectDetailsNew from './components/project/ProjectDetailsNew'
const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'account/new', element: <CreateAccount /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <ProductList /> },
      { path: 'projects', element: <ProjectList /> },
      { path: 'projects/new', element: <CreateProject /> },
      { path: 'projects/edit/:id', element: <EditProject /> },
      { path: 'projects/details/:id', element: <ProjectDetailsNew /> },
      { path: 'company', element: <Company /> },
      { path: 'company/new', element: <CreateCompany /> },
      { path: 'company/edit/:id', element: <EditCompany /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      // { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
]

export default routes
