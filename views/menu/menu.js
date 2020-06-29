window.vm = new Vue({
  el: '#root',
  data: {
    urlMenu:  apiDict['system'] + 'Menu',
    menuDialogTitle:'',
    // buttons
    buttons: [
        {
          text: '查询',
          size: 'mini',
          icon: '#iconchaxun',
          type: 'warning',
          disabled: false
        },
        {
          text: '添加',
          size: 'mini',
          icon: '#iconxinzeng',
          type: 'success',
          disabled: false
        },
        {
          text: '编辑',
          size: 'mini',
          icon: '#iconERP_bianji',
          type: 'primary',
          disabled: true
        },
        {
          text: '删除',
          size: 'mini',
          icon: '#iconERP_shanchu',
          type: 'primary',
          disabled: true
        }
      ],
      // edit dialog
    editDialogTitle:'新增菜单/编辑',
    columns: [{
        type:"selection"
    },{
        label: '名称',
        prop: 'text'
      },
      {
        label: '图标',
        prop: 'icon'
      },
      {
        label: '排序号',
        prop: 'orderNum',
      },
      {
        label: '地址',
        prop: 'url'
      },
      {
        label: '模块链接',
        prop: 'moduleURL'
      }
    ],

    data: [],
    dialogVisible: false,
    form: {},
    selection: [],
    iconDialogVisible: false,
    formItems: {
      form: [{
          label: '上级菜单',
          value: '',
          name: 'parentId',
          type: 'select',
          options:[],
          inputStyle:{"width":"250px"},
          disabled:false,
        },
        {
          label: '菜单名称',
          value: '',
          name: 'text',
          type: 'input',
          inputStyle:{"width":"250px"},
          rules: {
            required: true,
            message: '菜单名称不能为空',
            trigger: 'blur'
          }
        },
        {
          label: '链接地址',
          value: '',
          name: 'url',
          inputStyle:{"width":"250px"},
          type: 'input'
        },
        {
          label: '菜单图标',
          value: '',
          name: 'icon',
          inputStyle:{"width":"250px"},
          type: 'input'
        },
        {
          label: '排序号',
          value: '',
          name: 'orderNum',
          type: 'inputNumber',
          inputStyle:{"width":"250px"},
        },
        {
          label: '模块链接',
          value: '',
          name: 'moduleURL',
          type: 'input',
          inputStyle:{"width":"250px"}
        }
      ]
    },
    //菜单图标选择
    icons: [{
        class: 'el-icon-info'
      },
      {
        class: 'el-icon-error'
      },
      {
        class: 'el-icon-success'
      },
      {
        class: 'el-icon-warning'
      },
      {
        class: 'el-icon-question'
      },
      {
        class: 'el-icon-back'
      },
      {
        class: 'el-icon-arrow-left'
      },
      {
        class: 'el-icon-arrow-down'
      },
      {
        class: 'el-icon-arrow-right'
      },
      {
        class: 'el-icon-arrow-up'
      },
      {
        class: 'el-icon-caret-left'
      },
      {
        class: 'el-icon-caret-bottom'
      },
      {
        class: 'el-icon-caret-top'
      },
      {
        class: 'el-icon-caret-right'
      },
      {
        class: 'el-icon-d-arrow-left'
      },
      {
        class: 'el-icon-d-arrow-right'
      },
      {
        class: 'el-icon-minus'
      },
      {
        class: 'el-icon-plus'
      },
      {
        class: 'el-icon-remove'
      },
      {
        class: 'el-icon-circle-plus'
      },
      {
        class: 'el-icon-remove-outline'
      },
      {
        class: 'el-icon-circle-plus-outline'
      },
      {
        class: 'el-icon-close'
      },
      {
        class: 'el-icon-check'
      },
      {
        class: 'el-icon-circle-close'
      },
      {
        class: 'el-icon-circle-check'
      },
      {
        class: 'el-icon-circle-close-outline'
      },
      {
        class: 'el-icon-circle-check-outline'
      },
      {
        class: 'el-icon-zoom-out'
      },
      {
        class: 'el-icon-zoom-in'
      },
      {
        class: 'el-icon-d-caret'
      },
      {
        class: 'el-icon-sort'
      },
      {
        class: 'el-icon-sort-down'
      },
      {
        class: 'el-icon-sort-up'
      },
      {
        class: 'el-icon-tickets'
      },
      {
        class: 'el-icon-document'
      },
      {
        class: 'el-icon-goods'
      },
      {
        class: 'el-icon-sold-out'
      },
      {
        class: 'el-icon-news'
      },
      {
        class: 'el-icon-message'
      },
      {
        class: 'el-icon-date'
      },
      {
        class: 'el-icon-printer'
      },
      {
        class: 'el-icon-time'
      },
      {
        class: 'el-icon-bell'
      },
      {
        class: 'el-icon-mobile-phone'
      },
      {
        class: 'el-icon-service'
      },
      {
        class: 'el-icon-view'
      },
      {
        class: 'el-icon-menu'
      },
      {
        class: 'el-icon-more'
      },
      {
        class: 'el-icon-more-outline'
      },
      {
        class: 'el-icon-star-on'
      },
      {
        class: 'el-icon-star-off'
      },
      {
        class: 'el-icon-location'
      },
      {
        class: 'el-icon-location-outline'
      },
      {
        class: 'el-icon-phone'
      },
      {
        class: 'el-icon-phone-outline'
      },
      {
        class: 'el-icon-picture'
      },
      {
        class: 'el-icon-picture-outline'
      },
      {
        class: 'el-icon-delete'
      },
      {
        class: 'el-icon-search'
      },
      {
        class: 'el-icon-edit'
      },
      {
        class: 'el-icon-edit-outline'
      },
      {
        class: 'el-icon-rank'
      },
      {
        class: 'el-icon-refresh'
      },
      {
        class: 'el-icon-share'
      },
      {
        class: 'el-icon-setting'
      },
      {
        class: 'el-icon-upload'
      },
      {
        class: 'el-icon-upload2'
      },
      {
        class: 'el-icon-download'
      },
      {
        class: 'el-icon-loading'
      },
    ],
  },
  created(){
    this.getData()
},
  mounted() {
    this.$el.style.visibility = 'visible'
  },
  watch:{
        menuDialogTitle(arg){
        this.formItems.form[0].disabled = arg == '编辑菜单'
        if(arg == '新增菜单')
          this.formItems.form[0] = Object.assign(this.formItems.form[0],{rules: {
            required: true,
            message: '上级菜单名称不能为空',
            trigger: 'blur'
          }})
        else
          delete this.formItems.form[0].rules
    }
  },
  methods: {
    addClick() {
      this.menuDialogTitle = '新增菜单'
      this.dialogVisible = true
    },
    getForm(arg) {
      this.form = arg
    },
    getData() {
      axiosDict['system'].get(this.urlMenu + '?id=')
      .then(resp => {
          //排序
          resp.sort((a, b) => a.orderNum - b.orderNum)
          resp.map(item=>{
            item.children.sort((a, b) => a.orderNum - b.orderNum)
          })
          //获取父级的数据
          this.formItems.form.find(p=>p.name=='parentId').options = resp.map(item=>{ return{value:item.text,label:item.text} })
          this.data = resp;
          console.log(this.data)
      })
    },
    editClick() {
      this.menuDialogTitle = '编辑菜单'
      this.formItems.form.map(item=>{
          for(let i in this.selection[0]){
            if(i == item.name)item.value = this.selection[0][i]
          }
      })
      this.dialogVisible = true
    },
    handleSelectionChange(selection) {
      this.buttons.find(p=>p.text == '删除').disabled = selection.length === 0
      this.buttons.find(p=>p.text == '编辑').disabled = selection.length !== 1
      if (selection.length != 0) this.selection = selection
    },
    deleteClcik() {
      if(!this.selection.some(item=>{return item.children})){
      this.$confirm('确定要删除选定的记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selection.forEach(p => {
        this.data.map(item=>{
          console.log(item.children.indexOf(p))
          if(item.children.indexOf(p) !== -1) item.children.splice(item.children.indexOf(p), 1)
        })
      })
       console.log(this.data)
        axiosDict['system'].post(this.urlMenu,this.data).then(resp => {
            this.getData();
        }).catch((error) => {
          setTimeout(() => {
            this.$message.error(error);
          }, 500)
        })
      })
    }else{
      this.$message('抱歉 暂不给删除模块 只能删除子节点')
    }
    },
    clickEvents(ev) {
      switch (ev) {
        case '菜单图标':
          // this.iconDialogVisible = true
          break
        default:
          break
      }
    },
    iconClick(ev) {
      this.iconDialogVisible = false
      this.formItems.form[3].value = ev.target.className
      this.form.icon = ev.target.className
    },
    submit() {
    //    let instance = axios.create({
    //   baseURL: '',
    // })
    //    instance.get('/menu.json').then(res=>{
    //     console.log(res.data.rows)
    //     axios.post(this.urlMenu,res.data.rows).then(resp => {
    //         console.log(resp)
    //         this.dialogVisible = false;
    //         this.getData();
    //     })
    //    })
      if (this.$refs.formView.validateForm()) {
        if(this.menuDialogTitle == '编辑菜单'){
            this.selection[0] = Object.assign(this.selection[0],this.form)
            console.log(this.data,this.selection[0])
        }else{
            let menuId =this.form.parentId + '_' + new Date()
            menuId = menuId.replace(/\s*/g,"")
            this.data.find(p=>p.text == this.form.parentId).children.push(Object.assign(this.form,{id:menuId}))
            console.log(this.data)
        }
        axiosDict['system'].post(this.urlMenu,this.data).then(resp => {
            console.log(resp)
            this.close()
            this.getData();
        }).catch((error) => {
          setTimeout(() => {
            this.$message.error(error);
          }, 500)
        })
      } else return
    },
    buttonsevent(args) {
        switch (args.currentTarget.textContent.trim()) {
          case  '查询':
            {
              this.getData()
                //      let instance = axios.create({
                //         baseURL: '',
                //       })
                //      var self = this
                //      instance.interceptors.request.use(function (config) {
                //         // 在发送请求之前做些什么
                //         self.loading = true
                //         console.log(config,self.loading)
                //         return config;
                //       }, function (error) {
                //         // 对请求错误做些什么
                //         console.log(error)
                //         // setTimeout(()=>{this.loading = false},2000)
                //         return Promise.reject(error);
                //       });
                //      // 添加响应拦截器
                //     instance.interceptors.response.use(function (response) {
                //         // 对响应数据做点什么
                //         if(response.data.rows){
                //           console.log(response.data.rows)
                //           return response.data.rows
                //         }
                //          console.log(response)
                //         setTimeout(()=>{self.loading = false},2000)
                //         return response;
                //       }, function (error) {
                //         // 对响应错误做点什么
                //         console.log(error)
                //         setTimeout(()=>{self.loading = false},2000)
                //         return Promise.reject(error);
                //       });
                //      // instance
                //  instance.get('/new_menu.json').then(res=>{
                //   console.log(res)
                //  }).finally(()=>{
                //       console.log('finally')
                // })
              // console.log('查询')
              break
            }
          case '添加':
            {
              this.addClick()
              break
            }
          case '删除':
            {
              this.deleteClcik()
              break
            }
          case '编辑':
            {
              this.editClick()
              break
            }
        }
      },
    close() {
      this.$refs.formView.resetForm()
      this.$refs.formView.clearForm()
      this.formItems.form.map(p=>p.value = '')
      this.dialogVisible = false
    },
  }
})
