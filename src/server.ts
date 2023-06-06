import { IncomingMessage } from "./request";
import { ServerResponse } from "./response";
import { createServer } from "http";
import { Observable } from "./observable";

class Stellate {
    private requestObservable: Observable<{ req: IncomingMessage, res: ServerResponse }>

    constructor() {
        this.requestObservable = new Observable<{ req: IncomingMessage, res: ServerResponse }>(subscribe => {
            const server = createServer((req, res) => {
                subscribe.next({ req: req as IncomingMessage, res: res as ServerResponse })
            })

            server.listen(3000, () => {
                console.log(`Listening on port 3000`)
            })

            return () => {
                server.close()
            }
        }) as Observable<{ req: IncomingMessage, res: ServerResponse }>
    }
    public method(
        method: string,
        path: string,
        handler: (req: IncomingMessage, res: ServerResponse) => void
    ) {
        this.requestObservable.subscribe(({ req, res }) => {
            if (req.method?.toLowerCase() === method.toLowerCase() && req.url === path) {
                handler(req, res)
            }
        })
    }
    public get = this.method.bind(this, 'get')
    public post = this.method.bind(this, 'post')
    public put = this.method.bind(this, 'put')
    public delete = this.method.bind(this, 'delete')
}

export default Stellate