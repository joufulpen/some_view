/**
*
* @authors Your Name (you@example.org)
* @date    2019-01-04 15:02:30
* @version $Id$
*/
var resourceName = 'AuthRole'
var apiName = JSON.parse(window.coolLocals['index.json'])['apiName'] //获取apiName
window.vm = new Vue({
  el: '#root',
  data: {
     uniqueDeployKey:{
      api: apiDict[apiName] + resourceName
     },
     axiosSetting:{
        baseURL: apiDict[apiName]
      },
     uniqueKey: apiDict[apiName] + resourceName,
     dialogVisible:false,
     // 弹出框
    dialogs: [{
        top: '5vh',
        name: 'dialog',
        visible: false,
        collapse: false,
        width: '90%',
        title: '',
        src: '',
      }
    ], 
    userId:null       
  },
  mounted() {
    this.$el.style.visibility = 'visible'
  },
  methods: {
    tableSelectionChange(arg){
      if (arg.length != 0) {
        this.userId=arg[0].id
        }     
      console.log(arg,this.userId)
    },
    authority(arg){
      console.log(arg)
      this.dialogs[0].src = '../authority/authority.html' + '#' + token + '#' + this.userId
      this.dialogs[0].title = '权限分配'
        setTimeout(() => {
          console.log('open')
          getDialog(this.dialogs,'dialog').visible = true
        }, 100)
    }
  }
})