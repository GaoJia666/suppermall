<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车( {{ cartLength }} )</div>
    </nav-bar>

    <!-- 商品列表 -->
      <scroll class="content" ref="scroll">
        <cart-list-item
          v-for="(item, index) in cartList"
          :key="index"
          :itemInfo="item"
        ></cart-list-item>
      </scroll>

    <!-- 底部汇总 -->
    <cart-buttom-bar></cart-buttom-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
// import CartList from "./childComps/CartList.vue";

import CartListItem from "./childComps/CartListItem";
import CartButtomBar from './childComps/CartButtomBar'

import Scroll from "components/common/scroll/Scroll";

import { mapGetters } from "vuex";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartListItem,
    Scroll,
    CartButtomBar
  },

  computed: {
    ...mapGetters(["cartLength", "cartList"]),
  },

  activated(){
    this.$refs.scroll.refresh()
  }
};
</script>

<style scoped>
.cart {
  position: relative;
  height: 100vh;
}

.content {
  height: calc(100% - 44px - 49px - 40px);
  overflow: hidden;
}

.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
}
</style>