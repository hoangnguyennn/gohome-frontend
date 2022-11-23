<script setup lang="ts">
import {
  Form as AForm,
  FormItem,
  Input as AInput,
  Textarea as ATextarea,
  InputNumber,
  Select as ASelect,
  SelectOption,
  Checkbox,
  Row,
  Col,
  Button as AButton,
  PageHeader,
  Divider,
  UploadFile
} from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { storeToRefs } from 'pinia'

import { IImage, IPost, IPostCreate, Nullable } from '~/interfaces'
import { isIImage } from '~/utils/common'
import { toVndPrefix, toRawNumber, toAcreage } from '~/utils/formatter'
import { useCategoryStore } from '~/store/stores/categoryStore'
import { useDistrictStore } from '~/store/stores/districtStore'
import { usePostStore } from '~/store/stores/postStore'
import ImageUploader from '~/components/ImageUploader.vue'

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
  isRented: boolean
  isHide: boolean
  images: (UploadFile | IImage)[]
}

const categoryStore = useCategoryStore()
const districtStore = useDistrictStore()
const postStore = usePostStore()
const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const { categories } = storeToRefs(categoryStore)
const { districts, wards } = storeToRefs(districtStore)

const post = ref<Nullable<IPost>>(null)

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
  isRented: false,
  isHide: false,
  images: []
})

const formRef = ref<FormInstance>()

const onFinish = async (values: IFormState) => {
  const post: IPostCreate = {
    ...values,
    imagesId: values.images.map((image) => {
      if (isIImage(image)) {
        return image.id
      } else {
        return image.response?.image.id || image.uid
      }
    })
  }

  await postStore.updatePost(id, post)
  router.push('/posts')
}

const resetForm = () => {
  if (post.value) {
    setFormState(post.value)
  }
}

const setFormState = (post: IPost) => {
  formState.value = {
    title: post.title,
    categoryId: post.category?.id || '',
    districtId: post.ward?.district?.id || '',
    wardId: post.ward?.id || '',
    price: post.price,
    commission: post.commission,
    acreage: post.acreage,
    bedroom: post.bedroom,
    bathroom: post.bathroom,
    floor: post.floor,
    description: post.description,
    ownerName: post.ownerName,
    ownerPhone: post.ownerPhone,
    ownerAddress: post.ownerAddress,
    isCheap: post.isCheap,
    isFeatured: post.isFeatured,
    isRented: post.isRented,
    isHide: post.isHide,
    images: post.images || []
  }
}

watch(
  () => formState.value.districtId,
  (newDistrictId: string) => {
    if (post.value?.ward?.district?.id === newDistrictId) {
      formState.value.wardId = post.value.ward.id
    } else {
      formState.value.wardId = ''
    }

    if (newDistrictId) {
      districtStore.getWardsByDistrictId(newDistrictId)
    }
  }
)

watch(post, (newPost: Nullable<IPost>) => {
  if (newPost) {
    setFormState(newPost)
  }
})

onMounted(async () => {
  try {
    const response = await postStore.getPost(id)
    post.value = response.data.data
  } catch {
    router.push('/posts')
  }

  await categoryStore.getCategories()
  await districtStore.getDistricts()
})
</script>

<template>
  <PageHeader
    title="Chỉnh sửa bài đăng"
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
    <h3 class="section-title">Thông tin cơ bản</h3>
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem
          label="Tiêu đề"
          name="title"
          :rules="[{ required: true, message: 'Tiêu đề là trường bắt buộc' }]"
        >
          <AInput v-model:value="formState.title" />
        </FormItem>

        <FormItem
          label="Loại"
          name="categoryId"
          :rules="[{ required: true, message: 'Loại là trường bắt buộc' }]"
        >
          <ASelect v-model:value="formState.categoryId">
            <SelectOption
              v-for="category of categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
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

        <FormItem
          label="Xã phường"
          name="wardId"
          :rules="[{ required: true, message: 'Xã phường là trường bắt buộc' }]"
        >
          <ASelect v-model:value="formState.wardId">
            <SelectOption v-for="ward of wards" :key="ward.id" :value="ward.id">
              {{ ward.name }}
            </SelectOption>
          </ASelect>
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
      <Col :span="24" :xl="12">
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
    <Row :gutter="24">
      <Col :span="24">
        <FormItem
          label="Mô tả"
          name="description"
          :rules="[{ required: true, message: 'Mô tả là trường bắt buộc' }]"
        >
          <ATextarea v-model:value="formState.description" :rows="12" />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Hình ảnh</h3>
    <Row :gutter="24">
      <Col :span="24">
        <FormItem label="Hình ảnh" name="images">
          <ImageUploader v-model:value="formState.images" />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title"></h3>
    <Row :gutter="24">
      <Col :span="24" :xl="6">
        <FormItem label="Nổi bật" name="isFeatured">
          <Checkbox v-model:checked="formState.isFeatured" />
        </FormItem>
      </Col>

      <Col :span="24" :xl="6">
        <FormItem label="Giá rẻ" name="isCheap">
          <Checkbox v-model:checked="formState.isCheap" />
        </FormItem>
      </Col>

      <Col :span="24" :xl="6">
        <FormItem label="Đã thuê" name="isRented">
          <Checkbox v-model:checked="formState.isRented" />
        </FormItem>
      </Col>

      <Col :span="24" :xl="6">
        <FormItem label="Ẩn" name="isHide">
          <Checkbox v-model:checked="formState.isHide" />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Thông tin chủ hộ</h3>
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem
          label="Tên chủ hộ"
          name="ownerName"
          :rules="[
            { required: true, message: 'Tên chủ hộ là trường bắt buộc' }
          ]"
        >
          <AInput v-model:value="formState.ownerName" />
        </FormItem>

        <FormItem
          label="Địa chỉ chủ hộ"
          name="ownerAddress"
          :rules="[
            { required: true, message: 'Địa chỉ chủ hộ là trường bắt buộc' }
          ]"
        >
          <AInput v-model:value="formState.ownerAddress" />
        </FormItem>
      </Col>

      <Col :span="24" :xl="12">
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
          <AInput v-model:value="formState.ownerPhone" />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <Row :gutter="24">
      <Col :span="24">
        <FormItem>
          <AButton
            type="primary"
            html-type="submit"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            Cập nhật bài đăng
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
  title: Chỉnh sửa bài đăng
  requireAuth: true
  permissions: [0, 1, 2]
</route>

<style scoped lang="scss">
.section-title {
  padding: 16px 0;
  font-weight: bold;
}
</style>
