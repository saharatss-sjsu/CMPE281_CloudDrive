import { Card, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import BACKEND_HOST from '../../index';

export default function PageUserLogin({ session }) {
	const [formdata, setFormdata] = useState({});
	const [errorMsg, setErrorMsg] = useState("");

	const navigate = useNavigate();

	const handleChange = (event) => {
		const name  = event.target.name;
		const value = event.target.value;
		setFormdata(values => ({...values, [name]: value}))
	}
	const handleSubmit = async (event) => {
		event.preventDefault();
		try{
			const response = await fetch(`${BACKEND_HOST}/api/auth/login/`,{
				'method':'POST',
				'content-type':'application/json',
				'body':JSON.stringify(formdata)
			});
			const data = await response.json();
			if(response.status === 200){
				console.log('get sessionID', data.sessionid);
				// setCookie('sessionid', data.sessionid, {sameSite: 'lax'});
				session.setSessionID(data.sessionid);
			}
			else if(response.status === 401){
				setErrorMsg(data.msg);
			}
		}catch(error){ alert(error) } 
	}

	useEffect(() => {
		console.log('sessionID', session.sessionID);
		if(session.sessionID != null) navigate("/");
	}, [session.sessionID])


	// useEffect(() => {
	// 	return ()=>{
	// 		const sessionID = cookies.sessionid;
	// 		console.log('sessionid', sessionID);
	// 		if(sessionID != null) navigate("/");
	// 	}
	// }, []);

	return (
		<>
			<Card className='mb-3'>
				<Card.Body>
					<Card.Title>Saharat CloudDrive</Card.Title>
					<Card.Text>This is a cloud file storage project, part of the class CMPE 281 at San Jose State University (SJSU), to demonstrate web application development integrated with Amazon Web Services (AWS).
					</Card.Text>
				</Card.Body>
				<Card.Footer>
					<small className="text-muted">Developed by Saharat Saengsawang</small>
				</Card.Footer>
			</Card>
			<Card className='mb-3'>
				<Card.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="username">
							<Form.Label>Username</Form.Label>
							<Form.Control type="text" placeholder="Enter username" name="username" value={formdata.username || ""} onChange={handleChange} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="password">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" placeholder="Password" name="password" value={formdata.password || ""} onChange={handleChange}  />
						</Form.Group>
						<Card.Text className="text-danger">{errorMsg}</Card.Text>
						<Button variant="primary" type='submit'>
							Login
						</Button>
					</Form>
				</Card.Body>
				<Card.Footer>
					<small className="text-muted">New user? → <a href="">Create an account</a></small>
				</Card.Footer>
			</Card>

			{session.sessionID != null ? <a href="/">← Go back to homepage</a>:<></>}
			
		</>
	);
}