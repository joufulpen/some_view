window.vm = new Vue({
  el: '#root',
  data: {
    apps: [
      {
        appid: '业务管理',
        description: '...',
        loading: true,
        claims: [],
      },
      {
        appid: '采购管理',
        description: '...',
        loading: true,
        claims: [],
      },
      {
        appid: '仓库管理',
        description: '...',
        loading: true,
        claims: [],
      },
      {
        appid: '基础资料管理',
        description: '...',
        loading: true,
        claims: [],
      },
      {
        appid: '生产计划管理',
        description: '...',
        loading: true,
        claims: [],
      },
      {
        appid: '系统管理',
        description: '...',
        loading: true,
        claims: [],
      },
      {
        appid: '包装模块',
        description: '...',
        loading: true,
        claims: [],
      },
      {
        appid: 'SSO模块',
        description: '...',
        loading: true,
        claims: [],
      },
    ],
    selection: [],
    roleAuthority: [],
  },
  computed: {
    appResources() {
      return this.apps.map(app => ({
        appid: app.appid,
        resources: app.claims
          .map(claim => claim.resource)
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(r => ({
            resource: r,
          })),
      }))
    },
    appActions() {
      return this.apps.map(app => ({
        appid: app.appid,
        actions: app.claims
          .map(claim => claim.action)
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(a => ({
            action: a,
          })),
      }))
    },
  },
  created() {
    this.getData(id)
  },
  methods: {
    selectAll(appid) {
      this.selection.find(p => p.appid == appid).claims =
        this.selection.find(p => p.appid == appid).claims.length < this.apps.find(p => p.appid == appid).claims.length
          ? this.apps.find(p => p.appid == appid).claims
          : []
    },
    saveClick() {
      this.roleAuthority.permissionList = JSON.stringify(this.selection)
      axiosDict['system'].put('AuthRole', this.roleAuthority).then(() => window.location.reload())
    },
    getAuthorityList() {
      return axios.all(
        this.apps.map(arg => {
          return axiosDict['authorityManagement'].get('appclaim/getlist', { params: { appid: arg.appid } }).then(res => (arg.claims = res.claims))
        })
      )
    },
    getRoleClaims(roleId) {
      return axiosDict['system'].get('AuthRole', { params: { id: roleId } }).then(data => {
        this.roleAuthority = data
        return JSON.parse(data.permissionList)
      })
    },
    getData(roleId) {
      axios.all([this.getAuthorityList(), this.getRoleClaims(roleId)]).then(
        axios.spread((_, roleClaims) => {
          if (roleClaims == undefined) {
            roleClaims = []
          }
          this.selection = this.apps.map(app => {
            app.loading = false
            return {
              appid: app.appid,
              claims: app.claims.filter(c => {
                let roleClaim = roleClaims.find(a => a.appid == app.appid)
                if (roleClaim) return roleClaim.claims.some(rc => rc.resource == c.resource && rc.action == c.action)
                return false
              }),
            }
          })
        })
      )
    },
    getResources(appid) {
      return this.appResources.find(a => a.appid == appid).resources
    },
    getActions(appid) {
      return this.appActions.find(a => a.appid == appid).actions
    },
    getDisabled(appid, resource, action) {
      return !this.apps.find(a => a.appid == appid).claims.some(c => c.resource == resource && c.action == action)
    },
    getLabel(appid, resource, action) {
      return this.apps.find(a => a.appid == appid).claims.find(c => c.resource == resource && c.action == action)
    },
  },
})
