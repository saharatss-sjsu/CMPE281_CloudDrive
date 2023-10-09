import './home.css';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import { 
	Container,
	Table,
} from 'react-bootstrap';

import MainNavbar from '../components/MainNavbar';

export default function PageHome({ session }) {
	const navigate = useNavigate();

	const [user, setUser] = useState(null);

	// useEffect(() => {
	// 	console.log('sessionID', session.sessionID);
	// 	if(session.sessionID == null){
	// 		navigate("/account/login");
	// 	}
	// }, [session.sessionID]);

	useEffect(()=>{
		console.log('sessionID', session.sessionID);
		if(session.sessionID == null){
			navigate("/account/login", {replace: true});
		}
	})

	return (
		<div className="App">
			<MainNavbar user={user}></MainNavbar>

			<Container className='mt-4'>
					<Table bordered>
					<thead>
						<tr>
							<th>#</th>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Username</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>Mark</td>
							<td>Otto</td>
							<td>@mdo</td>
						</tr>
						<tr>
							<td>2</td>
							<td>Jacob</td>
							<td>Thornton</td>
							<td>@fat</td>
						</tr>
					</tbody>
				</Table>
			</Container>
		</div>
	);
}