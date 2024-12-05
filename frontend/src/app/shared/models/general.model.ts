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

export interface TokenModel<T> {
    valid?: boolean
}

export interface Offer {
    mode: string;
    movementType: string;
    incoterms: string;
    countryCity: string;
    packageType: string;
    unit1: 'CM' | 'IN';
    unit2: 'KG' | 'LB';
    currency: 'USD' | 'CNY' | 'TRY';
    status?: 'success' | 'error';
    message?: string;
}

export interface Dimensions {
    width: number;
    length: number;
    height: number;
}

export interface getDimensions {
    status: string;
    message: string;
    data: {
        carton: Dimensions;
        box: Dimensions;
        pallet: Dimensions;
    };
}