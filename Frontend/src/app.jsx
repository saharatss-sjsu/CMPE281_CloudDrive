import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";

import PageError from './pages/page-error';
import PageHome from './pages/home';
import PageUserBase from './pages/user/PageUserBase';
import PageUserLogin from './pages/user/PageUserLogin';
import PageUserLogout from './pages/user/PageUserLogout';


export default function App() {
	const [cookies, setCookie, removeCookie] = useCookies(["sessionid"]);
	const [sessionID, setSessionID] = useState(null);
	const session = {sessionID:sessionID, setSessionID:setSessionID, removeSessionID:()=>{ localStorage.removeItem("sessionid"); }};

	useEffect(() => {
		return ()=>{
			const _sessionID = localStorage.getItem("sessionid");
			setSessionID(_sessionID);
			console.log('load sessionID', _sessionID, cookies.sessionid);
		}
	});

	useEffect(() => {
		if(sessionID == null){ 
			return;
		}
		if(sessionID === ""){ 
			localStorage.removeItem("sessionid");
			removeCookie('sessionid')
			setSessionID(null);
			return;
		}
		console.log('set sessionID', sessionID);
		setCookie('sessionid', sessionID, {sameSite: 'lax', path: '/'});
		localStorage.setItem("sessionid", sessionID);
	}, [session.sessionID])


	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/">
						<Route index element={<PageHome session={session} />} />
						<Route path="account" element={<PageUserBase />}>
							<Route path="login" element={<PageUserLogin session={session} />} />
							<Route path="logout" element={<PageUserLogout session={session} />} />
						</Route>
						<Route path="*" element={<PageError />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}