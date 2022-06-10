<script setup lang="ts">
import { useI18n } from '~/composable/useI18n';

const { t } = useI18n();
</script>
<template>
  <pms-sections>
    <div class="q-mb-md row justify-center">
      <q-tabs
        dense
        active-color="white"
        align="justify"
        indicator-color="transparent"
        class="box-shadow-tabs rounded-borders row"
        active-bg-color="negative"
        no-caps
      >
        <q-route-tab
          to="/settings/stock/import"
          name="import_stock"
          :label="t('import_stock')"
          class="col-md-4 col-sm-12 col-xs-12 rounded-borders"
        />
        <q-route-tab
          to="/settings/stock/export"
          name="export_stock"
          :label="t('export_stock')"
          class="col-md-4 col-sm-12 col-xs-12 rounded-borders"
        />
        <q-route-tab
          to="/settings/stock/inventory"
          name="stock_inventory"
          :label="t('stock_inventory')"
          class="col-md-4 col-sm-12 col-xs-12 rounded-borders"
        />
      </q-tabs>
    </div>
    <router-view />
  </pms-sections>
</template>
<style lang="scss" scoped>
.box-shadow-tabs {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  .q-tab {
    color: #9a9a9a;
    width: 176px;
  }
}
</style>
