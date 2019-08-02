"use strict";
import { Context } from "aws-lambda";
import * as awsServerlessExpress from "aws-serverless-express";
import app from "./app";

var server = awsServerlessExpress.createServer(app);

exports.handler = (event: any, context: Context) =>
    awsServerlessExpress.proxy(server, event, context);
