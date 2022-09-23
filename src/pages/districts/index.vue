<script setup lang="ts">
import { Table, Divider, Modal, Button, Row, PageHeader } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { IDistrict, Nullable } from '~/interfaces'
import { useDistrictStore } from '~/store/stores/districtStore'

const districtStore = useDistrictStore()
const { districts } = storeToRefs(districtStore)

const columns = ref([
  {
    title: '#',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Loại',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'Hành động',
    key: 'actions'
  }
])

const itemWillDelete = ref<Nullable<IDistrict>>(null)
const isOpenConfirmDeleteDistrict = ref(false)

const getLink = (id: string, action: 'view' | 'edit' | 'delete') => {
  return `/districts/${id}/${action}`
}

const onClickDelete = (item: IDistrict) => {
  itemWillDelete.value = item
  isOpenConfirmDeleteDistrict.value = true
}

const onDelete = () => {
  console.log('delete')
  isOpenConfirmDeleteDistrict.value = false
}

onMounted(() => {
  districtStore.getDistricts()
})
</script>

<template>
  <PageHeader
    title="Quận huyện"
    back-icon=""
    style="padding-left: 0; padding-right: 0"
  >
    <template #extra>
      <router-link to="/districts/create">
        <Button type="primary">Thêm quận, huyện mới</Button>
      </router-link>
    </template>
  </PageHeader>

  <Table :columns="columns" :data-source="districts">
    <template #bodyCell="{ column, record }">
      <Row v-if="column.key === 'actions'">
        <router-link :to="getLink(record.id, 'view')">Xem</router-link>
        <Divider type="vertical" />
        <router-link :to="getLink(record.id, 'edit')">Sửa</router-link>
        <Divider type="vertical" />
        <a @click.prevent="onClickDelete(record)">Xóa</a>
      </Row>
    </template>
  </Table>

  <Modal
    v-model:visible="isOpenConfirmDeleteDistrict"
    title="Xóa quận huyện?"
    @ok="onDelete"
  >
    Bạn có chắc chắn muốn xóa quận huyện "{{ itemWillDelete?.name }}"?
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách quận huyện
</route>
