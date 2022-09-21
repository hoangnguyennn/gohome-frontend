<script setup lang="ts">
import { Table, Divider, Modal, Button, Row, Col } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { IDistrict } from '../../interfaces'
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

const itemWillDelete = ref<IDistrict | null>(null)
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
  <Row justify="space-between" align="middle" style="margin-bottom: 50px">
    <h2 style="margin: 0">Quận huyện</h2>
    <router-link to="/districts/create">
      <Button type="primary">Thêm quận, huyện mới</Button>
    </router-link>
  </Row>

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
    title="Delete a district?"
    @ok="onDelete"
  >
    {{ itemWillDelete?.id }}
  </Modal>
</template>
