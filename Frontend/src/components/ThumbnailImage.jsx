import { useState, useEffect } from 'react';

import {
	Button,
	Image,
	Spinner,
} from 'react-bootstrap';

import { styled } from '@mui/material';
import * as Icon from '@mui/icons-material';


const ThumbnailBase = styled('div')({
	minWidth: '50px',
	width:'50px',
	height:'50px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	padding: '4px',
	position: 'relative',
	border: 'solid 1px #ccc',
	borderRadius: '6px',
});

const IconBG = styled('div')({
	position: 'absolute',
	backgroundColor: 'rgba(255,255,255,0.7)',
	width: '100%',
	height: '100%',
	borderRadius: '6px',
})

export default function ThumbnailImage(props){
	const file = props.file??{};
	const api  = props.api??{};
	const [imageSrc, setImageSrc] = useState(null);
	const [hovering, setHovering] = useState(false);

	function download(){
		window.open(`${api.host_cloudfront}/${file.path}`, '_blank');
	}

	if(file.type === 'image/jpeg' || file.type === 'image/png'){
		const thumbnailURL = `${api.host_cloudfront}/t_${file.path}`;
		fetch(thumbnailURL,{
			mode:'cors',
			headers: {
				'Access-Control-Allow-Origin': '*',
			}
		}).then(response=>{
			if(response.status === 200){
				setImageSrc(thumbnailURL);
			}else{
				setTimeout(() => {
					setImageSrc(thumbnailURL);
				}, 3000);
			}
		}).catch(error=>{
			console.log('error', error);
		})
		return (
			<ThumbnailBase onMouseEnter={()=>{setHovering(true)}} onMouseLeave={()=>{setHovering(false)}} style={{ cursor:hovering?'pointer':'auto' }} onClick={()=>{download()}}>
				{imageSrc==null?
					<Spinner size='sm' />
					:
					<Image style={{ objectFit:'cover', width:'100%', height:'100%', borderRadius:'3px' }} src={imageSrc} />
				}
				{hovering?(<>
					<IconBG />
					<Icon.Download fontSize='medium' className='text-primary' style={{ position:'absolute' }} />
				</>):<></>}

			</ThumbnailBase>
		);
	}
	return (
		<ThumbnailBase onMouseEnter={()=>{setHovering(true)}} onMouseLeave={()=>{setHovering(false)}} style={{ cursor:hovering?'pointer':'auto' }} onClick={()=>{download()}}>
			{hovering?
				<Icon.Download fontSize='medium' className='text-primary' />
				:
				<Icon.InsertDriveFileOutlined fontSize='medium' />
			}
		</ThumbnailBase>
	)
}