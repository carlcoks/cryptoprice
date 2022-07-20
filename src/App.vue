<template>
  <div class="container mx-auto flex flex-col items-center p-4">
    <div class="container">
      <add-currency @add-currency="add" />

      <search-block v-model="search" />

      <template v-if="currencies.length > 0">
        <dl class="mt-5 mb-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <item-card
            v-for="item in paginatedCurrencies"
            :key="item"
            :item="item"
            :isActive="selectedCurrency === item"
            @select="selectCurrency(item)"
            @remove="removeCurrency(item)"
          />
        </dl>
      </template>

      <graph-block
        v-if="selectedCurrency"
        ref="graphBlock"
        :graph="graph"
        class="mt-4"
      />

      <hr class="w-full border-t border-gray-200 mt-4 mb-3" />

      <div class="flex justify-between">
        <p>
          Показано {{ paginatedCurrencies.length }} результатов из
          {{ currencies.length }}
        </p>

        <div v-if="currencies.length > itemsOnPage">
          <button type="button" class="btn" @click="painationBtn('prev')">
            Назад
          </button>

          <button type="button" class="btn" @click="painationBtn('next')">
            Вперед
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { subscribeToCurrency, unsubscribeFromCurrency } from "./api";

import AddCurrency from "@/components/AddCurrency";
import SearchBlock from "@/components/SearchBlock";
import ItemCard from "@/components/ItemCard";
import GraphBlock from "@/components/GraphBlock";

export default {
  name: "App",
  components: {
    AddCurrency,
    SearchBlock,
    ItemCard,
    GraphBlock
  },
  data() {
    return {
      currencies: [],
      selectedCurrency: null,
      graph: [],
      maxGraphElements: 1,
      search: "",
      currentPage: 1,
      itemsOnPage: 6
    };
  },
  computed: {
    startIndex() {
      return this.itemsOnPage * (this.currentPage - 1);
    },

    endIndex() {
      return this.currentPage * this.itemsOnPage;
    },

    filteredCurrencies() {
      return this.currencies.filter((currency) =>
        currency.name.includes(this.search)
      );
    },

    paginatedCurrencies() {
      return this.filteredCurrencies.slice(this.startIndex, this.endIndex);
    },

    hasNextPage() {
      return this.filteredCurrencies.length > this.endIndex;
    },

    pageStateOptions() {
      return {
        search: this.search,
        page: this.page
      };
    }
  },
  watch: {
    currencies() {
      localStorage.setItem("currencies-list", JSON.stringify(this.currencies));
    },

    selectedCurrency() {
      this.graph = [];
    },

    paginatedCurrencies() {
      if (this.paginatedCurrencies.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },

    search() {
      this.page = 1;
    },

    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?search=${value.search}&page=${value.page}`
      );
    }
  },
  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    const VALID_URL_KEYS = ["search", "page"];

    VALID_URL_KEYS.forEach((key) => {
      if (windowData[key]) {
        this[key] = windowData[key];
      }
    });

    const currenciesData = localStorage.getItem("currencies-list");

    if (currenciesData) {
      this.currencies = JSON.parse(currenciesData);
      this.currencies.forEach((currency) => {
        subscribeToCurrency(currency.name, (newPrice) =>
          this.updateTicker(currency.name, newPrice)
        );
      });
    }
  },
  mounted() {
    window.addEventListener("resize", this.calculateMaxGraphElements);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphElements);
  },
  methods: {
    calculateMaxGraphElements() {
      if (!this.$refs.graphBlock) {
        return;
      }

      this.maxGraphElements =
        this.$refs.graphBlock.$refs.graph.clientWidth / 36;
    },

    updateTicker(name, price) {
      this.currencies
        .filter((c) => c.name === name)
        .forEach((c) => {
          if (c === this.selectedCurrency) {
            this.graph.push(price);

            while (this.graph.length > this.maxGraphElements) {
              this.graph.shift();
            }
          }
          c.price = price;
        });
    },

    add(currency) {
      const newCurrency = {
        name: currency,
        price: "-"
      };

      this.currencies = [...this.currencies, newCurrency];

      subscribeToCurrency(newCurrency.name, (newPrice) =>
        this.updateTicker(newCurrency.name, newPrice)
      );

      this.search = "";
    },

    selectCurrency(data) {
      this.selectedCurrency = data;

      this.$nextTick(() => {
        this.calculateMaxGraphElements();
      });
    },

    removeCurrency(data) {
      this.currencies = this.currencies.filter((c) => c !== data);

      if (this.selectedCurrency === data) {
        this.selectedCurrency = null;
      }

      unsubscribeFromCurrency(data.name);
    },

    painationBtn(direction) {
      if (direction === "prev" && this.currentPage > 1) {
        this.currentPage--;
      } else if (direction === "next" && this.hasNextPage) {
        this.currentPage++;
      }
    }
  }
};
</script>
