<script lang="ts">
export default {
  name: 'PostListPage'
}
</script>

<script setup lang="ts">
import {
  Button as AButton,
  Col,
  Divider,
  Form as AForm,
  FormInstance,
  FormItem,
  Input as AInput,
  Modal,
  PageHeader,
  RangePicker,
  Row,
  Select as ASelect,
  Table as ATable,
  Tag
} from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { storeToRefs } from 'pinia'
import dayjs, { Dayjs } from 'dayjs'
import { LocationQueryRaw } from 'vue-router'
import { POST_VERIFY_STATUSES } from '~/constants'
import useDataListSearch from '~/hooks/useDataListSearch'
import {
  IPost,
  IFormConfirmState,
  Nullable,
  IDataListFilter,
  ISelectOption
} from '~/interfaces'
import { usePostStore } from '~/store/stores/postStore'
import { getPostImageLink, isSearchChanged } from '~/utils/common'
import {
  getPostVerifyStatusColor,
  getPostVerifyStatusText,
  removeUndefined,
  toDateString,
  toDateTimeString,
  toVND
} from '~/utils/formatter'
import { PostVerifyStatuses } from '~/interfaces/enums'

type RangeValue = [Dayjs, Dayjs]

interface IFormSearch {
  code?: Nullable<string>
  title?: Nullable<string>
  createdById?: Nullable<string>
  verifyStatus?: Nullable<string>
  createdAt?: RangeValue
  updatedAt?: RangeValue
  categoryIds?: string[]
  locationIds?: string[]
  ownerPhone?: string
}

interface IFormSearchQuery {
  code?: Nullable<string>
  title?: Nullable<string>
  createdById?: Nullable<string>
  verifyStatus?: Nullable<string>
  createdAtStart?: string
  createdAtEnd?: string
  updatedAtStart?: string
  updatedAtEnd?: string
  categoryIds?: string | string[]
  locationIds?: string | string[]
  ownerPhone?: string
}

interface ISearchOptions extends IFormSearchQuery, IDataListFilter {}

const postStore = usePostStore()
const route = useRoute()
const { posts, users, categories, wards } = storeToRefs(postStore)

const {
  sortBy,
  sortDirection,
  pagination,
  dataListSearchOptions,
  initFromQuery: initDataListSearchFromQuery,
  onChange,
  pushRoute
} = useDataListSearch()

const isLoading = ref(false)

const columns: ColumnType<IPost>[] = [
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
    width: 148,
    maxWidth: 148
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
]

const columnsComputed = computed<ColumnType<IPost>[]>(() => {
  return columns.map((column) => {
    if (column.key === sortBy.value) {
      return {
        ...column,
        sortOrder: sortDirection.value
      } as ColumnType<IPost>
    }

    return column
  })
})

const userOptions = computed<ISelectOption<string>[]>(() => {
  return users.value.map((user) => ({
    value: user.id,
    label: user.fullName ? `${user.fullName} (${user.username})` : user.username
  }))
})

const postVerifyStatuses: ISelectOption<PostVerifyStatuses>[] =
  POST_VERIFY_STATUSES.map(({ value, text }) => ({
    value,
    label: text
  }))

const categoryOptions = computed<ISelectOption<string>[]>(() => {
  return categories.value.map((category) => ({
    value: category.id,
    label: `${category.name} (${category.code})`
  }))
})

const wardOptions = computed<ISelectOption<string>[]>(() => {
  return wards.value.map((ward) => ({
    value: ward.id,
    label: `${ward.name} (${ward.district?.name})`
  }))
})

const dateTimeFields = ref(['createdAt', 'updatedAt'])

const itemDelete = ref<IFormConfirmState<IPost>>({
  value: null,
  isOpen: false
})

const itemMarkAsRead = ref<IFormConfirmState<IPost>>({
  value: null,
  isOpen: false
})

const searchOptions = computed(() => {
  const params: ISearchOptions = { ...dataListSearchOptions.value }
  const query = route.query

  if (query.code) {
    params.code = query.code as string
  }

  if (query.title) {
    params.title = query.title as string
  }

  if (query.createdById) {
    params.createdById = query.createdById as string
  }

  if (query.verifyStatus !== undefined) {
    params.verifyStatus = query.verifyStatus as string
  }

  if (query.createdAtStart) {
    params.createdAtStart = query.createdAtStart as string
  }

  if (query.createdAtEnd) {
    params.createdAtEnd = query.createdAtEnd as string
  }

  if (query.updatedAtStart) {
    params.updatedAtStart = query.updatedAtStart as string
  }

  if (query.updatedAtEnd) {
    params.updatedAtEnd = query.updatedAtEnd as string
  }

  if (query.categoryIds) {
    params.categoryIds = query.categoryIds as string[]
  }

  if (query.locationIds) {
    params.locationIds = query.locationIds as string[]
  }

  if (query.ownerPhone) {
    params.ownerPhone = query.ownerPhone as string
  }

  return params
})

const formSearch = ref<IFormSearch>({
  code: '',
  title: '',
  createdById: '',
  verifyStatus: '',
  createdAt: undefined,
  updatedAt: undefined,
  categoryIds: [],
  locationIds: [],
  ownerPhone: ''
})

const formRef = ref<FormInstance>()

const initFromQuery = () => {
  initDataListSearchFromQuery()

  const {
    code,
    title,
    createdById,
    verifyStatus,
    createdAtStart,
    createdAtEnd,
    updatedAtStart,
    updatedAtEnd,
    categoryIds,
    locationIds,
    ownerPhone
  } = route.query

  let createdAt: any[] = []
  if (createdAtStart && createdAtEnd) {
    createdAt = [
      dayjs(createdAtStart as string, 'DD/MM/YYYY'),
      dayjs(createdAtEnd as string, 'DD/MM/YYYY')
    ]
  }

  let updatedAt: any[] = []
  if (updatedAtStart && updatedAtEnd) {
    updatedAt = [
      dayjs(updatedAtStart as string, 'DD/MM/YYYY'),
      dayjs(updatedAtEnd as string, 'DD/MM/YYYY')
    ]
  }

  let categoryIdsValue = []
  if (typeof categoryIds === 'string') {
    categoryIdsValue = [categoryIds]
  } else {
    categoryIdsValue = categoryIds as string[]
  }

  let locationIdsValue = []
  if (typeof locationIds === 'string') {
    locationIdsValue = [locationIds]
  } else {
    locationIdsValue = locationIds as string[]
  }

  formSearch.value = {
    code: code as string,
    title: title as string,
    createdById: createdById as string,
    verifyStatus: verifyStatus as string,
    createdAt: createdAt as [Dayjs, Dayjs],
    updatedAt: updatedAt as [Dayjs, Dayjs],
    categoryIds: categoryIdsValue,
    locationIds: locationIdsValue,
    ownerPhone: ownerPhone as string
  }
}

const resetFormSearch = () => {
  formRef.value?.resetFields()
  onFinish(formRef.value?.getFieldsValue() as IFormSearch)
}

const getLink = (id: string, action: 'view' | 'edit' | 'delete') => {
  return `/posts/${id}/${action}`
}

const onClickDelete = (item: IPost) => {
  itemDelete.value = {
    value: item,
    isOpen: true
  }
}

const onDelete = async () => {
  itemDelete.value = {
    value: null,
    isOpen: false
  }
}

const onClickMarkAsRead = (item: IPost) => {
  itemMarkAsRead.value = {
    value: item,
    isOpen: true
  }
}

const onMarkAsRead = async () => {
  try {
    isLoading.value = true
    await postStore.markAsRented(itemMarkAsRead.value.value?.id as string)
    await postStore.getPosts()
  } catch {}

  isLoading.value = false
  itemMarkAsRead.value = {
    value: null,
    isOpen: false
  }
}

const onFinish = async (values: IFormSearch) => {
  let createdAtStart: any
  let createdAtEnd: any
  if (values.createdAt?.length === 2) {
    createdAtStart = toDateString(values.createdAt[0])
    createdAtEnd = toDateString(values.createdAt[1])
  }

  let updatedAtStart: any
  let updatedAtEnd: any
  if (values.updatedAt?.length === 2) {
    updatedAtStart = toDateString(values.updatedAt[0])
    updatedAtEnd = toDateString(values.updatedAt[1])
  }

  const query: LocationQueryRaw = {
    ...route.query,
    code: values.code ?? undefined,
    title: values.title ?? undefined,
    createdById: values.createdById ?? undefined,
    verifyStatus: values.verifyStatus ?? undefined,
    createdAtStart: createdAtStart,
    createdAtEnd: createdAtEnd,
    updatedAtStart: updatedAtStart,
    updatedAtEnd: updatedAtEnd,
    categoryIds: values.categoryIds?.length ? values.categoryIds : undefined,
    locationIds: values.locationIds?.length ? values.locationIds : undefined,
    ownerPhone: values.ownerPhone ?? undefined
  }

  if (isSearchChanged(removeUndefined(query), route.query)) {
    query.offset = undefined
  }

  pushRoute(removeUndefined(query))
}

const getPosts = async () => {
  try {
    isLoading.value = true
    await postStore.getPosts(searchOptions.value)
  } finally {
    isLoading.value = false
  }
}

const disabledDate = (current: Dayjs) => {
  return current && current > dayjs().endOf('day')
}

const filterOption = (input: string, option: ISelectOption<string>) => {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

onMounted(() => {
  initFromQuery()
  getPosts()
  postStore.getUsers()
  postStore.getCategories()
  postStore.getWards()
})

onBeforeUnmount(() => {
  postStore.reset()
})

watch(route, () => {
  initDataListSearchFromQuery()
  getPosts()
})
</script>

<template>
  <PageHeader
    title="Danh sách bài đăng"
    back-icon=""
    style="padding-left: 0; padding-right: 0"
  >
    <template #extra>
      <router-link to="/posts/create">
        <AButton type="primary">Thêm bài đăng mới</AButton>
      </router-link>
    </template>
  </PageHeader>

  <Divider />

  <AForm
    name="basic"
    ref="formRef"
    layout="vertical"
    style="margin-bottom: 48px"
    :model="formSearch"
    @finish="onFinish"
  >
    <Row :gutter="24">
      <Col :span="24" :md="12" :xl="6">
        <FormItem label="Mã bài đăng" name="code">
          <AInput v-model:value="formSearch.code" allowClear />
        </FormItem>
      </Col>

      <Col :span="24" :md="12" :xl="6">
        <FormItem label="Tiêu đề" name="title">
          <AInput v-model:value="formSearch.title" allowClear />
        </FormItem>
      </Col>

      <Col :span="24" :md="12" :xl="6">
        <FormItem label="Tạo bởi" name="createdById">
          <ASelect
            v-model:value="formSearch.createdById"
            allowClear
            show-search
            :options="userOptions"
            :filterOption="filterOption"
          >
          </ASelect>
        </FormItem>
      </Col>

      <Col :span="24" :md="12" :xl="6">
        <FormItem label="Tình trạng duyệt" name="verifyStatus">
          <ASelect
            v-model:value="formSearch.verifyStatus"
            allowClear
            show-search
            :options="postVerifyStatuses"
            :filterOption="filterOption"
          />
        </FormItem>
      </Col>

      <Col :span="24" :md="12" :xl="6">
        <FormItem label="Ngày tạo" name="createdAt">
          <RangePicker
            allow-clear
            style="width: 100%"
            format="DD/MM/YYYY"
            v-model:value="formSearch.createdAt"
            :placeholder="['Ngày bắt đầu', 'Ngày kết thúc']"
            :disabled-date="disabledDate"
          />
        </FormItem>
      </Col>

      <Col :span="24" :md="12" :xl="6">
        <FormItem label="Ngày cập nhật" name="updatedAt">
          <RangePicker
            allowClear
            style="width: 100%"
            format="DD/MM/YYYY"
            v-model:value="formSearch.updatedAt"
            :placeholder="['Ngày bắt đầu', 'Ngày kết thúc']"
            :disabledDate="disabledDate"
          />
        </FormItem>
      </Col>

      <Col :span="24" :md="12" :xl="6">
        <FormItem label="Loại nhà đất" name="categoryIds">
          <ASelect
            v-model:value="formSearch.categoryIds"
            allowClear
            mode="multiple"
            max-tag-count="responsive"
            showSearch
            :options="categoryOptions"
            :filter-option="filterOption"
          />
        </FormItem>
      </Col>

      <Col :span="24" :md="12" :xl="6">
        <FormItem label="Khu vực" name="locationIds">
          <ASelect
            v-model:value="formSearch.locationIds"
            allowClear
            mode="multiple"
            max-tag-count="responsive"
            showSearch
            :options="wardOptions"
            :filter-option="filterOption"
          />
        </FormItem>
      </Col>

      <Col :span="24" :md="12" :xl="6">
        <FormItem label="Số điện thoại chủ nhà" name="ownerPhone">
          <AInput v-model:value="formSearch.ownerPhone" allowClear />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="24">
        <AButton
          type="primary"
          html-type="submit"
          style="margin-right: 10px; margin-bottom: 10px"
        >
          Tìm kiếm
        </AButton>
        <AButton @click="resetFormSearch">Xóa bộ lọc</AButton>
      </Col>
    </Row>
  </AForm>

  <Divider />

  <div class="responsive-wrapper">
    <ATable
      :columns="columnsComputed"
      :data-source="posts"
      :loading="isLoading"
      :pagination="pagination"
      @change="onChange"
    >
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
          <Divider type="vertical" />
          <a @click.prevent="onClickMarkAsRead(record)">Đánh dấu đã thuê</a>
        </Row>

        <template v-else-if="column.key === 'images'">
          <img
            v-if="record.images.length"
            :src="getPostImageLink(record.images[0].url)"
            alt=""
          />
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
            {{ toDateTimeString(new Date(record[column.key])) }}
          </template>
        </template>
      </template>
    </ATable>
  </div>

  <Modal
    v-model:visible="itemDelete.isOpen"
    title="Xóa bài đăng?"
    @ok="onDelete"
  >
    Bạn có muốn xóa bài đăng "{{ itemDelete.value?.title }}"?
  </Modal>

  <Modal
    v-model:visible="itemMarkAsRead.isOpen"
    title="Đánh dấu đã thuê?"
    @ok="onMarkAsRead"
  >
    Bạn có muốn đánh dấu bài đăng "{{ itemMarkAsRead.value?.title }}" đã thuê?
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách bài đăng
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
