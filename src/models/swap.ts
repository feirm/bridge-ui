interface SwapRequest {
    id?: string;
    receiving_address: string;
    total_balance: number;
    addresses: Addresses[];
    sent_hash?: string;
    sent_status: number;
    requested_at: number;
}

interface Addresses {
    address: string;
    signature: string;
    balance?: number;
}

export { SwapRequest, Addresses };