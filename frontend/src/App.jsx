import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import ProtectRoute from './components/ProtectRoute'
import SearchItems from './pages/SearchItems'
import History from './pages/History'
import Deliver from './pages/Deliver'
import Cart from './pages/Cart'
import Item from './pages/Item'
import AddItem from './pages/AddItem' 

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={
          <ProtectRoute>
            <Profile />
          </ProtectRoute>
        } />
        <Route path="/addItem" element={
          <ProtectRoute>
            <AddItem />
          </ProtectRoute>
        } />
        <Route path="/SearchItems" element={
          <ProtectRoute>
            <SearchItems />
          </ProtectRoute>
        } />
        <Route path="/history" element={
          <ProtectRoute>
            <History />
          </ProtectRoute>
        } />
        <Route path="/deliver" element={
          <ProtectRoute>
            <Deliver />
          </ProtectRoute>
        } />
        <Route path="/cart" element={
          <ProtectRoute>
            <Cart />
          </ProtectRoute>
        } />
        <Route path='/item/:id' element={
          <ProtectRoute>
            <Item />
          </ProtectRoute>
        } />

      </Routes>
    </>
  )
}

export default App
