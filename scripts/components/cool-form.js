
Vue.component('cool-form', {
  template: ' <div class="cool-form">\
    <el-form :model="formItems" :rules="rules" ref="ruleForm" :size="size" :inline="inline" :label-position="labelPosition" :label-width="labelWidth">\
      <el-form-item :label="item.label" :prop="\'form.\' + index + \'.value\'" v-for="(item,index) in formItems.form" :style="item.style" :key="index" :rules="item.rules">\
        <el-input v-model="item.value"  @change="updateForm" v-if="item.type==\'input\'"  :style="item.inputStyle" :size="inputSize" @click.native="itemClick" :name="item.prop" :disabled="item.disabled" :type="item.inputType" :readonly="item.readonly"></el-input>\
        <el-radio-group v-model="item.value" v-if="item.type==\'radio\'" :style="item.inputStyle"  @change="updateForm" :size="inputSize" :disabled="item.disabled">\
          <el-radio :label="ele.value" v-for="(ele,index) in item.radioItems" :key="index">{{ele.label}}</el-radio>\
        </el-radio-group>\
        <el-select v-model="item.value"  v-if="item.type==\'select\'" :style="item.inputStyle"  @change="updateForm" :size="inputSize">\
          <el-option v-for="(ele,index) in item.options" :label="ele.label" :value="ele.value" :key="index"></el-option>\
        </el-select>\
        <el-checkbox-group v-model="item.value" v-if="item.type==\'chenckbox\'" :style="item.inputStyle" :size="inputSize">\
          <el-checkbox v-for="ele in item.chenckboxItems" :key="ele.index" :label="ele.value"  @change="updateForm">{{item.label}}</el-checkbox>\
        </el-checkbox-group>\
       <el-switch v-if="item.type == \'switch\'"  v-model="item.value" :active-color="item.activeColor" :inactive-color="item.inactiveColor" :disabled="item.disabled" :width="item.width" :active-icon-class="item.activeIconClass" :inactive-icon-class="item.inactiveIconClass" :active-text="item.activeText" :inactive-text="item.inactiveText" :active-value="item.activeValue" :inactive-value="item.inactiveValue" :name="item.name" :validate-event="item.validateEvent" @change="updateForm" :style="item.inputStyle">\
      </el-switch>\
        <el-autocomplete v-model="item.value" :fetch-suggestions="querySearch" :size="inputSize" :style="item.inputStyle" v-if="item.type==\'autocomplete\'" @select="handleSelect"  @change="updateForm"></el-autocomplete>\
        <el-date-picker type="date" v-model="item.value" :size="inputSize" :format="item.format" :value-format="item.valueFormat" :disabled="item.disabled" v-if="item.type==\'date\'" :style="item.inputStyle"  @change="updateForm" :clearable="false" format="yyyy-MM-dd" value-format="yyyy-MM-ddT00:00:00" :placeholder="item.placeholder"></el-date-picker>\
        <el-input v-model="item.value" size="inputSize" type="textarea" :rows="item.rows"  @change="updateForm" v-if="item.type==\'textarea\'" :style="item.inputStyle"></el-input>\
        <el-input-number class="formNumber" v-model="item.value" :size="inputSize" @change="updateForm" v-if="item.type==\'inputNumber\'" :min="item.min" :max="item.max" label="item.label" :style="item.inputStyle" :controls="false" :precision="item.precision"></el-input-number>\
        <el-input :placeholder="item.placeholder" v-model="item.value" @change="updateForm" v-if="item.type==\'mixInput\'"  :style="item.inputStyle" :size="inputSize" @click.native="itemClick" :name="item.prop" :disabled="item.disabled">\
            <el-button @click="mixInputButtonEvent" slot="append" icon="el-icon-search"></el-button>\
          </el-input>\
      </el-form-item>\
    </el-form>\
    <slot name="otherItem" ></slot>\
  </div>',
  props: {
    formItems: Object,
    size: String,
    inline: Boolean,
    itemWidth: String,
    itemStyle: Object,
    labelWidth: String,
    rules: Object,
    labelPosition: String
  },
  data() {
    return {
      inputSize: 'mini'
    }
  },
  mounted() {
    this.updateForm()
  },
  methods: {
    updateForm() {
      var obj = {}
      this.formItems.form.forEach(p => {
        // if(p.value!==''){}
        obj[p.name] = p.value
      })
      this.$emit('update-form', obj)
    },
    mixInputButtonEvent(){
      this.$emit('input-button-event')
    },

    itemClick(ev) {
      this.$emit('click-events', ev)
    },
    querySearch(queryString, cb) {
      this.$emit('querysearch', queryString, cb)
    },
    handleSelect(item) {
      this.$emit('select', item)
      this.updateForm()
    },
    validateForm(){
      let judge=undefined
      this.$refs.ruleForm.validate((valid) => {
        return judge=valid
       })
       return judge
    },
    clearForm(){
      this.$refs.ruleForm.clearValidate()
    },
    resetForm(){
      this.$refs.ruleForm.resetFields()
    }
  }
})
