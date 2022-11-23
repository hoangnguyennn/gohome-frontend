<script lang="ts">
export default {
  name: 'WardCreationPage'
}
</script>

<script setup lang="ts">
import {
  Form as AForm,
  FormItem,
  Input as AInput,
  Select as ASelect,
  SelectOption,
  Row,
  Col,
  Button as AButton,
  PageHeader
} from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'

import { WARD_TYPES } from '~/constants'
import { useWardStore } from '~/store/stores/wardStore'
import { IWardRequest } from '~/interfaces'
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

const { districts } = storeToRefs(districtStore)

const formState = ref<IFormState>({
  name: '',
  type: '',
  districtId: ''
})

const formRef = ref<FormInstance>()

const onFinish = async (values: IFormState) => {
  await wardStore.createWard(values as IWardRequest)
  router.push('/wards')
}

const resetForm = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  districtStore.getDistricts()
})
</script>

<template>
  <PageHeader
    title="Thêm xã phường mới"
    style="padding-left: 0; padding-right: 0"
    @back="router.back"
  />

  <AForm
    name="basic"
    ref="formRef"
    layout="vertical"
    v-bind="$attrs"
    :colon="false"
    :model="formState"
    @finish="onFinish"
  >
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem
          label="Tên"
          name="name"
          :rules="[{ required: true, message: 'Tên là trường bắt buộc' }]"
        >
          <AInput v-model:value="formState.name" />
        </FormItem>

        <FormItem
          label="Loại"
          name="type"
          :rules="[{ required: true, message: 'Loại là trường bắt buộc' }]"
        >
          <ASelect v-model:value="formState.type">
            <SelectOption
              v-for="wardType of WARD_TYPES"
              :key="wardType.value"
              :value="wardType.value"
            >
              {{ wardType.title }}
            </SelectOption>
          </ASelect>
        </FormItem>

        <FormItem
          label="Quận huyện"
          name="districtId"
          :rules="[
            { required: true, message: 'Quận huyện là trường bắt buộc' }
          ]"
        >
          <ASelect v-model:value="formState.districtId">
            <SelectOption
              v-for="district of districts"
              :key="district.id"
              :value="district.id"
            >
              {{ district.name }}
            </SelectOption>
          </ASelect>
        </FormItem>

        <FormItem>
          <AButton
            type="primary"
            html-type="submit"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            Tạo loại nhà đất
          </AButton>
          <AButton @click="resetForm">Xóa tất cả</AButton>
        </FormItem>
      </Col>
    </Row>
  </AForm>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Thêm xã phường mới
  requireAuth: true
  permissions: [0, 1]
</route>
