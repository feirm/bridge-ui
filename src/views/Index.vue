<template>
  <div class="flex min-h-screen items-center justify-center bg-grey-500">
    <div
      class="bg-gray-100 p-8 shadow-2xl sm:w-1/2 md:w-1/2 lg:w-1/4 sm:rounded md:rounded lg:rounded sm:h-full md:h-full lg:h-full"
    >
      <img class="mx-auto w-16 mb-5" src="@/assets/images/logo.png" alt="Feirm Logo"/>

      <!-- Step 0: Connect to Metamask -->
      <div v-if="formStep === 0" class="space-y-4">
        <h1 class="text-3xl font-light text-center">Feirm Blockchain Bridge 🌉</h1>

        <h1 class="text-3xl text-center text-red-500">TESTNET ONLY!</h1>

        <p class="font-light">
          Welcome to the Feirm Blockchain Bridge. This web application will allow you to migrate your native blockchain XFE coins into the brand-new XFE token recently launched on the Binance Smart Chain.
        </p>

        <p class="font-light mb-3">To get started, please enter your Binance Smart Chain (BSC) address in the field below.</p>
        <label class="block">BSC Address</label>
          <input
            class="w-full border-2 border-gray-200 p-2 rounded outline-none focus:border-orange-500 transition duration-200"
            type="text"
            v-model="address"
          />

        <button
          class="block w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
          @click="goForward">Next
        </button>
      </div>

      <!-- Step 1: Swap request preparation -->
      <div v-if="formStep === 1" class="space-y-3">
        <h1 class="text-3xl font-light mb-4 text-center">Preparation</h1>
        <p class="font-light">In order to claim your Feirm tokens, you need your existing wallet to hand. You will use this to produce cryptographic signatures which verify that you own an address.</p>
        <p class="font-light">Before going further, we suggest that you load up the Feirm QT Desktop wallet and navigate to:</p>
        <p>
          <b>File > Sign message</b>
        </p>
        <p class="font-light">Once you are ready, please click the button below to move forward.</p>
        <button class="block rounded w-full p-4 bg-orange-500 text-yellow-900" @click="goForward">Next</button>
      </div>

      <!-- Step 2: Swap request details -->
      <div v-if="formStep === 2" class="space-y-3">
        <h1 class="text-3xl font-light mb-4 text-center">Address signature</h1>
        <p class="font-light">For your native Feirm (XFE) address, please produce a signature for the following message. Make sure you copy it exactly otherwise signature verification will fail.</p>

        <div class="border-2 border-gray-200 rounded p-2 text-center mx-auto text-xs">
          <code>Binance:{{ address }}</code>
        </div>

        <p class="font-light">Please enter your address and produced signature below. After you have filled it in, click the submit button to process your request.</p>
        <p class="font-light">If you did everything correctly, you will receive your tokens on the Binance Smart Chain instantly.</p>

        <div class="p-3 bg-white rounded space-y-3">
          <label class="block">Native Feirm (XFE) Address</label>
          <input
            class="w-full border-2 border-gray-200 p-2 rounded outline-none focus:border-orange-500 transition duration-200"
            type="text"
            v-model="swap.address"
          />

          <label class="block">Signature</label>
          <input
            class="w-full border-2 border-gray-200 p-2 rounded outline-none focus:border-orange-500 transition duration-200"
            type="text"
            v-model="swap.signature"
          />
        </div>

        <button :disabled="submitted" class="block disabled:opacity-50 rounded w-full p-4 bg-orange-500 text-yellow-900" @click="sendRequest">Submit</button>
      </div>

      <!-- Step 3: Confirmation -->
      <div v-if="formStep === 3" class="space-y-3">
        <h1 class="text-3xl font-light mb-4 text-center">Success!</h1>
        <p class="font-light">Thanks for using the Feirm Bridge. You should have received your tokens on the Binance Smart Chain. More details about your request can be found below.</p>

        <div class="p-3 bg-white rounded space-y-3">
          <p>Transaction ID (Binance Smart Chain):</p>
          <a class="text-sm" :href="`https://bscscan.com/tx/${response.sent_hash}`" target="_blank">
            <b>{{ response.sent_hash.substring(0, 46) + '...' }}</b>
          </a>
        </div>

        <button @click="goBack" class="block rounded w-full p-4 bg-orange-500 text-yellow-900">New request</button>
      </div>

      <!-- Step 10: Bridge disabled -->
      <div v-if="formStep === 10">
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

import bridgeService from "@/service/bridgeService";
import { Addresses, SwapRequest } from '@/models/swap';

export default defineComponent({
  name: 'Index',
  data() {
    return {
      address: "",

      swap: {
        address: "",
        signature: ""
      },

      response: "",
      submitted: false,
      formStep: 0
    }
  },
  methods: {
    goForward() {
      if (!this.address) {
        return this.$toast.error("BSC Address cannot be empty!");
      }

      this.formStep++;
    },
    goBack() {
      // Clear swap
      this.swap.address = "";
      this.swap.signature = "";
      this.formStep--;
    },
    async sendRequest() {
      this.submitted = true;

      // Construct the address payload
      const addressPayload = {
        address: this.swap.address,
        signature: this.swap.signature
      } as Addresses;

      // New request object
      const request = {
        receiving_address: this.address,
        addresses: [
          addressPayload
        ]
      } as SwapRequest;

      // Submit to API
      try {
        const res = await bridgeService.CreateRequestV2(request);
        this.response = res.data;
      } catch (e) {
        this.submitted = false;
        return this.$toast.error(e.response.data.error);
      }

      this.submitted = false;
      this.formStep++;
    }
  }
});
</script>
Index