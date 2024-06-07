// Description: This contains the configuration for the server.

// @author Rainier Pendon
// @date 03/16/2024

// Description: The server has been added configuration for deployment.

// @author Rheana Mindo
// @date 04/02/2024

// Description: Modified to work in both local and vercel server deployment

// @author Neil Vincent S. Alday
// @date 04/06/2024

// Description: Added active clients tracker and SSE implementation to detect database changes

// @author Rheana Mindo
// @date 04/20/2024

// Description: Implemented SSEs on the deployed server

// @author Rheana Mindo
// @date 05/02/2024

// Description: Added Cloudinary

// @author Rainier Pendon
// @date 04/30/2024

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const appRoutes = require("./routes/routes.js");
const app = express();
const cloudinary = require("./config/cloudinary.js");
const requestController = require("./controllers/request-controller.js");

require('dotenv').config();

const corsOptions = {
    origin: ["http://localhost:3001", process.env.PRODUCTION_URL || ""],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json({ limit: '50mb' }));  // Limit set for testing; Adjust or remove later
// SSE Implementation
let clients = [];
app.get(`/events`, (req, res) => {
    try{

        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
    
        const clientId = Date.now();
        clients.push({ id: clientId, res });
        
        req.on('close', () => {
            console.log('Client disconnected');
            clients = clients.filter(client => client.id !== clientId);
        });
    } catch (err) {
        console.log("SSE Error /events", err)
    }
});

app.post(`/change`, (req, res) => {
    console.log('The database has been modified');
    sendSSEMessage('The database has been modified in one of the clients');
    res.sendStatus(200);
});

function sendSSEMessage(data) {
    console.log(clients);
    clients.forEach(client => {
        client.res.write(`data: ${data}\n\n`);
    });
}
appRoutes(app);


app.listen(process.env.PORT, () => {
    console.log('Server has started on port ' + process.env.PORT)
})