import Vue from 'vue'

export const state = () => ({
  data: {
    statistic: {}, // 统计数据
    notice: {}, // 公告数据
    cdk: [] // 激活码数据
  },
  table: {
    column: [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
      },
      {
        title: '激活码',
        dataIndex: 'cdk',
        key: 'cdk',
        scopedSlots: { customRender: 'cdk' },
        width: '30%',
        align: 'center'
      },
      {
        title: '代理',
        dataIndex: 'agent',
        key: 'agent',
        align: 'center'
      },
      {
        title: '状态',
        dataIndex: 'used',
        scopedSlots: { customRender: 'used' },
        key: 'used',
        align: 'center'
      },
      {
        title: '天数',
        dataIndex: 'param',
        key: 'param',
        align: 'center'
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center'
      },
      {
        title: '标签',
        dataIndex: 'tag',
        key: 'tag',
        align: 'center'
      }
    ]
  }
})

export const mutations = {
  // 保存统计数据
  setStatistic(state, data) {
    state.data.statistic = data
  },
  // 保存公告数据
  setNotice(state, data) {
    state.data.notice = data
  },
  // 保存激活码数据
  setCDK(state, data) {
    state.data.cdk = data
  }
}

export const actions = {
  // 获取统计信息
  getStatistic({ commit }) {
    this.$axios.get('/getStatistics').then(({ data }) => {
      commit('setStatistic', data)
    })
  },
  // 获取公告信息
  getNotice({ commit }) {
    return this.$axios.get('/getAnnouncement').then(({ data }) => {
      commit('setNotice', data)
    })
  },
  // 编辑公告信息
  editNotice({ dispatch }, payload) {
    this.$axios.post('/createAnnouncement', payload).then(() => {
      dispatch('getNotice')
      Vue.prototype.$message.success('编辑成功')
    })
  },
  // 创建激活码
  createCDK(_, payload) {
    Vue.prototype.$confirm({
      title: '确认创建?',
      content: `将立即创建 ${payload.count} 个激活码！`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.$axios.post('/createCDK', payload).then(() => {
          Vue.prototype.$message.success('创建成功')
        })
      }
    })
  },
  // 搜索激活码
  getCDKByTag({ commit }, payload) {
    this.$axios.get(`/checkCDKByTag?keyword=${payload.keyword}`).then(({ data }) => {
      commit('setCDK', data.cdkList)
    })
  },
  // 搜索激活码
  getCDKByType({ commit }, payload) {
    this.$axios.get(`/checkCDKByType?keyword=${payload.keyword}`).then(({ data }) => {
      commit('setCDK', data.cdkList)
    })
  }
}
