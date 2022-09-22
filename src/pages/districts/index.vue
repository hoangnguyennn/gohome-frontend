<script setup lang="ts">
import { Table, Divider, Modal, Button, Row, PageHeader } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { IDistrict, Nullable } from '../../interfaces'
import { useDistrictStore } from '../../store/stores/districtStore'

const districtStore = useDistrictStore()
const { districts } = storeToRefs(districtStore)

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
    title: 'Actions',
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
        <router-link :to="getLink(record.id, 'view')">View</router-link>
        <Divider type="vertical" />
        <router-link :to="getLink(record.id, 'edit')">Edit</router-link>
        <Divider type="vertical" />
        <a @click.prevent="onClickDelete(record)">Delete</a>
      </Row>
    </template>
  </Table>

  <Modal
    v-model:visible="isOpenConfirmDeleteDistrict"
    title="Delete the district?"
    @ok="onDelete"
  >
    {{ itemWillDelete?.id }}
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách quận huyện
</route>
