<template>
  <Swiper
    :slides-per-view="1.565"
    :navigation="{
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }"
    :pagination="{ clickable: true }"
    :autoplay="{ disableOnInteraction: false, delay: 5000 }"
    :loop="true"
    :initialSlide="2"
    :watchSlidesProgress="true"
    :centeredSlides="true"
    @setTransition="setTransition"
    @progress="progress"
    @paginationRender="paginationRender"
    @mouseenter="next_prev = true"
    @mouseleave="next_prev = false">
    <SwiperSlide v-for="item in banners">
      <div class="swiper-img" @click.stop="bannerJump(item)">
        <img :src="item.imageUrl">
        <span>{{ item.typeTitle }}</span>
      </div>
    </SwiperSlide>
    <div class="swiper-button-prev" :style="next_prev ? 'display:block' : 'display:none'">
      <i class="iconfont icon-xiangzuojiantou"></i>
    </div>
    <div class="swiper-button-next" :style="next_prev ? 'display:block' : 'display:none'">
      <i class="iconfont icon-xiangyoujiantou"></i>
    </div>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/less'
import "swiper/less/navigation";
import "swiper/less/pagination";
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper";
import { ref } from '@vue/reactivity';

defineProps({
  banners: {
    type: Array
  }
})
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);
const next_prev = ref(false)

const setTransition = (swiper, transition) => {
  for (var i = 0; i < swiper.slides.length; i++) {
    var slide = swiper.slides.eq(i);
    slide.transition(transition);
  }
};
const progress = (progress) => {
  for (var i = 0; i < progress.slides.length; i++) {
    var slide = progress.slides.eq(i);
    var slideProgress = progress.slides[i].progress;
    var modify = 1;
    if (Math.abs(slideProgress) > 1) {
      modify = (Math.abs(slideProgress) - 1) * 0.6 + 1;
    }
    // console.log(slideProgress, modify);
    var translate = slideProgress * modify * 400 + "px";
    var scale = 1 - Math.abs(slideProgress) / 5;
    var zIndex = 999 - Math.abs(Math.round(99 * slideProgress));
    slide.transform("translateX(" + translate + ") scale(" + scale + ")");
    slide.css("zIndex", zIndex);
    slide.css("opacity", 1);
    if (Math.abs(slideProgress) > 3) {
      slide.css("opacity", 0);
    }
  }
};
const paginationRender = (v) =>{
  let pages = document.getElementsByClassName('swiper-pagination-bullet')
  for(let i = 0; i< pages.length; i++){
    pages[i].onmouseover = (e)=>{
      e.target.click()
    }
  }
}

// TODO 轮播图点击跳转
const bannerJump = (v)=>{
  console.log(v);
  // 歌曲
  if (v.targetType == 1) {}
  // 专辑
  if (v.targetType == 3000 && v.typeTitle != '独家策划') {}
}

</script>

<style lang="less" scoped>
.swiper {
  width: calc(1200px - 260px);
  padding-top: 30px;
  padding-bottom: 40px;
}
.swiper-wrapper{
    margin-left: -10px;
}

.swiper-img {
  width: 600px;
  height: 230px;
  position: relative;
  img{
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  span{
    display: inline-block;
    width: 70px;
    height: 25px;
    background: rgb(168, 9, 9);
    color: #fff;
    font-size: 13px;
    text-align: center;
    line-height: 25px;
    border-radius: 10px 0 10px 0;
    position: absolute;
    right: 0;
    bottom: 0;
  }
}

:deep(.swiper-pagination) {
  // height: 90px;
  .swiper-pagination-bullet-active{
    background:rgb(194, 37, 37);
  }
}
.swiper-button-prev, .swiper-button-next{
  top: 24.6%;
  display: none;
}
.swiper-button-next{
  right: 29px;
  width: 140px;
  height: 184px;
  i{
    color: rgb(120, 118, 118);
    font-size: 22px;
    font-weight: bold;
    display: inline-block;
    margin-left: 97px;
    margin-top: 50%;
  }
}
.swiper-button-prev{
  left: 29px;
  width: 140px;
  height: 184px;
  i{
    color: rgb(120, 118, 118);
    font-size: 22px;
    font-weight: bold;
    display: inline-block;
    margin-left: 20px;
    margin-top: 50%;
  }
}
.swiper-button-next:after,.swiper-button-prev:after{
  content:'';
}
</style>