var token = window.location.hash.split('?')[0].split('#')[1]
if (token == undefined || token == '') token = localStorage.getItem('token')
else {
  localStorage.setItem('token', token)
  window.location = window.location.href.replace(token, '')
}

if (token === undefined || token === '') {
  window.top.location.replace(`${serveDict.loginURL}##${encodeURIComponent(window.top.location)}`)
}

var id = decodeURIComponent(window.location.hash.split('?')[0].split('#')[2])

// axios  loading
window.winObj = { requestCounter: 0, loading: undefined }
Vue.mixin({
  data: () => ({ winObj: window.winObj }),
  watch: { 'winObj.requestCounter': v => (v === 0 ? window.winObj.loading.close() : (window.winObj.loading = Vue.prototype.$loading())) },
})

//axios
axios.defaults.headers.common['cool-token'] = token

// creat module axios
var axiosDict = {}
Object.keys(apiDict).forEach(key => {
  let url = apiDict[key]
  axiosDict[key] = axios.create({
    baseURL: url,
    headers: {
      'cool-token': token,
    },
  })
  axiosDict[key].interceptors.request.use(interceptorsRequest)
  axiosDict[key].interceptors.response.use(commonSuccess, commonError)
})

// postMessage reLogin
function reLogin() {
  console.log('login ')
  window.location.replace(`${serveDict.loginURL}##${encodeURIComponent(window.location.href.split('#')[0])}`)
}
// 成功、错误处理
function commonSuccess(resp) {
  //处理token级别的错误（code）
  setTimeout(() => {
    window.winObj.requestCounter--
  }, 500)
  if (resp.data.code) {
    if (resp.data.code == 101) {
      Vue.prototype.$notify.error({
        title: resp.data.message,
        message: '5秒后将返回登录界面',
        duration: 5000,
      })
      console.log('登录失效', window)
      setTimeout(() => {
        window.top.postMessage({ method: 'reLogin' }, '*')
      }, 5000)
      console.log(resp.data)
      return Promise.reject(resp.data)
    }
    if (resp.data.code != 0) {
      Vue.prototype.$notify.error({
        title: resp.data.message,
        message: '详情请看控制台',
        duration: 0,
      })
      return Promise.reject(resp.data)
    }
    return Promise.resolve(resp.data)
  } else {
    //处理业务级别的错误（state)
    switch (resp.data.state) {
      case 'success':
        if (resp.data.hasOwnProperty('total')) {
          return Promise.resolve(resp.data)
        } else {
          return Promise.resolve(resp.data.rows)
        }
      case 'warn':
        Vue.prototype.$notify.warning({
          title: '警告',
          message: resp.data.message,
          duration: 0,
        })
        console.log(resp.data)
        return Promise.reject(resp.data)
      default:
        Vue.prototype.$notify.error({
          title: resp.data.message,
          message: '详情请看控制台',
          duration: 0,
        })
        console.log(resp.data)
        return Promise.reject(resp.data)
    }
  }
}

function commonError(error) {
  console.log(error)
  if (error.response) {
    Vue.prototype.$notify.error({
      title: error.response.data.exceptionMessage
        ? error.response.data.exceptionMessage
        : error.response.data.message
        ? error.response.data.message
        : error.response.data,
      message: '详情请看控制台',
      duration: 0,
    })
  } else {
    if (error.message)
      Vue.prototype.$notify.error({
        title: error.message,
        message: '详情请看控制台',
        duration: 0,
      })
    else
      Vue.prototype.$notify.error({
        title: '未知错误',
        message: '详情请看控制台',
        duration: 0,
      })
  }
  setTimeout(() => {
    window.winObj.requestCounter--
  }, 500)
  return Promise.reject(error)
}

function interceptorsRequest(config) {
  window.winObj.requestCounter++
  return config
}

// postMessage
function receiveMessage(event) {
  var func = window[event.data.method]
  if (func == undefined) return
  var args = event.data.args
  func(args, event.source)
}
window.addEventListener('message', receiveMessage, false)

//table分页index连续的方法，一般用于getData方法给data赋值的时候。
function formatIndex(arr, page, size) {
  arr.forEach((item, index) => {
    //res.data.data.records 表格数据     forEach为每一项添加数据
    item.index = index + 1 + (page - 1) * size
    // this.currentPage当前页 this.pageParams.size 每页显示多少 :page-sizes="[10,20,30,50]" 分页大小
  })
  return arr
}
// formatter
function numberToFixedFormatter(arg, columns) {
  if (!isEmpty(arg[columns.property])) {
    return arg[columns.property].toFixed(2)
  }
}

function dateFormatter(arg, columns) {
  if (!isEmpty(arg[columns.property])) {
    return dayjs(arg[columns.property]).format('YYYY-MM-DD')
  }
}

function setQueryTime(queryForm) {
  var currentTime = dayjs().format('YYYY-MM-DD 23:59:59')
  queryForm.createDate.value[0] = dayjs(currentTime).subtract(60, 'day').format('YYYY-MM-DD 00:00:00')
  queryForm.createDate.value[1] = currentTime
}
// 附件下载方法
function downloadFiles(id) {
  let baseURL = `${apiDict['basic']}Attachment`
  axiosDict['basic'].get('Attachment', { params: { id } }).then(data => {
    if (data.base64 != null) {
      //如果是服务器判断是小文件，会直接base64传
      var blob = atob(data.base64)
      var ab = new ArrayBuffer(blob.length)
      var ia = new Uint8Array(ab)
      // set the bytes of the buffer to the correct values
      for (var i = 0; i < blob.length; i++) ia[i] = blob.charCodeAt(i)
      var file = new File([ab], data.name)
      window.saveAs(file, data.name)
    } else {
      //文件太大直接传会造成浏览器内存压力，改为外部链接，用流下载
      let currentID = JSON.parse(JSON.stringify(id))
      let elemIF = document.createElement('iframe')
      elemIF.src = `${baseURL}\\Download?key=${data.downloadKey}`
      elemIF.style.display = 'none'
      elemIF.setAttribute('id', currentID)
      document.body.appendChild(elemIF)
      setTimeout(() => {
        document.body.removeChild(document.getElementById(currentID))
      }, 1000)
    }
  })
}
// isEmpty
function isEmpty(obj) {
  return typeof obj == 'undefined' || obj == null || obj.toString().trim().length == 0 ? true : false
}

// 为了兼容万恶的仓库模块

// let oldAxios = axios.create({
//   baseURL: apiDict['warehouse'],
//   headers: {
//     'cool-token': token,
//   },
// })

// oldAxios.interceptors.request.use(interceptorsRequest)
// oldAxios.interceptors.response.use(oldSuccess, oldError)
// function oldSuccess(resp) {
//   setTimeout(() => window.winObj.requestCounter--, 500)
//   resp.data.diyCheck = true
//   if (resp.data.code !== 200 && resp.data.code !== 0) {
//     Vue.prototype.$notify.error({
//       title: resp.data.msg,
//       message: '详情请看控制台',
//       // duration: 0,
//     })
//     resp.data.diyCheck = false
//     return Promise.resolve(resp)
//   }
//   return Promise.resolve(resp)
// }

// function oldError(error) {
//   setTimeout(() => window.winObj.requestCounter--, 500)
//   console.log('错误处理')
//   if (error.response) {
//     Vue.prototype.$notify.error({
//       title: error.response.data.exceptionMessage ? error.response.data.exceptionMessage : error.response.data.msg,
//       message: '详情请看控制台',
//       duration: 0,
//     })
//   } else {
//     Vue.prototype.$notify.error({
//       title: '未知错误',
//       message: '详情请看控制台',
//       duration: 0,
//     })
//   }
//   return Promise.reject(error)
// }
// /*
// 【coolAxios】
// url:请求路径
// prama:请求参数
// root: 值为 this
// data:请求成功后需执行的逻辑
//  */
// function coolAxios(url, param, root, data) {
//   // var loading = setLoading(root)
//   oldAxios.post(url, param).then(res => {
//     res = res.data
//     console.log(res)
//     // 进来的时候 如果是要拿取数据的 先将数据清空 这样在请求失败的时候 页面数据就为空
//     if (typeof data == 'object') {
//       for (keys in data) {
//         if (keys == 'takeData' && typeof data[keys] == 'object') data[keys].splice(0, data[keys].length)
//       }
//     }
//     //当页面一开始有数据，然后数据被删空 或者查找不到数据时 把total设为0
//     if (res.msg == '没有数据' && window.hasOwnProperty('vm') && window.vm.hasOwnProperty('total'))
//       window.vm.hasOwnProperty('hdrTableData') ? (root.hdrTableData.total = 0) : (root.total = 0)
//     // var test = checkCode(res.code, res.msg, root, loading);
//     if (res.diyCheck) {
//       // 判断是否有分页 如果有 计算排序号
//       if (res.hasOwnProperty('data') && res.data.hasOwnProperty('records') && res.data.hasOwnProperty('current') && res.data.hasOwnProperty('size')) {
//         console.log(res.data.records, res.data.current, res.data.size)
//         res.data.records.forEach((p, index) => {
//           p.index = p.index = index + 1 + (res.data.current - 1) * res.data.size
//         })
//       }
//       // 判断传入的data参数类型
//       // 当data为obje时
//       if (typeof data == 'object') {
//         // 遍历判断对象键值的类型
//         for (keys in data) {
//           if (typeof data[keys] == 'function') data[keys](res, root)
//           //当请求成功后需要显示message时 可在对象里定义{msg:true}
//           if (keys == 'msg' && data[keys] == true)
//             root.$message({
//               type: 'success',
//               message: res.msg,
//               duration: 1000,
//             })
//           // 当后端返回的数据格式没有records时 执行该方法
//           if (
//             keys == 'takeData' &&
//             typeof data[keys] == 'object' &&
//             res.hasOwnProperty('data') &&
//             Object.prototype.toString.call(res.data) === '[object Array]'
//           ) {
//             data[keys] = res.data.map(item => {
//               return data[keys].push(item)
//             })
//           }
//           // 当后端返回的数据格式有records时 执行该方法
//           if (keys == 'takeData' && typeof data[keys] == 'object' && res.hasOwnProperty('data') && res.data.hasOwnProperty('records')) {
//             data[keys] = res.data.records.map(item => {
//               return data[keys].push(item)
//             })
//           }
//           // 数据总条数 因技术有限 目前 只能做到 在传入的对象中定义{total:this.total} 也就是说 页面上要定义total
//           if (keys == 'total' && res.hasOwnProperty('data') && res.data.hasOwnProperty('total') && window.hasOwnProperty('vm')) {
//             let changTotal = function () {
//               if (window.vm.hasOwnProperty('hdrTableData')) {
//                 return (this.hdrTableData.total = res.data.total)
//               } else {
//                 return (this.total = res.data.total)
//               }
//             }
//             changTotal.call(window.vm)
//           }
//         }
//       }
//       // 当data为函数
//       if (typeof data == 'function') data(res, root)
//       //当data为字符串时 不建议传字符串 不过还是把它写在了这里
//       typeof data == 'string' && data.indexOf('this.') != -1 ? eval(data.replace(/this./g, 'root.')) : eval(data)
//     } else {
//       if (typeof data == 'object') {
//         for (keys in data) {
//           if (keys == 'else' && typeof data[keys] == 'function') data[keys](res, root)
//         }
//       }
//     }
//   })
// }

// /*
// 【delData】 主表页面删除提示方法
// url: axios请求的路径
// param: axios请求参数
// root：值为this
// func：回调函数
//  */
// function delData(url, param, root, func) {
//   {
//     root
//       .$confirm('此操作将删除所选数据, 是否继续?', '提示', {
//         confirmButtonText: '确定',
//         cancelButtonText: '取消',
//         type: 'warning',
//       })
//       .then(() => {
//         oldAxios.post(url, param).then(res => {
//           res = res.data

//           setTimeout(() => {
//             root.$message({
//               type: 'success',
//               message: res.msg,
//               duration: 1000,
//             })
//           }, 500)
//           func()
//         })
//       })
//       .catch(() => {
//         root.$message({
//           type: 'info',
//           message: '已取消删除',
//           duration: 1000,
//         })
//       })
//   }
// }

// //
// let newAxios = axios.create({
//   baseURL: apiDict['warehouse'],
//   headers: {
//     'cool-token': token,
//   },
// })

// newAxios.interceptors.request.use(interceptorsRequest)
// newAxios.interceptors.response.use(newSuccess, newError)

// function newSuccess(resp) {
//   if (resp.data.code !== 200 && resp.data.code !== 0) {
//     return newError(resp, true)
//   }
//   setTimeout(() => window.winObj.requestCounter--, 500)
//   return Promise.resolve(resp.data)
// }

// function newError(error, check) {
//   setTimeout(() => window.winObj.requestCounter--, 500)
//   console.log('进入错误处理')
//   if (check) {
//     // if(error.data.msg!=='没有数据'){
//     Vue.prototype.$notify.error({
//       title: error.data.msg,
//       message: '详情请看控制台',
//       // duration: 0,
//     })
//     // }
//   } else if (error.response) {
//     Vue.prototype.$notify.error({
//       title: error.response.data.exceptionMessage ? error.response.data.exceptionMessage : error.response.data.msg,
//       message: '详情请看控制台',
//       duration: 0,
//     })
//   } else {
//     Vue.prototype.$notify.error({
//       title: '未知错误',
//       message: '详情请看控制台',
//       duration: 0,
//     })
//   }
//   return Promise.reject(error)
// }

function receiveFilters(filters) {
  let styleTag = document.getElementById('cool-filters') ? document.getElementById('cool-filters') : document.body.appendChild(document.createElement('style'))
  styleTag.id = 'cool-filters'
  let hue = -(filters.invert ? filters.hue + 180 : filters.hue)
  let brightness = Math.pow(Math.E, filters.invert ? filters.brightness : -filters.brightness)
  brightness = 1 / brightness
  let saturate = Math.pow(Math.E, filters.saturate)
  saturate = filters.invert ? 1 / saturate : saturate
  let contrast = Math.pow(Math.E, filters.invert ? filters.contrast : -filters.brightness)
  contrast = filters.invert ? contrast : 1 / contrast
  styleTag.innerText = `img {filter: contrast(${contrast}) saturate(${saturate}) brightness(${brightness}) hue-rotate(${hue}deg) invert(${
    filters.invert ? 1 : 0
  })}`
}
window.top.postMessage({ method: 'getFilters' }, '*')

function getDialog(dialogs, name) {
  return dialogs.filter(function (dialog) {
    return dialog.name === name
  })[0]
}

function globalVarsChanged({ name, value }) {
  window[name] = value
  console.info(`全局变量${name}已改为${value}`)
  //要放入axios的话：
  if (['WHID'].includes(name)) {
    axios.defaults.headers.common[name] = value
    Object.values(axiosDict).forEach(a => (a.defaults.headers.common[name] = value))
  }
}

window.top.postMessage({ method: 'subscribeGlobalVars', args: 'WHID' }, '*')
