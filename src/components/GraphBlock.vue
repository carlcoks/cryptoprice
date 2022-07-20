<template>
  <section class="relative">
    <div ref="graph" class="flex items-end bg-white h-72 p-5">
      <div
        v-for="(bar, id) in normalizedGraph"
        :key="id"
        :style="{ height: `${bar}%` }"
        class="bg-yellow-300 w-9 mr-0.5"
      />
    </div>
  </section>
</template>

<script>
export default {
  name: "GraphBlock",
  props: {
    graph: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      if (maxValue === minValue) {
        return this.graph.map(() => 50);
      }

      return this.graph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    }
  }
};
</script>
