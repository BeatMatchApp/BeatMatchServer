import express from 'express';
import config from './config/config';
import playlistRoutes from './routes/playlistRoutes';

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/playlist', playlistRoutes);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});