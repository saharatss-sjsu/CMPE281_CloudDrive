import './home.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import {
	Container,
	Card,
	Form,
	Button,
} from 'react-bootstrap';
import {
	styled,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Stack,
	IconButton,
	Dialog,
	Alert,
	Button as MUIButton,
} from '@mui/material';
import * as Icon from '@mui/icons-material';

import MainNavbar from '../components/MainNavbar';
import ThumbnailImage from '../components/ThumbnailImage';

export default function PageHome({ api }) {
	const navigate = useNavigate();

	const [alerts, setAlerts] = useState([]);
	const pushAlert = (severity,message)=>{
		setAlerts([...alerts, {
			severity: severity,
			message: message,
		}]);
	}

	const [filesList, setFilesList] = useState([]);
	const [textUpload, setTextUpload] = useState("Max file size 10MB.");

	const fileInput = useRef(null);
	const [editingFile, setEditingFile] = useState(null);

	const convertDatetimeToString = (input)=>(new Date(input)).toLocaleString('US');
	const convertBytesToString    = (input)=>{
		if(input > 10**6) return `${(input/10**6).toFixed(2)} MB`;
		if(input > 10**3) return `${(input/10**3).toFixed(2)} KB`;
		return `${(input).toFixed(2)} bytes`;
	};

	function redirectToLogin(){
		navigate("/account/login", {replace: true});
	}

	function getFilesList(){
		api.request('/api/file/getlist/')
		.then(response => { 
			if(response.status===200){
				return response.json();
			}
			else{
				pushAlert('error', response.statusText);
				api.session.clearSession();
			}
		})
		.then(data => {
			if(data==null) return;
			setFilesList(data.files);
		})
	}
	
	function fileUploadStart(file){
		api.request('/api/file/upload/start/', 'POST', {
			name: file.name,
			type: file.type,
			size: file.size
		})
		.then(response => {
			if(response.status === 200) return response.json();
			else if(response.status === 406) setTextUpload(`${file.name} is too large.`)
		})
		.then(data => {
			if(data == null) return;
			setTextUpload(`${file.name} is uploading...`)
			setFilesList([...filesList, data.file]);
			fileUploadDo(data, file).then(response => {
				if(response.status === 204){
					setTextUpload(`${file.name} uploaded successfully.`);
					pushAlert('success', `${file.name} uploaded successfully.`);
					fileUploadFinish(data.file.id);
				}
			})
		})
	}
	function fileUploadDo(data, file){
		const formData = new FormData();
		for(const key in data?.fields) formData.append(key, data.fields[key]);
		formData.append('file', file);
		return fetch(data.url, {
			method: "POST",
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: formData,
		});
	}
	function fileUploadFinish(fileID){
		api.request('/api/file/upload/finish/', 'POST', {
			id: fileID,
		})
		.then(response => {
			if(response.status !== 200) pushAlert('error', response.statusText);
		})
	}

	function deleteFile(fileID){
		api.request('/api/file/delete/','DELETE',{'id':fileID})
		.then(response => { 
			if(response.status===200){
				setFilesList(filesList.filter(x => x.id !== fileID));
				pushAlert('success', `The file has been deleted.`);
			}
			else pushAlert('error', response.statusText);
		})
	}
	function editFile(file){
		api.request('/api/file/edit/','PUT',{
			'id':file.id,
			'name':file.name,
			'note':file.note,
		})
		.then(response => { 
			if(response.status===200){
				return response.json();
			}
			else pushAlert('error',response.statusText);
		})
		.then(data => {
			if(data == null) return;
			pushAlert('success', `${data.file.name} edited successfully.`);
			setFilesList(filesList.map(x => {
				if(x.id === data.file.id) return {...data.file};
				return x;
			}));
		})
	}

	useEffect(()=>{
		if(api.session.id == null){
			redirectToLogin();
			return;
		}
		if(api.user.user == null){
			api.user.fetch();
		}
		getFilesList();
	}, [api.session])

	return (
		<div className="App">
			<MainNavbar user={api.user.user}></MainNavbar>
			<Container className='mt-4 mb-4' fluid='md'>
				<div className='mb-3'>
					{alerts.map((alert, index)=>
						<Alert severity={alert.severity} className='mb-2' key={index} action={
							<IconButton
								aria-label="close"
								color="inherit"
								size="small"
								onClick={() => {
									setAlerts(alerts.filter((x => x!==alert)));
								}}
							>
								<Icon.Close fontSize="inherit" />
							</IconButton>
						}>
							{alert.message}
						</Alert>
					)}
				</div>

				<Card variant="outlined" className="mb-3">
					<Card.Body>
						<Stack direction="row" spacing={2} alignItems={'center'}>
							<Button onClick={()=>{ fileInput.current.click(); }}>
								<Stack direction="row" spacing={1} alignItems={'center'}>
									<Icon.CloudUpload />
									<div>Upload</div>
								</Stack>
								<input style={{display:'none'}} type="file" onChange={(event)=>{ fileUploadStart(event.target.files[0]); event.target.value = null; }} ref={fileInput} />
							</Button>
							<div>{textUpload}</div>
						</Stack>
					</Card.Body>
				</Card>
				<Card variant="outlined" className="mb-3">
					<TableContainer>
						<Table size="small" aria-label="dense table">
							<TableHead>
								<TableRow>
									<TableCell className='fw-bold'>Preview</TableCell>
									<TableCell className='fw-bold'>Name</TableCell>
									<TableCell className='fw-bold'>Type</TableCell>
									<TableCell className='fw-bold'>Size</TableCell>
									<TableCell className='fw-bold'>Owner</TableCell>
									<TableCell className='fw-bold'>Created</TableCell>
									<TableCell className='fw-bold'>Updated</TableCell>
									<TableCell className='fw-bold'>Description</TableCell>
									<TableCell className='fw-bold'>Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filesList.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} style={{color:'#aaa'}} >No file</TableCell>
								</TableRow>):<></>}
								{filesList.map((file, file_index) => (
									<TableRow key={file_index} >
										<TableCell><ThumbnailImage file={file} api={api} /></TableCell>
										<TableCell component="th" scope="row" className='text-nowrap'>{file.name?.length>20?`${file.name?.slice(0, 20)}...`:file.name }</TableCell>
										<TableCell>{file.type}</TableCell>
										<TableCell className='text-nowrap'>{convertBytesToString(file.size)}</TableCell>
										<TableCell className='text-nowrap'>{`${file.owner.first_name} (${file.owner.username})`}</TableCell>
										<TableCell>{convertDatetimeToString(file.created)}</TableCell>
										<TableCell>{convertDatetimeToString(file.updated)}</TableCell>
										<TableCell>{file.note?.length>20?`${file.note?.slice(0, 20)}...`:(file.note?file.note:'-') }</TableCell>
										<TableCell>
											<Stack direction="row" alignItems="center" spacing={1}>
												<IconButton color='primary' aria-label="download" size="small" href={`${api.host_cloudfront}/${file.path}`} download={`${file.name}`} target='_blank' >
													<Icon.Download fontSize="inherit" />
												</IconButton>
												<IconButton color='primary' aria-label="rename" size="small"  onClick={()=>{ setEditingFile(file); }}>
													<Icon.Edit fontSize="inherit" />
												</IconButton>
												<IconButton color='primary' aria-label="delete" size="small" onClick={()=>{deleteFile(file.id)}}>
													<Icon.Delete fontSize="inherit" />
												</IconButton>
											</Stack>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>

				</Card>

			</Container>

			<Dialog open={editingFile!=null} onClose={()=>{ setEditingFile(null); }}>
				<Card style={{ width: '18rem' }}>
					<Card.Body>
						<Card.Title>File editing</Card.Title>
						<Form onSubmit={(event)=>{ event.preventDefault(); editFile(editingFile); setEditingFile(null); }}>
							<Form.Group className="mb-3" controlId="name">
								<Form.Label>File name {editingFile?.name}</Form.Label>
								<Form.Control type="text" name="name" value={editingFile?.name || ''} onChange={(event)=>{ setEditingFile({...editingFile, [event.target.name]:event.target.value}); }} />
							</Form.Group>
							<Form.Group className="mb-3" controlId="note">
								<Form.Label>Description</Form.Label>
								<Form.Control as="textarea" name='note' rows={3} value={editingFile?.note || ''} onChange={(event)=>{ setEditingFile({...editingFile, [event.target.name]:event.target.value}); }} />
							</Form.Group>
							<Stack direction="row" spacing={1} alignItems={'center'}>
								<Button variant="outline-secondary" onClick={()=>{ setEditingFile(null); }}>Cancel</Button>
								<Button variant="primary" type='submit'>Save</Button>
							</Stack>
						</Form>
					</Card.Body>
				</Card>
			</Dialog>

		</div>
	);
}