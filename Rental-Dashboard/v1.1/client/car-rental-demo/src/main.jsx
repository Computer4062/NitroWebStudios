import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'

// Client end pages
import Home from './pages/Home/Home.jsx'
import Inventory from './pages/Inventory/Inventory.jsx'
import Details from './pages/Details/Details.jsx'
import Contacts from './pages/Contact/Contact.jsx'
import Services from './pages/Services/Services.jsx'

import Login from './pages/login/Login.jsx'

// Admin/User end pages
import Dashboard from './pages/dashboard/Board/Dashboard.jsx'
import ItemsList from './pages/dashboard/Items/ItemsList.jsx'
import AddItems from './pages/dashboard/Items/AddItems.jsx'
import Editor from './pages/dashboard/Items/Editor.jsx'
import HelpCenter from './pages/dashboard/HelpCenter/HelpCenter.jsx'
import Logs from './pages/dashboard/Audits/Audits.jsx'
import DataBase from './pages/dashboard/DataBase/DataBase.jsx'
import Accounts from './pages/dashboard/Accounts/Accounts.jsx'
import Profile from './pages/dashboard/Profile/Profile.jsx'
import MyPosts from './pages/dashboard/Profile/MyPosts.jsx'
import EMPTY from "./pages/dashboard/empty_page/EMPTY.jsx"
import AdminGuard from './utilities/AdminGuard.jsx'
import UserGuard from './utilities/UserGuard.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/inventory/:id" element={<Details />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contacts" element={<Contacts />} />

      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/dashboard/items" element={<ItemsList />} />
      <Route path="/dashboard/items/add" element={<AddItems />} />
      
      <Route path="/dashboard/items/editor" element={<Editor />} />
      <Route path="/dashboard/info" element={<HelpCenter />} />
      <Route path="/dashboard/logs" element={<Logs />}/>
      <Route path="/dashboard/database" element={<DataBase />}/>

      <Route path="/dashboard/accounts" element={<Accounts />}/>
      <Route path="/dashboard/profile" element={<Profile />}/>
      <Route path="/dashboard/mylistings" element={<MyPosts />}/>

      <Route path="/dashboard/empty" element={<EMPTY />}/>
    </Routes>
  </BrowserRouter>
)