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
    public get(path: string, handler: (req: IncomingMessage, res: ServerResponse) => void) {
        this.requestObservable.subscribe(({ req, res }) => {
            if(req.method === 'GET' && req.url === path) {
                handler(req, res)
            }
        })
    }
}

export default Stellate