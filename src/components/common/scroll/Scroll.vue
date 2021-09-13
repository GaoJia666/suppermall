<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
    };
  },

  mounted() {
    //1.创建better-scroll
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      // probeType:3    //写死影响性能
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
    });

    //2.监听滚动位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on("scroll", (position) => {
        // console.log(position);
        this.$emit("scroll", position);
      });
    }
    //3.监听滚动到底部
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        // console.log(66);
        this.$emit("pullingUp");
      });
    }
    
    this.scroll.refresh()
  },

  methods: {
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, 300);
    },

    refresh() {
      // console.log('-----');
      this.scroll && this.scroll.refresh();
    },
    finishPullUp() {
    this.scroll && this.scroll.finishPullUp();
  },
  },
};
</script>

<style>
</style>