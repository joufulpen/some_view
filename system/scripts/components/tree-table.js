"use strict";
function treeToArray(data, expandAll, parent = null, level = null) {
  let tmp = []
  Array.from(data).forEach(function(record) {
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandAll)
    }
    let _level = 1
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(record, '_level', _level)
    // 如果有父元素
    if (parent) {
      Vue.set(record, 'parent', parent)
    }
    tmp.push(record)
    if (record.children && record.children.length > 0) {
      const children = treeToArray(record.children, expandAll, record, _level)
      tmp = tmp.concat(children)
    }
  })
  return tmp
}

Vue.component('tree-table', {
  template:'<div><el-table :data="formatData" :row-style="showRow" v-bind="$attrs" @row-click="handleRowClick" @selection-change="handleSelectionChange" highlight-current-row  stripe>\
  <el-table-column type="selection" width="55"></el-table-column>\
    <el-table-column v-if="columns.length===0" width="150">\
      <template slot-scope="scope">\
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"></span>\
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">\
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>\
          <i v-else class="el-icon-minus"></i>\
        </span>\
        {{ scope.$index }}\
        </template>\
    </el-table-column>\
    <el-table-column v-for="(column, index) in columns" v-else :key="column.value" :label="column.text" :width="column.width" show-overflow-tooltip>\
      <template slot-scope="scope">\
        <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space"></span>\
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">\
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>\
          <i v-else class="el-icon-minus"></i>\
        </span>\
        {{ scope.row[column.value] }}\
        </template>\
    </el-table-column>\
</el-table></div>',
  props: {
  data: {
    type: [Array, Object],
    required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  methods: {
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    },
    handleRowClick(arg) {
      this.$emit('row-click', arg)
    },
    handleSelectionChange(arg) {
      this.$emit('selection-change', arg)
    },
  }
})

