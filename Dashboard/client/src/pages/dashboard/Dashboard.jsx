import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

import Dash from "../../components/Dashboard/Dash.jsx"
import Nav from "../../components/Dashboard/Nav.jsx"

function Dashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
	const checkUserAuth = async() => {
		try{
			const response = await fetch("http://localhost:3000/api/accounts/check-auth", {
				method: 'GET',
				credentials: 'include'
			});

			if(response.status === 401){
				// If not logged in, kick them to login page
				navigate("/login");
      }

      const data = await response.json();
      setIsAdmin(data.admin);

		} catch(error) {
			navigate("/login");
		}
	}

	checkUserAuth();
  }, [navigate]);

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/menu/all')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <>
      <Dash />

      <div class="container-fluid">
      <div class="row">

        <Nav isAdmin={isAdmin} />

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Dashboard</h1>
          </div>
          
          <div class="d-flex">
            <h2>Menu Items</h2>
            <button type="button" class="btn btn-primary mx-3" onClick={(e) => navigate('/dashboard/add')}>Add items +</button>
          </div>

          <div class="table-responsive small">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price ($)</th>
                  <th scope="col">Type</th>
                  <th scope="col">Offer</th>
                  <th scope="col">View / Edit</th>
                </tr>
              </thead>
              <tbody>

                {items.map((item, index) => (
                <tr id={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.type}</td>
                  <td>{item.offer ? "Yes" : "No"}</td>
                  <td><button>Edit</button></td>
                </tr>
                ))}

              </tbody>
            </table>
          </div>
        </main>
      </div>
      </div>
    </>
  )
}

export default Dashboard;