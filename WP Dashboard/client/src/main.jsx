import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'

import Home from './home.jsx'
import Inventory from './pages/inventory/Inventory.jsx'
import Details from "./pages/inventory/Details.jsx"
import Contact from './pages/contact/Contact.jsx'
import Team from './pages/team/Team.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/inventory/:id" element={<Details/>}/>
      <Route path="/contact" element={<Contact />} />
      <Route path="/team" element={<Team />} />
    </Routes>
  </BrowserRouter>
)
