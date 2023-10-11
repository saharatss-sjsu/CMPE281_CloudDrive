import { Outlet } from "react-router-dom";

export default function PageUserBase() {
	return (
		<div className='mt-5 mb-5 mx-auto' style={{width:"400px", maxWidth:"calc(100% - 40px)"}}>
			<Outlet />
		</div>
	);
}