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
    ward.value = response.data.data
  } catch {
    router.push('/wards')
  }
})
</script>

<template>
  <PageHeader title="Chỉnh sửa xã phường" @back="router.back"></PageHeader>

  <AForm
    name="basic"
    ref="formRef"
    v-bind="$attrs"
    :model="formState"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    @finish="onFinish"
  >
    <Row>
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

        <FormItem :wrapper-col="{ span: 24, xl: { offset: 8, span: 16 } }">
          <AButton
            type="primary"
            html-type="submit"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            Cập nhật xã phường
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
  title: Chỉnh sửa xã phường
  requireAuth: true
  permissions: [0, 1]
</route>
