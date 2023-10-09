import { Card } from 'react-bootstrap';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import BACKEND_HOST from '../../index';

export default function PageUserLogout({ session }) {
	const navigate = useNavigate();

	function logout(){
		console.log('logging out');
		try{
			fetch(`${BACKEND_HOST}/api/auth/logout/`,{
				'method':'GET',
				'mode': 'cors',
				'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
				'credentials': 'include',
				'headers': {
					'Access-Control-Allow-Origin': 'http://localhost:3000',
					'Cookie': `sessionid=${session.sessionID}`,
				}
			}).then(response => response.json())
			.then(data => {
				console.log('logout successful', data.success);
				if(data.success){
					session.setSessionID("");
					navigate("/account/login");
				}
			})
		}catch(error){ console.log(error) } 
	}

	useEffect(() => {
		logout();
	});

	// useEffect(() => {
	// 	console.log('sessionID', session.sessionID);
	// 	if(session.sessionID == "") navigate("/account/login");
	// }, [session.sessionID])

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