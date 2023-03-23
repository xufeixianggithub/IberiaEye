<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic
            style="text-align: center"
            title="用户总数"
            suffix="人"
            :value="$store.state.admin.overview.data.statistic.payedUserNum" />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic
            style="text-align: center"
            title="新增用户"
            suffix="人"
            :value="$store.state.admin.overview.data.statistic.newUserNum" />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic
            style="text-align: center"
            title="本日收入"
            suffix="元"
            :value="$store.state.admin.overview.data.statistic.dayIncome" />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic
            style="text-align: center"
            title="本月收入"
            suffix="元"
            :value="$store.state.admin.overview.data.statistic.monthIncome" />
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]">
      <a-col :sm="24" :md="8">
        <a-card title="公告内容">
          <a-card-meta :title="$store.state.admin.overview.data.notice.title || '暂无公告'">
            <template slot="description">
              {{ $store.state.admin.overview.data.notice.context || '蛋糕哥哥没有公告！' }}
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="8">
        <a-card title="编辑公告">
          <a-space class="w-full" :size="16" direction="vertical">
            <a-input v-model="form.notice.title" placeholder="公告标题" />
            <a-textarea v-model="form.notice.context" :auto-size="{ minRows: 3, maxRows: 5 }" placeholder="公告内容" />
            <a-button
              class="float-right"
              type="primary"
              @click="$store.dispatch('admin/overview/editNotice', form.notice)">
              保存
            </a-button>
          </a-space>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="8">
        <a-card title="激活码管理">
          <a-space class="w-full" :size="16" direction="vertical">
            <a-input v-model="form.cdk.type" addon-before="激活码类型" disabled />
            <a-input v-model="form.cdk.tag" addon-before="激活码标签" />
            <a-input v-model="form.cdk.param" addon-before="激活天数" />
            <a-input v-model="form.cdk.count" addon-before="生成数量" />
            <a-input v-model="form.cdk.agent" addon-before="代理用户" />
            <a-space class="float-right">
              <a-button type="primary" ghost @click="show.search = true"> 搜索 </a-button>
              <a-button
                type="primary"
                @click="
                  () => {
                    if (form.cdk.agent !== '0') {
                      form.cdk.isAgent = true
                    } else {
                      form.cdk.isAgent = false
                    }
                    $store.dispatch('admin/overview/createCDK', form.cdk)
                  }
                ">
                创建
              </a-button>
            </a-space>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
    <!-- 激活码搜索 -->
    <a-modal title="激活码搜索" v-model="show.search" :footer="null">
      <a-space>
        <a-input v-model="form.search.keyword">
          <a-select slot="addonBefore" v-model="form.search.mode" class="w-20">
            <a-select-option value="tag"> 标签 </a-select-option>
            <a-select-option value="type"> 类型 </a-select-option>
          </a-select>
        </a-input>
        <a-button
          type="primary"
          @click="
            form.search.mode === 'type'
              ? $store.dispatch('admin/overview/getCDKByType', form.search)
              : $store.dispatch('admin/overview/getCDKByTag', form.search)
          ">
          搜索
        </a-button>
      </a-space>
      <a-table
        size="small"
        class="mt-4 rounded shadow"
        :scroll="{ x: 580 }"
        :columns="$store.state.admin.overview.table.column"
        :data-source="$store.state.admin.overview.data.cdk"
        :pagination="{
          pageSize: 5
        }">
        <span
          slot="cdk"
          slot-scope="cdk"
          @click="
            $copyText(cdk).then(
              () => $message.success('复制成功'),
              () => $message.error('复制失败')
            )
          ">
          {{ cdk }}
        </span>
        <span slot="used" slot-scope="used">
          <a-tag :color="used ? 'red' : 'green'">
            {{ used ? '已用' : '可用' }}
          </a-tag>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  created() {
    this.$store.dispatch('admin/overview/getStatistic')
    this.$store.dispatch('admin/overview/getNotice').then(() => {
      this.form.notice = this.$copy(this.$store.state.admin.overview.data.notice)
    })
  },
  data() {
    return {
      show: {
        search: false
      },
      form: {
        notice: {
          title: '',
          context: ''
        },
        cdk: {
          tag: 'cdk',
          type: 'daily',
          param: '30',
          count: '1',
          agent: '0',
          isAgent: false
        },
        search: {
          keyword: '',
          mode: 'tag'
        }
      }
    }
  }
}
</script>
