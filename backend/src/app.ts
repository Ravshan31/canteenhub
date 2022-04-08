import express, { Express } from "express";

export class App {
    app: Express;
    port: number

    constructor(port = 3000) {
        this.port = port;
        this.app = express();
    }

    async init() {
        this.app.listen(this.port);
        console.log(`Server started on the port: http://localhost:${this.port}`)
    }
}