import { Observable as RxObserable, Subscriber } from "rxjs"

class Observable<T> extends RxObserable<T> {
    constructor(subscribe?: (this: Observable<T>, subscriber: Subscriber<T>) => void) {
        super(subscribe)
    }
}

export { Observable }