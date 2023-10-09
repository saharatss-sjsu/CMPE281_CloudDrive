import { useRouteError } from "react-router-dom";

import { Container } from 'react-bootstrap';

export default function PageError() {
  return (
    <Container className="d-flex align-items-center justify-content-center my-auto vh-100">
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>Page not found</i>
        </p>
        <a href="/">← Go back to homepage</a>
      </div>
    </Container>
    
  );
}