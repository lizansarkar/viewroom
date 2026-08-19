import { Routes, Route, Navigate } from 'react-router-dom'
import AppRouter from '../router/AppRouter'

function Router() {
  return (
    <Routes>
      <Route path="/*" element={<AppRouter />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default Router
