"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var awsServerlessExpress = require("aws-serverless-express");
var app = require("app");
var server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
