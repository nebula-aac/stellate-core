import { IncomingMessage } from "./request";
import { ServerResponse } from "./response";
import { createServer } from "http";
import { Observable } from "./observable";

type HttpMethod = 'get' | 'post' | 'put' | 'delete'

type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void

class Stellate {
    private requestObservable: Observable<{ req: IncomingMessage, res: ServerResponse }>
    private routes: Record<HttpMethod, Record<string, RouteHandler>> = {
        get: {},
        post: {},
        put: {},
        delete: {}
    }
    private port: number | null = null
    private server = createServer((req, res) => {
        const method = req.method?.toLowerCase() as HttpMethod
        const handler = this.routes[method]?.[req.url || '']
        if (handler) {
            handler(req, res)
        } else {
            res.writeHead(404)
            res.end
        }
    })

    constructor() {
        this.requestObservable = new Observable<{ req: IncomingMessage, res: ServerResponse }>(subscriber => {
            this.server.on('request', (req, res) => {
                subscriber.next({ req, res })
            }) 
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
    public route(method: HttpMethod, path: string, handler: RouteHandler) {
        this.routes[method][path] = handler
    }
    public get = this.method.bind(this, 'get')
    public post = this.method.bind(this, 'post')
    public put = this.method.bind(this, 'put')
    public delete = this.method.bind(this, 'delete')

    public listen(port?: number): Promise<number> {
        return new Promise((resolve) => {
            this.server.listen(port || 0, () => {
                const port = (this.server.address() as any)?.port
                resolve(port)
            })
        })
    }
}

export default Stellate