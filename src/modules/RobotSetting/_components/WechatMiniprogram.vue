<template>
  <div class="wx-miniprogram-wrapper">
    <img src="../../../assets/images/wx_miniprogram.svg">
    <p class="title">{{$t('robot_setting.scan_qrcode')}}</p>
    <p class="robot-name">{{$t('robot_setting.bf_dolores')}}</p>
    <div class="qr-code"></div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
.wx-miniprogram-wrapper{
  width: 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-top: 1px solid $color-borderline-disabled;
  border-bottom: 1px solid $color-borderline-disabled;
  img{
    width: 64px;
    margin-bottom: 30px;
  }
  .title, .robot-name{
    margin-bottom: 10px;
    @include font-14px();
  }
  .qr-code{
    width: 120px;
    height: 120px;
    background: black;
    margin-bottom: 20px;
  }
}
</style>