<script setup lang="ts">
import {
  Form,
  FormItem,
  Input,
  Textarea,
  InputNumber,
  Select,
  SelectOption,
  Row,
  Col,
  Button,
  PageHeader,
  Divider
} from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { storeToRefs } from 'pinia'

import { useDistrictStore } from '../../store/stores/districtStore'
import { useCategoryStore } from '../../store/stores/categoryStore'
import { toVndPrefix, toRawNumber } from '../../utils/formatter'

interface IFormState {
  title: string
  categoryId: string
  districtId: string
  wardId: string
  price: number
  commission: number
  acreage: number
  bedroom: number
  bathroom: number
  floor: number
  description: string
  ownerName: string
  ownerPhone: string
  ownerAddress: string
  isCheap: boolean
  isFeatured: boolean
  imagesId: string[]
}

const categoryStore = useCategoryStore()
const districtStore = useDistrictStore()
const router = useRouter()

const { categories } = storeToRefs(categoryStore)
const { districts, wards } = storeToRefs(districtStore)

const formState = ref<IFormState>({
  title: '',
  categoryId: '',
  districtId: '',
  wardId: '',
  price: 0,
  commission: 0,
  acreage: 0,
  bedroom: 0,
  bathroom: 0,
  floor: 0,
  description: '',
  ownerName: '',
  ownerPhone: '',
  ownerAddress: '',
  isCheap: false,
  isFeatured: false,
  imagesId: []
})

const formRef = ref<FormInstance>()

const onFinish = async (values: IFormState) => {
  // await wardStore.createWard(values as IWardCreate)
  // router.push('/wards')
}

const resetForm = () => {
  formRef.value?.resetFields()
}

watch(
  () => formState.value.districtId,
  (newValue: string) => {
    formState.value.wardId = ''
    districtStore.getWardsByDistrictId(newValue)
  }
)

onMounted(() => {
  categoryStore.getCategories()
  districtStore.getDistricts()
})
</script>

<template>
  <PageHeader title="Thêm bài đăng mới" @back="router.back"></PageHeader>

  <Form
    name="basic"
    ref="formRef"
    :model="formState"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    @finish="onFinish"
  >
    <h3 class="section-title">Thông tin cơ bản</h3>
    <Row>
      <Col span="12">
        <FormItem
          label="Title"
          name="title"
          :rules="[{ required: true, message: 'Title is required' }]"
        >
          <Input v-model:value="formState.title" />
        </FormItem>

        <FormItem
          label="Category"
          name="categoryId"
          :rules="[{ required: true, message: 'Category is required' }]"
        >
          <Select v-model:value="formState.categoryId">
            <SelectOption
              v-for="category of categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem
          label="District"
          name="districtId"
          :rules="[{ required: true, message: 'District is required' }]"
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

        <FormItem
          label="Ward"
          name="wardId"
          :rules="[{ required: true, message: 'Ward is required' }]"
        >
          <Select v-model:value="formState.wardId">
            <SelectOption v-for="ward of wards" :key="ward.id" :value="ward.id">
              {{ ward.name }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem
          label="Price"
          name="price"
          :rules="[{ required: true, message: 'Price is required' }]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.price"
            :formatter="(value) => toVndPrefix(value)"
            :parser="(value) => toRawNumber(value)"
          />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem
          label="commission"
          name="commission"
          :rules="[{ required: true, message: 'commission is required' }]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.commission"
            :formatter="(value) => toVndPrefix(value)"
            :parser="(value) => toRawNumber(value)"
          />
        </FormItem>

        <FormItem
          label="acreage"
          name="acreage"
          :rules="[{ required: true, message: 'acreage is required' }]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.acreage"
            :formatter="(value) => toVndPrefix(value)"
            :parser="(value) => toRawNumber(value)"
          />
        </FormItem>

        <FormItem
          label="bedroom"
          name="bedroom"
          :rules="[{ required: true, message: 'bedroom is required' }]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.bedroom"
            :formatter="(value) => toVndPrefix(value)"
            :parser="(value) => toRawNumber(value)"
          />
        </FormItem>

        <FormItem
          label="bathroom"
          name="bathroom"
          :rules="[{ required: true, message: 'bathroom is required' }]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.bathroom"
            :formatter="(value) => toVndPrefix(value)"
            :parser="(value) => toRawNumber(value)"
          />
        </FormItem>

        <FormItem
          label="floor"
          name="floor"
          :rules="[{ required: true, message: 'floor is required' }]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.floor"
            :formatter="(value) => toVndPrefix(value)"
            :parser="(value) => toRawNumber(value)"
          />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Mô tả</h3>
    <Row>
      <Col span="24">
        <FormItem
          label="description"
          name="description"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          :rules="[{ required: true, message: 'description is required' }]"
        >
          <Textarea v-model:value="formState.description" :rows="4" />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Hình ảnh</h3>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Thông tin chủ hộ</h3>
    <Row>
      <Col span="12">
        <FormItem
          label="ownerName"
          name="ownerName"
          :rules="[{ required: true, message: 'ownerName is required' }]"
        >
          <Input v-model:value="formState.ownerName" />
        </FormItem>

        <FormItem
          label="ownerAddress"
          name="ownerAddress"
          :rules="[{ required: true, message: 'ownerAddress is required' }]"
        >
          <Input v-model:value="formState.ownerAddress" />
        </FormItem>
      </Col>

      <Col span="12">
        <FormItem
          label="ownerPhone"
          name="ownerPhone"
          :rules="[{ required: true, message: 'ownerPhone is required' }]"
        >
          <Input v-model:value="formState.ownerPhone" />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <Row>
      <Col span="12">
        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary" html-type="submit">Submit</Button>
          <Button style="margin-left: 10px" @click="resetForm">Reset</Button>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Thêm bài đăng mới
</route>

<style scoped lang="scss">
.section-title {
  padding: 16px 24px;
  font-weight: bold;
}
</style>
