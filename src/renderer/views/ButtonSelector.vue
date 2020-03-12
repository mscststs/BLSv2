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
    'options',
    'single',
    'notEmpty'
  ],
  computed: {
    notEmptyMode () {
      return this.notEmpty !== undefined
    },
    singleMode () {
      return this.single !== undefined
    },
    renderOptions () {
      return this.options || []
    }
  },
  data () {
    return {
      selected: []
    }
  },
  mounted () {
    let defaultSelected = []
    if ((this.notEmptyMode || this.singleMode) && this.value.length === 0 && this.renderOptions.length) {
      defaultSelected = [this.renderOptions[0].value]
    } else {
      defaultSelected = this.value
    }
    this.selected = defaultSelected
    this.$emit('input', this.selected)
  },
  methods: {
    toggleSelect (value) {
      if (this.singleMode) {
        // 单选模式
        this.selected = [value]
      } else {
        // 多选模式
        if (~this.selected.indexOf(value)) {
          if (this.notEmptyMode && this.selected.length === 1) {
            // 至少选择一项
            return
          }
          this.selected = this.selected.filter(b => b !== value)
        } else {
          this.selected.push(value)
        }
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