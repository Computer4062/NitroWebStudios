import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'

// Client end related pages
import Home from './home.jsx'
import Inventory from './pages/inventory/Inventory.jsx'
import Details from "./pages/inventory/Details.jsx"
import Login from './pages/login/Login.jsx'
import Contact from './pages/contact/Contact.jsx'
import Team from './pages/team/Team.jsx'

// Admin end related pages
import Dashboard from './pages/dashboard/Board/Dashboard.jsx'
import ItemsList from './pages/dashboard/Items/ItemsList.jsx'
import AddItems from './pages/dashboard/Items/AddItems.jsx'
import Editor from './pages/dashboard/Items/Editor.jsx'
import Drafts from './pages/dashboard/Items/Drafts.jsx'
import HelpCenter from './pages/dashboard/HelpCenter/HelpCenter.jsx'
import Logs from './pages/dashboard/Audits/Audits.jsx'
import DataBase from './pages/dashboard/DataBase/DataBase.jsx'
import Accounts from './pages/dashboard/Accounts/Accounts.jsx'
import Profile from './pages/dashboard/Profile/Profile.jsx'
import MyPosts from './pages/dashboard/Profile/MyPosts.jsx'
import EMPTY from "./pages/dashboard/empty_page/EMPTY.jsx"

// Admin Guard
import AdminGuard from './utilities/AdminGuard.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/inventory/:id" element={<Details/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/team" element={<Team />} />

      /* Dashboard navigation paths */
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/dashboard/items" element={<ItemsList />} />
      <Route path="/dashboard/items/add" element={<AddItems />} />
      <Route path="/dashboard/items/drafts" element={<Drafts />} />
      
      <Route path="/dashboard/items/editor" element={<Editor />} />
      <Route path="/dashboard/info" element={<HelpCenter />} />
      <Route path="/dashboard/logs" element={<Logs />}/>
      <Route path="/dashboard/database" element={<DataBase />}/>

      <Route path="/dashboard/accounts" element={ <AdminGuard> <Accounts /> </AdminGuard>}/>
      <Route path="/dashboard/profile" element={<Profile />}/>
      <Route path="/dashboard/mylistings" element={<MyPosts />}/>

      <Route path="/dashboard/empty" element={<EMPTY />}/>
    </Routes>
  </BrowserRouter>
)
