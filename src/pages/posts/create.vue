<script lang="ts">
export default {
  name: 'PostCreationPage'
}
</script>

<script setup lang="ts">
import {
  Button as AButton,
  Checkbox,
  Col,
  Divider,
  Form as AForm,
  FormItem,
  Input as AInput,
  InputNumber,
  PageHeader,
  Row,
  Select as ASelect,
  SelectOption,
  Textarea as ATextarea,
  UploadFile
} from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { storeToRefs } from 'pinia'

import { useDistrictStore } from '~/store/stores/districtStore'
import { useCategoryStore } from '~/store/stores/categoryStore'
import { toVndPrefix, toRawNumber, toAcreage } from '~/utils/formatter'
import ImageUploader from '~/components/ImageUploader.vue'
import { IPostCreate } from '~/interfaces'
import { usePostStore } from '~/store/stores/postStore'

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
    ...values,
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
  (newDistrictId: string) => {
    formState.value.wardId = ''

    if (newDistrictId) {
      districtStore.getWardsByDistrictId(newDistrictId)
    }
  }
)

onMounted(() => {
  categoryStore.getCategories()
  districtStore.getDistricts()
})
</script>

<template>
  <PageHeader
    title="Th??m b??i ????ng m???i"
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
    <h3 class="section-title">Th??ng tin c?? b???n</h3>
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem
          label="Ti??u ?????"
          name="title"
          :rules="[{ required: true, message: 'Ti??u ????? l?? tr?????ng b???t bu???c' }]"
        >
          <AInput v-model:value="formState.title" />
        </FormItem>

        <FormItem
          label="Lo???i"
          name="categoryId"
          :rules="[{ required: true, message: 'Lo???i l?? tr?????ng b???t bu???c' }]"
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
          label="Qu???n huy???n"
          name="districtId"
          :rules="[
            { required: true, message: 'Qu???n huy???n l?? tr?????ng b???t bu???c' }
          ]"
        >
          <ASelect v-model:value="formState.districtId">
            <SelectOption
              v-for="district of districts"
              :key="district.id"
              :value="district.id"
            >
              {{ district.type }} {{ district.name }}
            </SelectOption>
          </ASelect>
        </FormItem>

        <FormItem
          label="X?? ph?????ng"
          name="wardId"
          :rules="[{ required: true, message: 'X?? ph?????ng l?? tr?????ng b???t bu???c' }]"
        >
          <ASelect v-model:value="formState.wardId">
            <SelectOption v-for="ward of wards" :key="ward.id" :value="ward.id">
              {{ ward.type }} {{ ward.name }}
            </SelectOption>
          </ASelect>
        </FormItem>

        <FormItem
          label="Gi?? (VND)"
          name="price"
          :rules="[{ required: true, message: 'Gi?? (VND) l?? tr?????ng b???t bu???c' }]"
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
          label="Hoa h???ng (VND)"
          name="commission"
          :rules="[
            { required: true, message: 'Hoa h???ng (VND) l?? tr?????ng b???t bu???c' }
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
          label="Di???n t??ch (m??)"
          name="acreage"
          :rules="[
            { required: true, message: 'Di???n t??ch (m??) l?? tr?????ng b???t bu???c' }
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
          label="S??? ph??ng ng???"
          name="bedroom"
          :rules="[
            { required: true, message: 'S??? ph??ng ng??? l?? tr?????ng b???t bu???c' }
          ]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.bedroom"
            :min="0"
          />
        </FormItem>

        <FormItem
          label="S??? ph??ng t???m"
          name="bathroom"
          :rules="[
            { required: true, message: 'S??? ph??ng t???m l?? tr?????ng b???t bu???c' }
          ]"
        >
          <InputNumber
            style="width: 100%"
            v-model:value="formState.bathroom"
            :min="0"
          />
        </FormItem>

        <FormItem
          label="S??? t???ng"
          name="floor"
          :rules="[{ required: true, message: 'S??? t???ng l?? tr?????ng b???t bu???c' }]"
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

    <h3 class="section-title">M?? t???</h3>
    <Row :gutter="24">
      <Col span="24">
        <FormItem
          label="M?? t???"
          name="description"
          :rules="[{ required: true, message: 'M?? t??? l?? tr?????ng b???t bu???c' }]"
        >
          <ATextarea v-model:value="formState.description" :rows="12" />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">H??nh ???nh</h3>
    <Row :gutter="24">
      <Col :span="24">
        <FormItem label="H??nh ???nh" name="images">
          <ImageUploader v-model:value="formState.images" />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title"></h3>
    <Row :gutter="24">
      <Col :span="24">
        <FormItem label="N???i b???t" name="isFeatured">
          <Checkbox v-model:checked="formState.isFeatured" />
        </FormItem>

        <FormItem label="Gi?? r???" name="isCheap">
          <Checkbox v-model:checked="formState.isCheap" />
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Th??ng tin ch??? nh??</h3>
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem
          label="T??n ch??? nh??"
          name="ownerName"
          :rules="[
            { required: true, message: 'T??n ch??? nh?? l?? tr?????ng b???t bu???c' }
          ]"
        >
          <AInput v-model:value="formState.ownerName" />
        </FormItem>

        <FormItem
          label="?????a ch??? ch??? nh??"
          name="ownerAddress"
          :rules="[
            { required: true, message: '?????a ch??? ch??? nh?? l?? tr?????ng b???t bu???c' }
          ]"
        >
          <AInput v-model:value="formState.ownerAddress" />
        </FormItem>
      </Col>

      <Col :span="24" :xl="12">
        <FormItem
          label="S??? ??i???n tho???i ch??? nh??"
          name="ownerPhone"
          :rules="[
            {
              required: true,
              message: 'S??? ??i???n tho???i ch??? nh?? l?? tr?????ng b???t bu???c'
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
            htmlType="submit"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            T???o b??i ????ng
          </AButton>
          <AButton @click="resetForm">X??a t???t c???</AButton>
        </FormItem>
      </Col>
    </Row>
  </AForm>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Th??m b??i ????ng m???i
  requireAuth: true
  permissions: [0, 1, 2]
</route>

<style scoped lang="scss">
.section-title {
  padding: 16px 0;
  font-weight: bold;
}
</style>
