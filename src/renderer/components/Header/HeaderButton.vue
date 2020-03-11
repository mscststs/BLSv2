<template>
  <button class="headerBtn flex flex-center" :class="stateClass" @click.prevent.stop="clickBtn"
  :title="tooltip">
    <ficon :icon="icon"></ficon>
  </button>
</template>

<script>

export default {
  name: 'HeaderButton',
  props: [
    'icon',
    'type',
    'tooltip'
  ],
  computed: {
    stateClass () {
      if (this.type === 'danger') {
        return 'danger'
      } else {
        return 'info'
      }
    }
  },
  methods: {
    clickBtn () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="less">
  .headerBtn{
    height:100%;
    padding:0 20px;
    color:#fefcfc;
    font-size: 16px;
    transition:background-color 0.25s;
    -webkit-app-region: no-drag;
    min-width: 60px;
    &:hover{
      &.danger{
        background-color:#d71526;
      }
      &.info{
        background-color:#505050;
      }
      color:#fff;
    }
  }
</style>