<script setup lang="ts">
import {
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Row,
  Col,
  Button
} from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'

import { DISTRICT_TYPES } from '../../constants'
import { useDistrictStore } from '../../store/stores/districtStore'
import { IDistrictCreate } from '../../interfaces'

interface IFormState {
  name: string
  type: string
}

const districtStore = useDistrictStore()
const router = useRouter()

const formState = ref<IFormState>({
  name: '',
  type: ''
})

const formRef = ref<FormInstance>()

const onFinish = async (values: IFormState) => {
  await districtStore.createDistrict(values as IDistrictCreate)
  router.push('/districts')
}

const resetForm = () => {
  formRef.value?.resetFields()
}
</script>

<template>
  <Row justify="space-between" align="middle" style="margin-bottom: 50px">
    <h2 style="margin: 0">Thêm quận, huyện mới</h2>
  </Row>

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
          label="Name"
          name="name"
          :rules="[{ required: true, message: 'Name is required' }]"
        >
          <Input v-model:value="formState.name" />
        </FormItem>
        <FormItem
          label="Type"
          name="type"
          :rules="[{ required: true, message: 'Type is required' }]"
        >
          <Select v-model:value="formState.type">
            <SelectOption
              v-for="districtType of DISTRICT_TYPES"
              :key="districtType.value"
              :value="districtType.value"
            >
              {{ districtType.title }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary" html-type="submit">Submit</Button>
          <Button style="margin-left: 10px" @click="resetForm">Reset</Button>
        </FormItem>
      </Col>
      <Col span="12"></Col>
    </Row>
  </Form>
</template>
