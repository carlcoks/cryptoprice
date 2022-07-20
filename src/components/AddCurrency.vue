<template>
  <section class="bg-white p-4 mb-4 rounded-lg">
    <div class="flex">
      <div class="max-w-sm w-full">
        <div class="relative">
          <label
            for="ticker"
            class="block text-xs font-medium text-gray-700 absolute left-3 top-2"
            >Тикер</label
          >
          <input
            id="ticker"
            v-model="currency"
            type="text"
            name="wallet"
            class="block w-full pr-10 pt-6 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md shadow-sm"
            placeholder="Например DOGE"
            @keydown.enter="add()"
          />
        </div>
      </div>
    </div>

    <add-button @click="add()" class="mt-3" />
  </section>
</template>

<script>
import AddButton from "./AddButton.vue";

export default {
  components: {
    AddButton
  },
  data() {
    return {
      currency: ""
    };
  },
  methods: {
    add() {
      this.$emit("add-currency", this.currency);

      this.currency = "";
    }
  }
};
</script>
