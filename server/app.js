import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import cors from 'cors';
import Lights from './services/lights';

const app = express(feathers());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());
app.use(express.errorHandler());
app.use(cors());

app.use('lights', new Lights());

const server = app.listen(3000);

server.on('listening', () => console.log('Listening...'));