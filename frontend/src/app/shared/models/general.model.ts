export interface Auth<T> {
    status: 'success' | 'error';
    message: string;
    token: string;
}

export interface General<T> {
    status: 'success' | 'error';
    message: string;
    data?: T;
}
