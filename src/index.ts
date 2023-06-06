import Stellate from "./server";

const server = new Stellate()

server.get('/', (req, res) => {
    res.end('Hello World!')
})

server.listen(3000).then(port => {
    console.log(`Server is lstening on port ${port}`)
})