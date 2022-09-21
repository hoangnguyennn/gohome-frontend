<script setup lang="ts">
import { Table, Divider, Modal, Button, Row, PageHeader } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { IWard } from '../../interfaces'
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
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'District',
    dataIndex: 'district',
    key: 'district'
  },
  {
    title: 'Actions',
    key: 'actions'
  }
])

const itemWillDelete = ref<IWard | null>(null)
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
        <router-link :to="getLink(record.id, 'view')">View</router-link>
        <Divider type="vertical" />
        <router-link :to="getLink(record.id, 'edit')">Edit</router-link>
        <Divider type="vertical" />
        <a @click.prevent="onClickDelete(record)">Delete</a>
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
    title="Delete a ward?"
    @ok="onDelete"
  >
    {{ itemWillDelete?.id }}
  </Modal>
</template>
