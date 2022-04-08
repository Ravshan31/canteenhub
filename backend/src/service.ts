import 'dotenv/config';
import 'reflect-metadata';
import { App } from './app';


async function Boostrap() {
    const app = new App(+process.env.PORT!);
    await app.init();
}

Boostrap();
