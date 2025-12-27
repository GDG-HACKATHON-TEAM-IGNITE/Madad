import React, { useEffect } from 'react';
import axios from 'axios';
export default function Userdetails({ token }) {
	useEffect(() => {
		if (token) {
			fetchData(token);
		}
	}, [token]);
	//send this token to backend with form details
	//frontend->auth by firebase->token by firebase to frontend->frontend with form data to backend

	const fetchData = async (token) => {
		const res = await axios.post('http://localhost:5000/api/user', {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		});
		console.log(res.data);
	};

	return (
		<div>
			<h1>user details yaha fill hoga then post kar dena backend ko api/users me axios.post se....</h1>
		</div>
	);
}
