const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');


const app = express();

//Mongoose
var mongoose = require('mongoose');

mongoose.connect('mongodb://root:root@ds121599.mlab.com:21599/speakpro')
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

var adminAuthRoutes = require('./server/routes/endpoints/admin/_auth/routes');
var adminUserRoutes = require('./server/routes/endpoints/admin/_user/routes');
var adminAdminRoutes = require('./server/routes/endpoints/admin/_admin/routes');
var adminStudentRoutes = require('./server/routes/endpoints/admin/_student/routes');
var adminTeacherRoutes = require('./server/routes/endpoints/admin/_teacher/routes');
var adminClassesRoutes = require('./server/routes/endpoints/admin/_class/routes');
var adminFileRoutes = require('./server/routes/endpoints/admin/_file/routes');
var adminCheckoutRoutes = require('./server/routes/endpoints/admin/_checkout/routes');
var baseRoutes = require('./server/routes/endpoints/base_routes');
/**
 * Get port from environment and store in Express.
 */

app.use(function(req, res, next) {
//set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

//SET ROUTE FOR API
app.use(adminAuthRoutes);
app.use(baseRoutes);
app.use(adminUserRoutes);
app.use(adminAdminRoutes);
app.use(adminStudentRoutes);
app.use(adminTeacherRoutes);
app.use(adminClassesRoutes);
app.use(adminCheckoutRoutes);
app.use(adminFileRoutes);

app.get('/uploads', express.static(path.join(__dirname, './uploads')))


module.exports = app;