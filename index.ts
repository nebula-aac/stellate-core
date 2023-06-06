import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Observable } from 'rxjs';

// Function to create an Observable from an HTTP request listener
function createRequestObservable() {
    return new Observable<{ req: IncomingMessage, res: ServerResponse }>(subscriber => {
        const server = createServer((req, res) => {
            subscriber.next({ req, res });
        });

        server.listen(3000, () => {
            console.log('Server listening on port 3000');
        });

        return () => {
            server.close();
        };
    });
}

// Create the request Observable
const requests$ = createRequestObservable();

// Subscribe to the request Observable to handle requests
requests$.subscribe(({ req, res }) => {
    console.log('Received request for ' + req.url);
    res.end('Hello, world!');
});