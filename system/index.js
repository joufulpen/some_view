var getItemById = (menu, id) => {
  var items = []
  menu.forEach(sub => sub.children.forEach(item => items.push(item)))
  return items.filter(item => item.id === id)[0]
}

//变色订阅，实验用
window.sources = []
function getFilters(_, source) {
  window.sources.push(source)
  if (localStorage.getItem('cool-filters') == undefined) return
  source.postMessage({ method: 'receiveFilters', args: JSON.parse(localStorage.getItem('cool-filters')) }, '*')
}

//订阅vm.globalVars对象上的属性，比如仓库ID等全局变量
function subscribeGlobalVars(name, source) {
  if (window.subscribers == undefined) window.subscribers = {}
  if (window.subscribers[name] == undefined) window.subscribers[name] = []
  window.subscribers[name].push(source)
  source.postMessage({ method: 'globalVarsChanged', args: { name, value: vm.globalVars[name] } }, '*')
}

window.vm = new Vue({
  el: '#root',
  data: {
    globalVars: { WHID: undefined },
    warehouses: undefined,
    filters:
      localStorage.getItem('cool-filters') == undefined
        ? { invert: false, hue: 0, brightness: 0, saturate: 0, contrast: 0 }
        : JSON.parse(localStorage.getItem('cool-filters')),
    index: true,
    menu: [],
    tabs: [
      {
        id: 'shouye',
        text: '首页',
        url: '',
        closable: false,
      },
    ],
    currentTab: 'shouye',
    isMenuCollapse: false,
    isHeaderCollapse: false,
    employee: undefined,
    username: undefined,
  },
  computed: {
    coolFilters: function () {
      localStorage.setItem('cool-filters', JSON.stringify(this.filters))
      window.sources.forEach(source => source.postMessage({ method: 'receiveFilters', args: JSON.parse(localStorage.getItem('cool-filters')) }, '*'))
      let invert = this.filters.invert ? 1 : 0
      let hue = this.filters.invert ? this.filters.hue + 180 : this.filters.hue
      let brightness = Math.pow(Math.E, this.filters.invert ? this.filters.brightness : -this.filters.brightness)
      let saturate = Math.pow(Math.E, this.filters.saturate)
      let contrast = Math.pow(Math.E, this.filters.invert ? this.filters.contrast : -this.filters.contrast)
      return `filter: invert(${invert}) hue-rotate(${hue}deg) brightness(${brightness}) saturate(${saturate}) contrast(${contrast});`
    },
  },
  methods: {
    takeToken(item) {
      return `${item.url}#${token}`
    },
    selectMenu(index) {
      var menuItem = getItemById(this.menu, index)
      if (!this.tabs.includes(menuItem)) this.tabs.push(menuItem)
      this.currentTab = menuItem.id
    },
    removeTab(targetName) {
      var index = this.tabs.indexOf(this.tabs.filter(tab => tab.id === targetName)[0])
      if (index >= 0) {
        this.tabs.splice(index, 1)
        if (this.tabs.length === 0) this.currentTab = 'default'
        else this.currentTab = this.tabs[index - 1].id
      }
    },
    handleCommand(command) {
      if (command == 'passwordReset') {
        window.top.location.replace(`${serveDict.passwordResetURL}##${encodeURIComponent(window.top.location.href)}`)
      }
      if (command == 'logOut') {
        window.top.location.replace(`${serveDict.loginURL}##${encodeURIComponent(window.top.location.href.split('#')[0])}`)
      }
    },
  },
  mounted() {
    axiosDict['system'].get('Menu/GetCurrent').then(data => {
      if (data) {
        // 拼接url
        data.map(item => {
          if (item.children && item.moduleURL != '') {
            item.children.map(p => {
              p.url = serveDict[item.moduleURL] + p.url
            })
          }
          // 排序
          item.children.sort((a, b) => a.orderNum - b.orderNum)
        })
        // 排序
        data.sort((a, b) => a.orderNum - b.orderNum)
        this.menu = data
      }
    })

    axiosDict['basic'].get('Employee/GetCurrent').then(data => {
      this.employee = data.employee
      this.username = data.username
    })

    //todo: 向仓库模块请求当前用户的仓库权限

    //todo: data.username传递进去订单模块，用于工作流的流程图显示

    this.$el.style.visibility = 'visible'
  },
  watch: {
    'globalVars.WHID': function (value) {
      window.WHID = value
      axios.defaults.headers.common['WHID'] = value
      Object.values(axiosDict).forEach(a => (a.defaults.headers.common[name] = value))
      //window.subscribers?['WHID']?.forEach(subscriber => subscriber.postMessage({ method: 'globalVarsChanged', args: { name: 'WHID', value } }, '*'))
      //语法太先进。。。
      if (window.subscribers && window.subscribers['WHID'])
        window.subscribers['WHID'].forEach(subscriber => subscriber.postMessage({ method: 'globalVarsChanged', args: { name: 'WHID', value } }, '*'))
    },
  },
})
