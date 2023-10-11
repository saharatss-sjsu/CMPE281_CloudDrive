import { Card } from 'react-bootstrap';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function PageUserLogout({ api }) {
	const navigate = useNavigate();

	function logout(){
		console.log('logging out');
		try{
			api.request('/api/user/logout/')
			.then(response => response.json())
			.then(data => {
				console.log('logout successful', data.success);
				if(data.success){
					api.session.clearSession();
					navigate("/account/login");
				}
			})
		}catch(error){ console.log(error) } 
	}

	useEffect(() => {
		logout();
	});

	return (
		<>
			<Card className='mb-3'>
				<Card.Body>
					<Card.Text>Logging out...</Card.Text>
					<a href="/">← Go back to homepage</a>
				</Card.Body>
			</Card>
		</>
	);
}