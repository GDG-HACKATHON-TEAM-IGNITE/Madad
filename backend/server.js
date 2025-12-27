import express from 'express';
import cors from 'cors';
import { decodeToken } from './middleware/auth.js';

const app = express();
const port = 5000;

app.use(cors());

app.post('/api/user', decodeToken, (req, res) => res.json({}));


app.listen(port, () => {
	console.log(`server is running on port ${port}`);
});

export default app;
