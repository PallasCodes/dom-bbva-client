import { createBrowserRouter, Navigate } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import { Layout } from '../Layout'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage
  },
  {
    path: '*',
    element: <h1>Not found</h1>
  }
])
