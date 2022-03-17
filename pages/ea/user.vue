<template>
  <div>
    <v-text-field
      @change="startup()"
      v-model="search"
      prepend-inner-icon="em em-mag_right"
      outlined
      label="ค้นหา"
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="items.results"
      class="elevation-1"
    ></v-data-table>
    <v-pagination v-model="page" :length="items.count / maxPage"></v-pagination>
  </div>
</template>

 
<script>
import { Core } from "@/vuexes/core";
export default {
  data: () => {
    return {
      items: [],
      headers: [
        { text: "ลำดับ", value: "id" },
        { text: "code", value: "code" },
        { text: "สถานะ", value: "status" },
        { text: "หมายเหตุ", value: "remark" },
        { text: "วันที่สร้าง", value: "created_at" },
        { text: "วันที่อัพเดทล่าสุด", value: "updated_at" },
        { text: "ประเภทบัญชี", value: "account_type_id" },
        { text: "ชื่อ Broker", value: "broker_id" },
        { text: "ชื่อสินค้า EA", value: "product_id" },
        { text: "ชื่อผู้ใช้", value: "user_id" },
      ],
      page: 1,
      maxPage: 10,
      search: "",
    };
  },
  async created() {
    await this.startup();
  },
  methods: {
    async startup() {
      this.items = await Core.getHttp(
        `/api/adminea/order?page=${this.page}&search=${this.search}`
      );
    },
  },
  watch: {
    async page(newVal, oldVal) {
      await this.startup();
    },
  },
};
</script>
 
<style>
</style>