<template>
  <div
    :class="{ 'border-gray-900': isActive }"
    class="bg-white rounded-lg border-2 border-solid cursor-pointer py-4 px-5 relative text-gray-900"
    @click="$emit('select')"
  >
    <p class="text-sm">{{ item.name }} - USD</p>
    <p class="text-4xl">{{ formatPrice(item.price) }}$</p>

    <button @click.stop="$emit('remove')" class="absolute top-0 right-0 p-4">
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="#9CA3AF"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: "ItemCard",
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatPrice(price) {
      if (price === "-") {
        return price;
      }
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    }
  }
};
</script>
