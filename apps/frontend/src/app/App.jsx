import { Routes, Route } from "react-router-dom"

import HomePage from '../layout/MainLayout.jsx'
import MainLayout from '../pages/HomePage.jsx'
import SignupPage from '../pages/SignupPage.tsx'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout><HomePage></HomePage></MainLayout>}></Route>
      <Route path='/signup' element={<SignupPage />} />
    </Routes>
  ) 
}