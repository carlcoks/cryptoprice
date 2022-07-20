<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 relative">
    <label
      for="ticker"
      class="text-xs font-medium text-gray-700 absolute left-4 top-0 bottom-0 flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M16.5 16.5L11.5 11.5M13.1667 7.33333C13.1667 10.555 10.555 13.1667 7.33333 13.1667C4.11167 13.1667 1.5 10.555 1.5 7.33333C1.5 4.11167 4.11167 1.5 7.33333 1.5C10.555 1.5 13.1667 4.11167 13.1667 7.33333Z"
          stroke="#9CA3AF"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </label>
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Найти тикер"
      class="block w-full pr-10 pl-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md shadow-sm"
    />
  </div>
</template>

<script>
export default {
  name: "SearchBlock",
  props: {
    modelValue: {
      type: String,
      required: true
    }
  }
};
</script>
