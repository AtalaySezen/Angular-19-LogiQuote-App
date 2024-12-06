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

export interface OfferResponse {
    offers: Offer[];
    totalItemCount: number;
    totalPages: number;
}

export interface Offer {
    data: OfferResponse,
    mode: string;
    movementType: string;
    incoterms: string;
    countryCity: string;
    packageType: string;
    unit1: 'CM' | 'IN';
    unit1Value: number;
    unit2: 'KG' | 'LB';
    unit2Value: number;
    currency: 'USD' | 'CNY' | 'TRY';
    palletCount: number;
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

export interface QueryPageSize {
    page: number;
    size: number;
}
