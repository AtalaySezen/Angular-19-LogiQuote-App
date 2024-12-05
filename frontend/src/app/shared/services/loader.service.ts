import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
    http = inject(HttpClient);
    #pendingRequest: number = 0;
    #isLoading: BehaviorSubject<boolean>;
    loadingEnd: boolean = true;

    constructor() {
        this.#isLoading = new BehaviorSubject<boolean>(false);
    }

    get isLoading() {
        return this.#isLoading;
    }

    showLoader = () => {
        this.#pendingRequest++;
        this.#isLoading.next(true);
    }

    hideLoader = () => {
        --this.#pendingRequest;
        if (this.#pendingRequest <= 0) {
            this.#pendingRequest = 0;
            this.#isLoading.next(false);
            this.loadingEnd = false;
        }
    }
 
}