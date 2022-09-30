<script setup lang="ts">
import {
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Row,
  Col,
  Button,
  PageHeader
} from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'

import { WARD_TYPES } from '~/constants'
import { useWardStore } from '~/store/stores/wardStore'
import { IWard, IWardRequest, Nullable } from '~/interfaces'
import { useDistrictStore } from '~/store/stores/districtStore'
import { storeToRefs } from 'pinia'

interface IFormState {
  name: string
  type: string
  districtId: string
}

const districtStore = useDistrictStore()
const wardStore = useWardStore()
const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const { districts } = storeToRefs(districtStore)

const ward = ref<Nullable<IWard>>(null)

const formState = ref<IFormState>({
  name: '',
  type: '',
  districtId: ''
})

const formRef = ref<FormInstance>()

const onFinish = async (values: IFormState) => {
  await wardStore.updateWardById(id, values as IWardRequest)
  router.push('/wards')
}

const resetForm = () => {
  if (ward.value) {
    setFormState(ward.value)
  }
}

const setFormState = (ward: IWard) => {
  formState.value = {
    name: ward.name,
    type: ward.type,
    districtId: ward.district?.id || ''
  }
}

watch(ward, (newValue: Nullable<IWard>) => {
  if (newValue) {
    setFormState(newValue)
  }
})

onMounted(async () => {
  districtStore.getDistricts()

  try {
    const response = await wardStore.getWardById(id)
    ward.value = response.data.ward
  } catch {
    router.push('/wards')
  }
})
</script>

<template>
  <PageHeader title="Chỉnh sửa xã phường" @back="router.back"></PageHeader>

  <Form
    name="basic"
    ref="formRef"
    :model="formState"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    @finish="onFinish"
  >
    <Row>
      <Col span="12">
        <FormItem
          label="Tên"
          name="name"
          :rules="[{ required: true, message: 'Tên là trường bắt buộc' }]"
        >
          <Input v-model:value="formState.name" />
        </FormItem>
        <FormItem
          label="Loại"
          name="type"
          :rules="[{ required: true, message: 'Loại là trường bắt buộc' }]"
        >
          <Select v-model:value="formState.type">
            <SelectOption
              v-for="wardType of WARD_TYPES"
              :key="wardType.value"
              :value="wardType.value"
            >
              {{ wardType.title }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem
          label="Quận huyện"
          name="districtId"
          :rules="[
            { required: true, message: 'Quận huyện là trường bắt buộc' }
          ]"
        >
          <Select v-model:value="formState.districtId">
            <SelectOption
              v-for="district of districts"
              :key="district.id"
              :value="district.id"
            >
              {{ district.name }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary" html-type="submit">
            Cập nhật xã phường
          </Button>
          <Button style="margin-left: 10px" @click="resetForm">
            Xóa tất cả
          </Button>
        </FormItem>
      </Col>
      <Col span="12"></Col>
    </Row>
  </Form>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Chỉnh sửa xã phường
  requireAuth: true
  permissions: [0, 1]
</route>
