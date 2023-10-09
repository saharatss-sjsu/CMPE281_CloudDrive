import { 
	Container, 
	Nav,
	Navbar,
	NavDropdown,
} from 'react-bootstrap';

export default function MainNavbar({ user }) {
	return (
		<>
			<Navbar collapseOnSelect className="bg-body-tertiary">
				<Container>
					<Navbar.Brand href="/"><strong>Saharat</strong> CloudDrive</Navbar.Brand>
					<Navbar.Collapse>
						<Nav className="me-auto">
						</Nav>
						<Nav>
							<NavDropdown title="User" id="basic-nav-dropdown" align="end">
								<NavDropdown.Item href="/account/me">account</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href="/account/logout">logout</NavDropdown.Item>
							</NavDropdown>
						</Nav>
						</Navbar.Collapse>
				</Container>
			</Navbar>
			
		</>
	);
}
