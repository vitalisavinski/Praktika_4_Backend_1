var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var apiController = require('./controllers/apiController');
apiController(app);
app.listen(PORT);