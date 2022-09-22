<script setup lang="ts">
import { Table, Divider, Modal, Button, Row, PageHeader } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { IWard, Nullable } from '../../interfaces'
import { useWardStore } from '../../store/stores/wardStore'

const wardStore = useWardStore()
const { wards } = storeToRefs(wardStore)

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
    title: 'Quận huyện',
    dataIndex: 'district',
    key: 'district'
  },
  {
    title: 'Hành động',
    key: 'actions'
  }
])

const itemWillDelete = ref<Nullable<IWard>>(null)
const isOpenConfirmDeleteWard = ref(false)

const getLink = (id: string, action: 'view' | 'edit' | 'delete') => {
  return `/wards/${id}/${action}`
}

const onClickDelete = (item: IWard) => {
  itemWillDelete.value = item
  isOpenConfirmDeleteWard.value = true
}

const onDelete = () => {
  console.log('delete')
  isOpenConfirmDeleteWard.value = false
}

onMounted(() => {
  wardStore.getWards()
})
</script>

<template>
  <PageHeader
    title="Xã phường"
    back-icon=""
    style="padding-left: 0; padding-right: 0"
  >
    <template #extra>
      <router-link to="/wards/create">
        <Button type="primary">Thêm xã phường mới</Button>
      </router-link>
    </template>
  </PageHeader>

  <Table :columns="columns" :data-source="wards">
    <template #bodyCell="{ column, record }">
      <Row v-if="column.key === 'actions'">
        <router-link :to="getLink(record.id, 'view')">Xem</router-link>
        <Divider type="vertical" />
        <router-link :to="getLink(record.id, 'edit')">Sửa</router-link>
        <Divider type="vertical" />
        <a @click.prevent="onClickDelete(record)">Xóa</a>
      </Row>
      <template v-else-if="column.key === 'district'">
        <router-link :to="`/districts/${record.district.id}/view`">
          {{ record.district.name }}
        </router-link>
      </template>
    </template>
  </Table>

  <Modal
    v-model:visible="isOpenConfirmDeleteWard"
    title="Xóa xã phường?"
    @ok="onDelete"
  >
    Bạn có chắc chắn muốn xóa xã phường "{{ itemWillDelete?.name }}"?
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách xã phường
</route>
