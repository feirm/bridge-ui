import { bridgeApi } from "@/service/api";

export default {
    // Create a swap request
    CreateRequest(address: string) {
        return bridgeApi.post("/request", {
            address: address
        })
    }
}