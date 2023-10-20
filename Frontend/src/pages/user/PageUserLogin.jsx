import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { Card, Button, Form, ListGroup, Image } from 'react-bootstrap';
import { Stack } from '@mui/material';
import * as Icon from '@mui/icons-material';

export default function PageUserLogin({ api }) {
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
			const response = await api.request('/api/user/login/', 'POST', formdata)
			const data = await response.json();
			if(response.status === 200){
				api.user.setUser(data.user);
				api.session.setSession(data.sessionid);
			}
			else if(response.status === 401){
				setErrorMsg(data.msg);
			}
		}catch(error){ alert(error) } 
	}
	const getSessionID = async ()=>{
		const response = await api.request('/api/user/me/get/', 'GET')
		const data = await response.json();
		if(response.status === 200){
			api.user.setUser(data.user);
			api.session.setSession(data.sessionid);
		}
	}

	useEffect(() => {
		if(api.session.id != null) navigate("/");
		else{
			getSessionID();
		}
	}, [api.session.id])

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
			<ListGroup className='mb-3'>
				<ListGroup.Item>
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="username">
							<Form.Label>Username</Form.Label>
							<Form.Control type="text" placeholder="Enter username" name="username" value={formdata.username || ""} onChange={handleChange} autoFocus />
						</Form.Group>
						<Form.Group className="mb-3" controlId="password">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" placeholder="Password" name="password" value={formdata.password || ""} onChange={handleChange}  />
						</Form.Group>
						<Card.Text className="text-danger">{errorMsg}</Card.Text>
						<Button variant="primary" type='submit'>Login</Button>
						<Card.Text className='mt-3'><small className="text-muted">New user? → <a href="/account/register">Create an account</a></small></Card.Text>
					</Form>
				</ListGroup.Item>
				<ListGroup.Item>
					<Card.Text className='mb-2'>Althernative login</Card.Text>
					<Form action='/api/user-social/google/login/' method='GET' className='mb-2'>
						<Button variant='outline-secondary' type='submit'>
							<Stack direction="row" spacing={1} alignItems={'center'}>
								<Image src='https://www.svgrepo.com/show/303108/google-icon-logo.svg' style={{width:'20px', height:'20px'}}></Image>
								<div>Login with Google</div>
							</Stack>
						</Button>
					</Form>
				</ListGroup.Item>
			</ListGroup>
		</>
	);
}