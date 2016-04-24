var express = require("express");
var morgan = require("morgan");
var serveStatic = require("serve-static");

var app = express();
app.use(morgan("dev"))
app.use(serveStatic("public"));
app.listen(8080);
