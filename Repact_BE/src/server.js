// const express = require('express');
// const session = require('express-session');
// const morgan = require('morgan');
// const path = require('path');
// const mqttClient = require('./config/mqtt'); // create mqttClient connect to mqttBroker
// const db = require('./config/database'); // create connect to mysql database

// const route = require('./app/routes/_route');

import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';    
import mqttClient from './config/mqtt.js';
import db from './config/database.js';

import route from './app/routes/_route.js';