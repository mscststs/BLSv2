<template>
  <div class="buttonGroup">
    <template v-for="(item) of renderOptions">
      <button 
        :key="item.value"
        class="options" 
        :class="{selected:~selected.indexOf(item.value)}"
        @click="toggleSelect(item.value)"
      >
        {{item["label"]}}
      </button>
    </template>
  </div>
</template>
<script>
export default {
  name: 'ButtonSelector',
  props: [
    'value',
    'options'
  ],
  computed: {
    renderOptions () {
      return this.options || []
    }
  },
  data () {
    return {
      selected: this.value
    }
  },
  methods: {
    toggleSelect (value) {
      if (~this.selected.indexOf(value)) {
        this.selected = this.selected.filter(b => b !== value)
      } else {
        this.selected.push(value)
      }
      this.$emit('input', this.selected)
    }
  }
}
</script>
<style lang="less">
  .buttonGroup{
    .options{
      color:#999;
      margin:0 2px;
      &.selected{
        background-color:#007acc;
        color:#eee;
      }
    }
  }
</style>