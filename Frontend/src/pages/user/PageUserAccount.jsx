import { Card, Button, Form } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';

export default function PageUserLogin({ api }) {
	const [formdata1, setFormdata1] = useState({});
	const [errorMsg1, setErrorMsg1] = useState("");
	const submitButton1 = useRef(null);
	const handleChange1 = (event) => {
		const name  = event.target.name;
		let value = event.target.value;
		if(name==='username') value = value.replaceAll(' ','');
		setFormdata1(values => ({...values, [name]: value}))
	}
	const handleSubmit1 = async (event) => {
		event.preventDefault();
		try{
			if(!formdata1['first_name']){ setErrorMsg1("Please enter your first name"); return; }
			if(!formdata1['last_name']){  setErrorMsg1("Please enter your last name"); return; }
			if(!formdata1['username']){  setErrorMsg1("Please enter your username"); return; }
			const response = await api.request('/api/user/me/edit/', 'POST', formdata1)
			const data = await response.json();
			if(response.status === 200){
				setErrorMsg1("");
				submitButton1.current.innerHTML = "Saved";
			}
			else setErrorMsg1(data.msg);
		}catch(error){ alert(error) } 
	}

	const [formdata2, setFormdata2] = useState({});
	const [errorMsg2, setErrorMsg2] = useState("");
	const submitButton2 = useRef(null);
	const handleChange2 = (event) => {
		const name  = event.target.name;
		let value = event.target.value;
		setFormdata2(values => ({...values, [name]: value}))
	}
	const handleSubmit2 = async (event) => {
		event.preventDefault();
		try{
			if(!formdata2['password']){   setErrorMsg2("Please enter your password"); return; }
			if(formdata2['password'] !== formdata2['repassword']){ setErrorMsg2("Password does not match the confirmation"); return; }
			const response = await api.request('/api/user/me/password/', 'POST', formdata2)
			const data = await response.json();
			if(response.status === 200){
				setErrorMsg2("");
				submitButton2.current.innerHTML = "Saved";
			}
			else setErrorMsg2(data.msg);
		}catch(error){ alert(error) } 
	}

	useEffect(()=>{
		if(api.user.user == null){
			api.user.fetch();
			return;
		}
		if(formdata1.username == null){
			setFormdata1({
				'first_name': api.user.user?.first_name,
				'last_name': api.user.user?.last_name,
				'username': api.user.user?.username,
			});
		}
	}, [api.user.user])

	return (
		<>
			<Card className='mb-3'>
				<Card.Body>
					<small className="text-muted"><a href="/">← Go back to home page</a></small>
				</Card.Body>
			</Card>
			<Card className='mb-3'>
				<Card.Header>Your Information</Card.Header>
				<Card.Body>
					<Form onSubmit={handleSubmit1}>
						<Form.Group className="mb-3" controlId="first_name">
							<Form.Label>First name</Form.Label>
							<Form.Control type="text" placeholder="Enter your first name" name="first_name" value={formdata1.first_name || ""} onChange={handleChange1} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="last_name">
							<Form.Label>Last name</Form.Label>
							<Form.Control type="text" placeholder="Enter your first name" name="last_name" value={formdata1.last_name || ""} onChange={handleChange1} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="username">
							<Form.Label>Username</Form.Label>
							<Form.Control type="text" placeholder="Enter your username" name="username" value={formdata1.username || ""} onChange={handleChange1} />
						</Form.Group>
						<Card.Text className="text-danger">{errorMsg1}</Card.Text>
						<Button variant="primary" type='submit' className='mb-2' ref={submitButton1}>
							Save change
						</Button>
					</Form>
				</Card.Body>
			</Card>
			<Card className='mb-3'>
				<Card.Header>Change password</Card.Header>
				<Card.Body>
					<Form onSubmit={handleSubmit2}>
						<Form.Group className="mb-3" controlId="password">
							<Form.Label>New Password</Form.Label>
							<Form.Control type="password" placeholder="Enter you new password" name="password" value={formdata2.password || ""} onChange={handleChange2}  />
						</Form.Group>
						<Form.Group className="mb-3" controlId="repassword">
							<Form.Label>New Password (confirm)</Form.Label>
							<Form.Control type="password" placeholder="Confirm your new password" name="repassword" value={formdata2.repassword || ""} onChange={handleChange2}  />
						</Form.Group>
						<Card.Text className="text-danger">{errorMsg2}</Card.Text>
						<Button variant="primary" type='submit' className='mb-2' ref={submitButton2}>
							Save change
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</>
	);
}