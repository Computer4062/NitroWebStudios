import {useState, useEffect} from "react"

import NavBar from "../../components/navbar/NavBar.jsx"
import Footer from "../../components/footer/Footer.jsx"
import Search from "../../components/advanced-search/Search.jsx"
import Card from "../../components/card/Card.jsx"
import Ticker from '../../components/Ticker/Ticker'
import "./Inventory.css"

function Menu() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/vehicles/all')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setFilteredItems(data); // Initially show everything
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  useEffect(() => {
    const results = items.filter(item => 
      item.make.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(results);
  }, [searchTerm, items]);

  return (
    <>
        <section>
        <Ticker/>
      </section>

      <section>
        <NavBar/>
      </section>

      <section class="home-cover">
        <Search />
      </section>

      <section>
      <div class="album py-5 bg-body-tertiary">
      <div class="container">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">

        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Card item={item}/>
          ))
        ) : (
          <p class="text-muted">No items match your search.</p>
        )}

        </div>
      </div>
      </div>
      </section>

      <section>
      </section>

      <section>
        <Footer/>
      </section>
    </>
  )
}

export default Menu;