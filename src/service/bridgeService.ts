import { SwapRequest } from "@/models/swap";
import { bridgeApi } from "@/service/api";

export default {
    // Create a swap request
    CreateRequest(address: string) {
        return bridgeApi.post("/request", {
            address: address
        })
    },

    // Create a swap request for V2
    CreateRequestV2(payload: SwapRequest) {
        return bridgeApi.post("/request-signatures", payload)
    }
}