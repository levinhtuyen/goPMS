<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
}
const props = defineProps<Props>();
</script>
<script lang="ts">
export default {
  name: 'PmsSections',
};
</script>
<template>
  <section class="bg-white q-pa-md">
    <header>
      <div v-if="props.title || props.description">
        <h1 v-if="props.title" class="text-h5 text-bold q-ma-none q-mb-md" v-text="title" />
        <p v-if="props.description" class="q-mb-md" v-text="description" />
      </div>
      <slot name="header"></slot>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <slot name="footer" />
    </footer>
  </section>
</template>

<style lang="scss">
main {
  .q-table {
    .q-td,
    th {
      font-size: 14px;
    }
    th {
      font-weight: bold;
    }

    .unset-white-space {
      white-space: unset;
    }
  }

  .q-tabs {
    border-radius: 4px;
  }

  .q-tab__label {
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
