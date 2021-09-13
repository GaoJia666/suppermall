<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="nav"
    ></detail-nav-bar>

    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <!-- <ul>
        <li v-for="(item, index) in $store.state.cartList" :key="index">
          {{ item }}
        </li>
      </ul> -->

      <detail-swiper :top-images="topImages"></detail-swiper>

      <detail-base-info :goods="goods"></detail-base-info>

      <detail-shop-info :shop="shop"></detail-shop-info>

      <detail-param-info
        ref="params"
        :param-info="paramInfo"
      ></detail-param-info>

      <detail-goods-info
        :detailInfo="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>

      <detail-comment-info
        ref="comment"
        :comment-info="commentInfo"
      ></detail-comment-info>

      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>

    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

    <!-- <toast message="哈哈哈"></toast> -->
  </div>
</template>

<script>
import DetailNavBar from "./childcomps/DetailNavBar";
import DetailSwiper from "./childcomps/DetailSwiper";
import DetailBaseInfo from "./childcomps/DetailBaseInfo";
import DetailShopInfo from "./childcomps/DetailShopInfo";
import DetailGoodsInfo from "./childcomps/DetailGoodsInfo";
import DetailParamInfo from "./childcomps/DetailParamInfo";
import DetailCommentInfo from "./childcomps/DetailCommentInfo";
import DetailBottomBar from "./childcomps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/content/backTop/BackTop";
// import Toast from 'components/common/toast/Toast'

import { itemListenerMixin } from "common/mixin";
import { debounce } from "common/utils";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";

export default {
  name: "Detail",

  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    BackTop,
    // Toast,
  },

  mixins: [itemListenerMixin],

  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: null,
      isShowBackTop: false,
      // message:'',
      // show:false,
    };
  },

  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid;
    // console.log(this.$route.params);

    //2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // console.log(res);
      const data = res.result;

      // 1.上部轮播图数据
      this.topImages = data.itemInfo.topImages;

      // 2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      //3.获取店铺信息
      this.shop = new Shop(data.shopInfo);

      // 4.保存商品详情数据
      this.detailInfo = data.detailInfo;

      //5.获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      //7.去除评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      //获取各个组件高度方法二    ,根据最新的数据，DOM已经渲染完了，但图片还未加载完成
      this.$nextTick(() => {
        // this.themeTopYs = [];
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      });
    });

    //请求推荐数据
    getRecommend().then((res) => {
      // console.log(res);
      this.recommends = res.data.list;
    });

    //给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

      // console.log(this.themeTopYs);
    });
  },

  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();

      this.getThemeTopY();
    },

    //回到顶部
    backClick() {
      // console.log('666')
      this.$refs.scroll.scrollTo(0, 0);
    },

    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },

    contentScroll(position) {
      // console.log(position);
      //1.获取y值
      const positionY = -position.y;

      //2.positionY和主题中的值进行对比
      // for (let i in this.themeTopYs) {
      // console.log(i);
      // if (
      //   positionY > this.themeTopYs[i] &&
      //   positionY < this.themeTopYs[i + 1]
      // ) {
      //   console.log(i);
      // }
      // }
      let length = this.themeTopYs.length;
      for (let i = 0; i < length; i++) {
        if (
          this.currentIndex !== i &&
          ((i < length - 1 &&
            positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1]) ||
            (i === length - 1 && positionY >= this.themeTopYs[i]))
        ) {
          // this.index=i
          // console.log(i);
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      this.isShowBackTop = -position.y > 1000;
    },

    addToCart() {
      //1.获取购物车展示的信息
      // console.log('000');
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      //2.将商品添加到购物车里
      // this.$store.commit("addCart", product);
      this.$store.dispatch("addCart", product).then((res) => {
        // console.log(res);
        this.$toast.show(res, 2000);
        // console.log(this.$toast);
      });
    },
  },

  // mounted(){
  //   const refresh = debounce(this.$refs.scroll.refresh, 200);
  //   this.itemImgListener=()=>{refresh()}

  //   this.$bus.$on('itemImageLoad',this.itemImgListener)
  // },

  mounted() {
    // this.themeTopYs.push(0);
    // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
  },

  //获取各个组件高度方法一
  // updated() {
  //   this.themeTopYs = [];

  //   this.themeTopYs.push(0);
  //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
  //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
  //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

  //   console.log(this.themeTopYs);
  // },

  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 49px);
}
</style>