import admin from '../config/firebase-config.js';

export async function decodeToken(req, res, next) {
	const token = req.headers.authorization.split(' ')[1];
	if (token) {try {
		const decodeValue = await admin.auth().verifyIdToken(token);
		if (decodeValue) {
			req.user = decodeValue;
			return next();
		}
		return res.json({ msg: 'Unauthorized' });
	} catch (err) {
		console.log(err)
		return res.json({ msg: 'Error' });
	}
		
	}
	return res.json({msg:"token doesnt exist"})
}
