<script lang="ts">
export default {
  name: 'DistrictEditPage'
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

import { DISTRICT_TYPES } from '~/constants'
import { useDistrictStore } from '~/store/stores/districtStore'
import { IDistrict, IDistrictRequest, Nullable } from '~/interfaces'

interface IFormState {
  name: string
  type: string
}

const districtStore = useDistrictStore()
const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const district = ref<Nullable<IDistrict>>(null)

const formState = ref<IFormState>({
  name: '',
  type: ''
})

const formRef = ref<FormInstance>()

const onFinish = async (values: IFormState) => {
  await districtStore.updateDistrictById(id, values as IDistrictRequest)
  router.push('/districts')
}

const resetForm = () => {
  if (district.value) {
    setFormState(district.value)
  }
}

const setFormState = (district: IDistrict) => {
  formState.value = {
    name: district.name,
    type: district.type
  }
}

watch(district, (newValue: Nullable<IDistrict>) => {
  if (newValue) {
    setFormState(newValue)
  }
})

onMounted(async () => {
  try {
    const response = await districtStore.getDistrictById(id)
    district.value = response.data.data
  } catch {
    router.push('/districts')
  }
})
</script>

<template>
  <PageHeader
    title="Chỉnh sửa quận, huyện"
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
              v-for="districtType of DISTRICT_TYPES"
              :key="districtType.value"
              :value="districtType.value"
            >
              {{ districtType.title }}
            </SelectOption>
          </ASelect>
        </FormItem>

        <FormItem>
          <AButton
            type="primary"
            html-type="submit"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            Cập nhật quận huyện
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
  title: Chỉnh sửa quận, huyện
  requireAuth: true
  permissions: [0, 1]
</route>
