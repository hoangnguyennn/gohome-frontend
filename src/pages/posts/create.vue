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
  Divider,
  UploadFile
} from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { storeToRefs } from 'pinia'

import { useDistrictStore } from '../../store/stores/districtStore'
import { useCategoryStore } from '../../store/stores/categoryStore'
import { toVndPrefix, toRawNumber, toAcreage } from '../../utils/formatter'
import ImageUploader from '../../components/ImageUploader.vue'
import { IPostCreate } from '../../interfaces'
import { usePostStore } from '../../store/stores/postStore'

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
  images: UploadFile[]
}

const categoryStore = useCategoryStore()
const districtStore = useDistrictStore()
const postStore = usePostStore()
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
  images: []
})

const formRef = ref<FormInstance>()

const onFinish = async (values: IFormState) => {
  const post: IPostCreate = {
    title: values.title,
    categoryId: values.categoryId,
    wardId: values.wardId,
    price: values.price,
    commission: values.commission,
    acreage: values.acreage,
    bedroom: values.bedroom,
    bathroom: values.bathroom,
    floor: values.floor,
    description: values.description,
    ownerName: values.ownerName,
    ownerPhone: values.ownerPhone,
    ownerAddress: values.ownerAddress,
    isCheap: values.isCheap,
    isFeatured: values.isFeatured,
    imagesId: values.images.map((image) => image.response?.image.id)
  }

  await postStore.createPost(post)
  router.push('/posts')
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
          label="Tiêu đề"
          name="title"
          :rules="[{ required: true, message: 'Tiêu đề là trường bắt buộc' }]"
        >
          <Input v-model:value="formState.title" />
        </FormItem>

        <FormItem
          label="Loại"
          name="categoryId"
          :rules="[{ required: true, message: 'Loại là trường bắt buộc' }]"
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

        <FormItem
          label="Xã phường"
          name="wardId"
          :rules="[{ required: true, message: 'Xã phường là trường bắt buộc' }]"
        >
          <Select v-model:value="formState.wardId">
            <SelectOption v-for="ward of wards" :key="ward.id" :value="ward.id">
              {{ ward.name }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem
          label="Giá (VND)"
          name="price"
          :rules="[{ required: true, message: 'Giá (VND) là trường bắt buộc' }]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.price"
            :formatter="(value) => toVndPrefix(value)"
            :parser="(value) => toRawNumber(value)"
            :min="0"
          />
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem
          label="Hoa hồng (VND)"
          name="commission"
          :rules="[
            { required: true, message: 'Hoa hồng (VND) là trường bắt buộc' }
          ]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.commission"
            :formatter="(value) => toVndPrefix(value)"
            :parser="(value) => toRawNumber(value)"
            :min="0"
          />
        </FormItem>

        <FormItem
          label="Diện tích (m²)"
          name="acreage"
          :rules="[
            { required: true, message: 'Diện tích (m²) là trường bắt buộc' }
          ]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.acreage"
            :formatter="(value) => toAcreage(value)"
            :parser="(value) => toRawNumber(value)"
            :min="0"
          />
        </FormItem>

        <FormItem
          label="Số phòng ngủ"
          name="bedroom"
          :rules="[
            { required: true, message: 'Số phòng ngủ là trường bắt buộc' }
          ]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.bedroom"
            :min="0"
          />
        </FormItem>

        <FormItem
          label="Số phòng tắm"
          name="bathroom"
          :rules="[
            { required: true, message: 'Số phòng tắm là trường bắt buộc' }
          ]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.bathroom"
            :min="0"
          />
        </FormItem>

        <FormItem
          label="Số tầng"
          name="floor"
          :rules="[{ required: true, message: 'Số tầng là trường bắt buộc' }]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.floor"
            :min="0"
          />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Mô tả</h3>
    <Row>
      <Col span="24">
        <FormItem
          label="Mô tả"
          name="description"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          :rules="[{ required: true, message: 'Mô tả là trường bắt buộc' }]"
        >
          <Textarea v-model:value="formState.description" :rows="4" />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Hình ảnh</h3>
    <Row>
      <Col span="24">
        <FormItem
          label="Hình ảnh"
          name="images"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <ImageUploader v-model:value="formState.images" />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Thông tin chủ hộ</h3>
    <Row>
      <Col span="12">
        <FormItem
          label="Tên chủ hộ"
          name="ownerName"
          :rules="[
            { required: true, message: 'Tên chủ hộ là trường bắt buộc' }
          ]"
        >
          <Input v-model:value="formState.ownerName" />
        </FormItem>

        <FormItem
          label="Địa chỉ chủ hộ"
          name="ownerAddress"
          :rules="[
            { required: true, message: 'Địa chỉ chủ hộ là trường bắt buộc' }
          ]"
        >
          <Input v-model:value="formState.ownerAddress" />
        </FormItem>
      </Col>

      <Col span="12">
        <FormItem
          label="Số điện thoại chủ hộ"
          name="ownerPhone"
          :rules="[
            {
              required: true,
              message: 'Số điện thoại chủ hộ là trường bắt buộc'
            }
          ]"
        >
          <Input v-model:value="formState.ownerPhone" />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <Row>
      <Col span="12">
        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary" html-type="submit">Tạo bài đăng</Button>
          <Button style="margin-left: 10px" @click="resetForm">
            Xóa tất cả
          </Button>
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
