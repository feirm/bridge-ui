<template>
  <div class="flex min-h-screen items-center justify-center bg-grey-500">
    <div
      class="bg-gray-100 p-8 shadow-2xl sm:w-1/2 md:w-1/2 lg:w-1/4 sm:rounded md:rounded lg:rounded sm:h-full md:h-full lg:h-full"
    >
      <img class="mx-auto w-16 mb-5" src="@/assets/images/logo.png" alt="Feirm Logo"/>

      <!-- Step 0: Connect to Metamask -->
      <div v-if="formStep === 0">
        <h1 class="text-3xl font-light mb-4 text-center">Feirm Blockchain Bridge 🌉</h1>

        <p class="font-light mb-2">
          Welcome to the Feirm Blockchain Bridge. This web application will allow you to migrate your native blockchain XFE coins into the brand-new XFE token recently launched on the Binance Smart Chain.
        </p>

        <p class="font-light mb-3">To ensure a smooth migration, please make sure you have the Metamask extension installed and configured for your browser.</p>

        <!-- Connect to Metamask button -->
        <button
          class="block w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
          @click="loadWeb3()">Connect to Metamask
        </button>
      </div>

      <!-- Step 1: Swap request details -->
      <div v-if="formStep === 1">
        <h1 class="text-3xl font-light mb-4 text-center">Swap Request Details</h1>
        <p class="font-light mb-2">
          Please send your current XFE coins to the deposit address below. Once the transaction has been confirmed, the new XFE token on the Binance Smart Chain will automatically be sent to your Metamask Wallet.
        </p>
        <hr>

        <!-- Request details -->
        <div class="mt-5 mb-3 text-center">
          <!-- Address QR -->
          <img class="mx-auto mb-3" :src="addressQr" alt="Deposit Address QR">

          <!-- Address -->
          <code>
            {{ request.deposit_address }}
          </code>
        </div>

        <!-- Request new swap -->
        <hr>
        <p class="font-light mt-2 mb-3">
          <b>Please do not use the same address for more than one swap!</b>
          If you wish to carry out another swap, please generate a new swap request using the button below.</p>
        <button
          class="block w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
          @click="newSwapRequest()">Get a new swap request
        </button>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';

import web3 from "web3";
import qrcode from "qrcode";
import bridgeService from "@/service/bridgeService";

export default defineComponent({
  name: 'Index',
  data() {
    return {
      address: "",
      addressQr: "",
      request: "" as any,
      formStep: 0
    }
  },
  methods: {
    async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new web3(window.ethereum);
        await window.ethereum.enable();
      }

      // Get address from Metamask
      const accounts = await window.web3.eth.getAccounts();
      this.address = accounts[0];

      // Create a swap request
      // Use the first address in the accounts array
      try {
        const res = await bridgeService.CreateRequest(this.address);
        this.request = res.data;

        // Generate QR code of deposit address
        // To be compatible with Feirm PWA, append Feirm infront
        this.addressQr = await qrcode.toDataURL("feirm:" + this.request.deposit_address)
      } catch (e) {
        // Handle this later
        alert(e);
      }
      
      // Proceed to next step
      this.formStep++;
    },
    async newSwapRequest() {
      // Create a swap request
      // Use the first address in the accounts array
      try {
        const res = await bridgeService.CreateRequest(this.address);
        this.request = res.data;

        // Generate QR code of deposit address
        // To be compatible with Feirm PWA, append Feirm infront
        this.addressQr = await qrcode.toDataURL("feirm:" + this.request.deposit_address)
      } catch (e) {
        // Handle this later
        alert(e);
      }
    }
  }
});
</script>
Index