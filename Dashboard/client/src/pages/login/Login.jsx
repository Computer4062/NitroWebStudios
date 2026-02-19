import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

function Login() {
	const [formData, setFormData] = useState({username: '', password: ''});
	const navigate = useNavigate();

	// Check if user is already logged in
	useEffect(() => {
		const checkUserAuth = async() => {
			try{
				const response = await fetch("http://localhost:3000/api/accounts/check-auth", {
					method: 'GET',
					credentials: 'include'
				});

				if(response.status !== 401){
					// If not logged in, kick them to login page
					navigate("/dashboard");
				}

			} catch(error) {
				console.error(error.message);
			}
		}

		checkUserAuth();
	}, [navigate]);

	// For submitting entry form
	const handleSubmit = async (e) => {
		e.preventDefault();

		try{
			const response = await fetch('http://localhost:3000/api/accounts/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
				credentials: 'include'
			});

			if (!response.ok){
				// If back end sends 401 or 400 show the notification
				const data = await response.json();
				alert(data.message);

			} else {
				navigate("/dashboard");
			}

		} catch(error){
			console.error("Network error: ", error);
		}
	}

  return (
    <>
	<div class="d-flex align-items-center justify-content-center py-4 bg-body-tertiary vw-100 vh-100">
		<main class="form-signin m-auto" style={{ width: '300px'}}>
		<form onSubmit={handleSubmit}>
			<img class="mb-4" src="../../public/icon.png" alt="" width="72" height="57" />

			<h1 class="h3 mb-3 fw-normal">Please sign in</h1>
			<div class="form-floating pb-1">
			<input 
				type="username" 
				class="form-control" 
				id="floatingInput" 
				placeholder="username"
				onChange={(e) => setFormData({...formData, username: e.target.value})} />
			<label for="floatingInput">username</label>
			</div>

			<div class="form-floating mb-3">
			<input 
				type="password" 
				class="form-control" 
				id="floatingPassword"
				placeholder="Password"
				onChange={(e) => setFormData({...formData, password: e.target.value})} />
			<label for="floatingPassword">Password</label>
			</div>

			<button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
			
			<hr />
			<p class="mb-3 text-body-secondary">Powered by NitroWeb Studios</p>
		</form>
		</main>

	</div>
    </>
  )
}

export default Login;