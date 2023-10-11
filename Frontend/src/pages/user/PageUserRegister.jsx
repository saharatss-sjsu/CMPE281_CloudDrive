import { Card, Button, Form, ListGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function PageUserLogin({ api }) {
	const [formdata, setFormdata] = useState({});
	const [errorMsg, setErrorMsg] = useState("");

	const navigate = useNavigate();

	const handleChange = (event) => {
		const name  = event.target.name;
		let value = event.target.value;
		if(name==='username') value = value.replaceAll(' ','');
		setFormdata(values => ({...values, [name]: value}))
	}
	const handleSubmit = async (event) => {
		event.preventDefault();
		try{
			if(!formdata['first_name']){ setErrorMsg("Please enter your first name"); return; }
			if(!formdata['last_name']){  setErrorMsg("Please enter your last name"); return; }
			if(!formdata['username']){   setErrorMsg("Please enter your username"); return; }
			if(!formdata['password']){   setErrorMsg("Please enter your password"); return; }
			if(formdata['password'] !== formdata['repassword']){ setErrorMsg("Password does not match the confirmation"); return; }
			const response = await api.request('/api/user/register/', 'POST', formdata)
			const data = await response.json();
			if(response.status === 200){
				api.user.setUser(data.user);
				api.session.setSession(data.sessionid);
			}
			else setErrorMsg(data.msg);
		}catch(error){ alert(error) } 
	}

	useEffect(() => {
		if(api.session.id != null) navigate("/");
	}, [api.session.id])

	return (
		<>
			<Card className='mb-3'>
				<Form onSubmit={handleSubmit}>
					<Card.Header>Registeration</Card.Header>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<Form.Group className="mb-3" controlId="first_name">
								<Form.Label>First name</Form.Label>
								<Form.Control type="text" placeholder="Enter your first name" name="first_name" value={formdata.first_name || ""} onChange={handleChange} autoFocus />
							</Form.Group>
							<Form.Group className="mb-3" controlId="last_name">
								<Form.Label>Last name</Form.Label>
								<Form.Control type="text" placeholder="Enter your first name" name="last_name" value={formdata.last_name || ""} onChange={handleChange} />
							</Form.Group>
						</ListGroup.Item>
						<ListGroup.Item>
							<Form.Group className="mb-3" controlId="username">
								<Form.Label>Username</Form.Label>
								<Form.Control type="text" placeholder="Enter your username" name="username" value={formdata.username || ""} onChange={handleChange} />
							</Form.Group>
							<Form.Group className="mb-3" controlId="password">
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" placeholder="Enter you password" name="password" value={formdata.password || ""} onChange={handleChange}  />
							</Form.Group>
							<Form.Group className="mb-3" controlId="repassword">
								<Form.Label>Password (confirm)</Form.Label>
								<Form.Control type="password" placeholder="Confirm your password" name="repassword" value={formdata.repassword || ""} onChange={handleChange}  />
							</Form.Group>
							<Card.Text className="text-danger">{errorMsg}</Card.Text>
							<Button variant="primary" type='submit' className='mb-2'>
								Register
							</Button>
						</ListGroup.Item>
					</ListGroup>
					<Card.Footer>
						<small className="text-muted"><a href="/account/login">← Go back to login page</a></small>
					</Card.Footer>
				</Form>
			</Card>
		</>
	);
}