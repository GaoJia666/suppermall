<template>
  <div class="cart-list">
      <!-- <li v-for="(item, index) in cartList" :key="index">{{ item }}</li> -->

  </div>
</template>

<script>
import Scroll from "components/common/scroll/Scroll";

import { mapGetters } from "vuex";

export default {
  name: "CartList",
  components: {
    Scroll,
  },
  computed: {
    ...mapGetters(["cartList"]),
  },
};
</script>

<style>
.cart-list{
    height: 100%;
}
.content{
    height: calc(100% - 44px -49px);
}
</style>