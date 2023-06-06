import Stellate from "./server";

const server = new Stellate()

server.get('/', (req, res) => {
    res.end('Hello World!')
})