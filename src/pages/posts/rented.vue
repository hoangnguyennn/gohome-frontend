<script setup lang="ts">
import {
  Table,
  Divider,
  Modal,
  Button,
  Row,
  PageHeader,
  Tag
} from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { storeToRefs } from 'pinia'
import { IPost, IFormConfirmState } from '~/interfaces'
import { usePostStore } from '~/store/stores/postStore'
import {
  getPostVerifyStatusColor,
  getPostVerifyStatusText,
  toDateTime,
  toVND
} from '~/utils/formatter'

const postStore = usePostStore()
const { rentedPosts } = storeToRefs(postStore)

const columns = ref<ColumnType<IPost>[]>([
  {
    title: '#',
    dataIndex: 'code',
    key: 'code',
    width: 148,
    maxWidth: 148,
    sorter: {
      compare: (a, b) => {
        if (a.code > b.code) {
          return 1
        } else if (a.code < b.code) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'images',
    key: 'images',
    width: 124,
    maxWidth: 124
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
    key: 'title',
    width: 224,
    maxWidth: 224,
    sorter: {
      compare: (a, b) => {
        if (a.title > b.title) {
          return 1
        } else if (a.title < b.title) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Tạo bởi',
    dataIndex: 'createdBy',
    key: 'createdBy',
    width: 120,
    maxWidth: 120,
    sorter: {
      compare: (a, b) => {
        const aCreatedBy = a.createdBy?.fullName || a.createdBy?.username || ''
        const bCreatedBy = b.createdBy?.fullName || b.createdBy?.username || ''
        if (aCreatedBy > bCreatedBy) {
          return 1
        } else if (aCreatedBy < bCreatedBy) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Hoa hồng',
    dataIndex: 'commission',
    key: 'commission',
    width: 148,
    maxWidth: 148,
    sorter: {
      compare: (a, b) => {
        if (a.commission > b.commission) {
          return 1
        } else if (a.commission < b.commission) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Tình trạng duyệt',
    dataIndex: 'verifyStatus',
    key: 'verifyStatus',
    width: 150,
    maxWidth: 150,
    sorter: {
      compare: (a, b) => {
        if (a.verifyStatus > b.verifyStatus) {
          return 1
        } else if (a.verifyStatus < b.verifyStatus) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Lý do từ chối',
    dataIndex: 'denyReason',
    key: 'denyReason',
    width: 130,
    maxWidth: 130
  },
  {
    title: 'Ẩn/Hiện',
    dataIndex: 'isHide',
    key: 'isHide',
    width: 148,
    maxWidth: 148,
    sorter: {
      compare: (a, b) => {
        if (a.isHide > b.isHide) {
          return 1
        } else if (a.isHide < b.isHide) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 148,
    maxWidth: 148,
    sorter: {
      compare: (a, b) => {
        if (new Date(a.createdAt) > new Date(b.createdAt)) {
          return 1
        } else if (new Date(a.createdAt) < new Date(b.createdAt)) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Ngày cập nhật',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 148,
    maxWidth: 148,
    sorter: {
      compare: (a, b) => {
        if (new Date(a.updatedAt) > new Date(b.updatedAt)) {
          return 1
        } else if (new Date(a.updatedAt) < new Date(b.updatedAt)) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Hành động',
    key: 'actions'
  }
])

const dateTimeFields = ref(['createdAt', 'updatedAt'])

const itemDelete = ref<IFormConfirmState<IPost>>({
  value: null,
  isOpen: false
})

const isLoading = ref(false)

const getLink = (id: string, action: 'view' | 'edit' | 'delete') => {
  return `/posts/${id}/${action}`
}

const onClickDelete = (item: IPost) => {
  itemDelete.value = {
    value: item,
    isOpen: true
  }
}

const onDelete = () => {
  console.log('delete')
  itemDelete.value = {
    value: null,
    isOpen: false
  }
}

const getRentedPosts = async () => {
  try {
    isLoading.value = true
    await postStore.getRentedPosts()
  } finally {
    isLoading.value = false
  }
}

onMounted(() => getRentedPosts())
</script>

<template>
  <PageHeader
    title="Danh sách bài đăng (đã thuê)"
    back-icon=""
    style="padding-left: 0; padding-right: 0"
  >
    <template #extra>
      <router-link to="/posts/create">
        <Button type="primary">Thêm bài đăng mới</Button>
      </router-link>
    </template>
  </PageHeader>

  <div class="responsive-wrapper">
    <Table :columns="columns" :data-source="rentedPosts" :loading="isLoading">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'verifyStatus'">
          <span class="line">Tình trạng</span>{{ ' ' }}
          <span class="line">duyệt</span>
        </template>
        <template v-if="column.key === 'updatedAt'">
          <span class="line">Ngày</span>{{ ' ' }}
          <span class="line">cập nhật</span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <Row v-if="column.key === 'actions'">
          <router-link :to="getLink(record.id, 'view')">Xem</router-link>
          <Divider type="vertical" />
          <router-link :to="getLink(record.id, 'edit')">Sửa</router-link>
          <Divider type="vertical" />
          <a @click.prevent="onClickDelete(record)">Xóa</a>
        </Row>

        <template v-else-if="column.key === 'images'">
          <img v-if="record.images.length" :src="record.images[0].url" alt="" />
        </template>

        <template v-else-if="column.key === 'createdBy'">
          <router-link :to="`/users/${record.createdBy.id}/view`">
            {{ record.createdBy.fullName || record.createdBy.username }}
          </router-link>
        </template>

        <template v-else-if="column.key === 'commission'">
          <div style="text-align: right">{{ toVND(record.commission) }}</div>
        </template>

        <template v-else-if="column.key === 'verifyStatus'">
          <div style="text-align: center">
            <Tag :color="getPostVerifyStatusColor(record.verifyStatus)">
              {{ getPostVerifyStatusText(record.verifyStatus) }}
            </Tag>
          </div>
        </template>

        <template v-else-if="column.key === 'isHide'">
          <div style="text-align: center">
            <Tag v-if="record.isHide" color="default">Ẩn</Tag>
            <Tag v-else color="green">Hiện</Tag>
          </div>
        </template>

        <template v-else-if="dateTimeFields.includes(column.key)">
          <template v-if="record[column.key]">
            {{ toDateTime(new Date(record[column.key])) }}
          </template>
        </template>
      </template>
    </Table>
  </div>

  <Modal
    v-model:visible="itemDelete.isOpen"
    title="Xóa bài đăng?"
    @ok="onDelete"
  >
    Bạn có muốn xóa bài đăng "{{ itemDelete.value?.title }}"?
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách bài đăng (đã thuê)
  requireAuth: true
  permissions: [0, 1, 2]
</route>

<style lang="scss">
.responsive-wrapper {
  overflow: auto;

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 12px;
  }

  img {
    max-height: 100px;
    width: 100px;
    object-fit: contain;
  }
}

.line {
  display: inline-block;
}
</style>
