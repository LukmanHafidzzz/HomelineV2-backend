const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const PORT = 3052;

const UserRoute = require('./routes/UserRoute')
const NotarisRoute = require('./routes/NotarisRoute')
const AuthRoute = require('./routes/AuthRoute')
const BlogRoute = require('./routes/BlogRoute')

const app = express()

app.use(cors());
app.use(express.json())
app.use(fileUpload());


app.use(UserRoute)
app.use(NotarisRoute)
app.use(AuthRoute)
app.use(BlogRoute)

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});