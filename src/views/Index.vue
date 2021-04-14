<template>
  <div class="flex min-h-screen items-center justify-center bg-grey-500">
    <div
      class="bg-gray-100 p-8 shadow-2xl sm:w-1/2 md:w-1/2 lg:w-1/4 sm:rounded md:rounded lg:rounded sm:h-full md:h-full lg:h-full"
    >
      <img class="mx-auto w-16 mb-5" src="@/assets/images/logo.png" alt="Feirm Logo"/>

      <!-- Step 0: Connect to Metamask -->
      <div v-if="formStep === 0">
        <h1 class="text-3xl font-light mb-4 text-center">Feirm Blockchain Bridge 🌉</h1>

        <p class="font-light mb-4">
          Welcome to the Feirm Blockchain Bridge. This web application will allow you to migrate your native blockchain XFE coins into the brand-new XFE token recently launched on the Binance Smart Chain.
        </p>

        <p class="font-light mb-3" v-if="!advanced">To ensure a smooth migration, please make sure you have the Metamask extension installed and configured for your browser.</p>

        <p class="font-light text-center mb-3" v-if="advanced"><b>⚠️ Warning! This is an advanced option! ⚠️</b></p>
        <p class="font-light mb-3" v-if="advanced">Please enter your custom Binance Smart Chain address below. Feirm does not officially endorse this option, so use it at your own risk! Your XFE tokens could be at stake.</p>

        <!-- Connect to Metamask button -->
        <button v-if="!advanced"
          class="block mb-2 w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
          @click="loadWeb3()">Connect to Metamask
        </button>

        <!-- Advanced settings -->
        <button class="block rounded w-full p-4 bg-gray-200 text-gray-900" @click="advanced = !advanced" v-if="!advanced">Advanced Options</button>

        <!-- Custom address -->
        <input v-if="advanced" class="w-full border-2 mb-3 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200" v-model="address" type="text" placeholder="Please enter your Binance Smart Chain address" />
        <button v-if="advanced"
          @click="submitCustomAddress"
          class="block mb-2 w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
          >Submit
        </button>

        <button class="block rounded w-full p-4 bg-red-400 text-red-900" v-if="advanced" @click="goBack">Go back!</button>
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

      <!-- Step 2: Bridge disabled -->
      <div v-if="formStep === 2">
        <h1 class="text-3xl font-light mb-4 text-center">Feirm Blockchain Bridge 🌉</h1>
        <p class="font-light mb-2">
          Sorry, the blockchain bridge is in maintenance mode! Please check back later.
        </p>
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
      advanced: false,
      formStep: 2
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
        return this.$toast.error(e.response.data.error);
      }
      
      // Proceed to next step
      this.formStep++;
    },
    async submitCustomAddress() {
      // Create a swap request
      try {
        const res = await bridgeService.CreateRequest(this.address);
        this.request = res.data;

        // Generate QR code of deposit address
        // To be compatible with Feirm PWA, append Feirm infront
        this.addressQr = await qrcode.toDataURL("feirm:" + this.request.deposit_address)
      } catch (e) {
        return this.$toast.error(e.response.data.error);
      }
      
      // Proceed to next step
      this.formStep++;
    },
    goBack() {
      // Clear address
      this.address = "";

      // Toggle advanced state
      this.advanced = false;
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
        if (e.response.status == 429) {
          return this.$toast.error(e.response.data);
        }

        return this.$toast.error(e.response.data.error)
      }
    }
  }
});
</script>
Index