import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'

// Demo related pages
import Dashboard from './Demo Site/pages/dashboard/Board/Dashboard.jsx'
import ItemsList from './Demo Site/pages/dashboard/Items/ItemsList.jsx'
import Editor from './Demo Site/pages/dashboard/Items/Editor.jsx'
import AddItems from './Demo Site/pages/dashboard/Items/AddItems.jsx'
import Drafts from './Demo Site/pages/dashboard/Items/Drafts.jsx'
import Profile from './Demo Site/pages/dashboard/Profile/Profile.jsx'
import SiteEditor from './Demo Site/pages/dashboard/SiteEditor/Editor.jsx'

import Home from './Demo Site/home.jsx'
import Inventory from './Demo Site/pages/inventory/Inventory.jsx'
import Details from "./Demo Site/pages/inventory/Details.jsx"
import Login from './Demo Site/pages/login/Login.jsx'
import Contact from './Demo Site/pages/contact/Contact.jsx'
import Team from './Demo Site/pages/team/Team.jsx'

// Main site related pages
import SiteHomePage from './Home/Home.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* Home page routes */}
      <Route path="/" element={<SiteHomePage />} />

      {/* Demo site pages */}
      <Route path="/demo/01" element={<Home />} />
      <Route path="/demo/01/inventory" element={<Inventory />} />
      <Route path="/demo/01/inventory/:id" element={<Details/>}/>
      <Route path="/demo/01/login" element={<Login />} />
      <Route path="/demo/01/contact" element={<Contact />} />
      <Route path="/demo/01/team" element={<Team />} />

      {/* Dashboard navigation paths */}
      <Route path="/demo/01/dashboard" element={<Dashboard />} />
      <Route path="/demo/01/dashboard/items" element={<ItemsList />} />
      <Route path="/demo/01/dashboard/items/editor" element={<Editor />} />
      <Route path="/demo/01/dashboard/items/add" element={<AddItems />} />
      <Route path="/demo/01/dashboard/items/drafts" element={<Drafts />} />
      <Route path="/demo/01/dashboard/profile" element={<Profile />} />
      <Route path="/demo/01/dashboard/site-editor" element={<SiteEditor />} />
    </Routes>
  </BrowserRouter>
)
