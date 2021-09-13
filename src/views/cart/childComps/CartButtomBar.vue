<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"
      ></check-button>
      <span>全选</span>
    </div>

    <div class="price">合计{{ totalPrice }}</div>

    <div class="calculate">去计算({{ checkLength }})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

export default {
  name: "CartButtomBar",
  components: {
    CheckButton,
  },

  computed: {
    totalPrice() {
      return (
        "￥" +
        this.$store.state.cartList
          .filter((item) => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkLength() {
      return this.$store.state.cartList.filter((item) => item.checked).length;
    },
    isSelectAll() {
      if (this.$store.state.cartList.length === 0) return false;
      // return !(this.$store.state.cartList.filter(item => !item.checked).length);
      return !this.$store.state.cartList.find((item) => !item.checked);
    },
  },
  methods:{
    checkClick(){
      if(this.isSelectAll){
        this.$store.state.cartList.forEach(item => {item.checked=false});
      }else{
        this.$store.state.cartList.forEach(item => {item.checked=true});
      }
    }
  }
};
</script>

<style>
.bottom-bar {
  height: 40px;
  background-color: #eee;
  position: relative;
  line-height: 40px;
  display: flex;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.check-button {
  width: 20px;
  height: 20px;
  line-height: 22px;
  margin-right: 5px;
}
.price {
  margin-left: 30px;
}
.calculate {
  height: 100%;
  width: 80px;
  background-color: red;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;
}
</style>