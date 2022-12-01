<script lang="ts">
export default {
  name: 'PostDetailPage'
}
</script>

<script setup lang="ts">
import {
  Form as AForm,
  FormItem,
  Row,
  Col,
  Button as AButton,
  PageHeader,
  Divider,
  Tag,
  Textarea as ATextarea
} from 'ant-design-vue'

import { IPost, Nullable } from '~/interfaces'
import {
  toVndPrefix,
  toAcreage,
  toDateTimeString,
  getPostVerifyStatusColor,
  getPostVerifyStatusText
} from '~/utils/formatter'
import { usePostStore } from '~/store/stores/postStore'

interface IDenyFormState {
  reason: string
}

const postStore = usePostStore()
const router = useRouter()
const route = useRoute()

const post = ref<Nullable<IPost>>(null)

const denyFormState = ref<IDenyFormState>({
  reason: ''
})

const id = computed(() => {
  return route.params.id as string
})

const denyPost = async (values: IDenyFormState) => {
  await postStore.denyPost(id.value, values.reason)
  router.push('/posts')
}

const approvePost = async () => {
  await postStore.approvePost(id.value)
  router.push('/posts')
}

onMounted(async () => {
  try {
    const response = await postStore.getPost(id.value)
    post.value = response.data.data
    denyFormState.value.reason = response.data.data.denyReason
  } catch {
    router.push('/posts')
  }
})
</script>

<template>
  <PageHeader
    title="Chi tiết bài đăng"
    style="padding-left: 0; padding-right: 0"
    @back="router.back"
  >
    <template #extra>
      <Tag v-if="post?.isCheap" color="blue">Giá rẻ</Tag>
      <Tag v-if="post?.isFeatured" color="pink">Nổi bật</Tag>
      <Tag v-if="post?.isRented" color="default">Đã thuê</Tag>
      <Tag :color="getPostVerifyStatusColor(post?.verifyStatus)">
        {{ getPostVerifyStatusText(post?.verifyStatus) }}
      </Tag>
    </template>
  </PageHeader>

  <AForm
    name="basic"
    ref="formRef"
    class="post-detail"
    layout="vertical"
    v-bind="$attrs"
    :colon="false"
  >
    <h3 class="section-title">Thông tin cơ bản</h3>
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem label="Tiêu đề">
          <div>{{ post?.title }}</div>
        </FormItem>

        <FormItem label="Loại">
          <router-link
            v-if="post?.category?.id"
            :to="`/categories/${post?.category?.id}/view`"
          >
            {{ post?.category?.name }}
          </router-link>
          <div v-else>{{ post?.category?.name }}</div>
        </FormItem>

        <FormItem label="Quận huyện">
          <router-link
            v-if="post?.ward?.district?.id"
            :to="`/districts/${post?.ward?.district?.id}/view`"
          >
            {{ post?.ward?.district?.name }}
          </router-link>
          <div v-else>{{ post?.ward?.district?.name }}</div>
        </FormItem>

        <FormItem label="Xã phường">
          <router-link
            v-if="post?.ward?.id"
            :to="`/wards/${post?.ward?.id}/view`"
          >
            {{ post?.ward?.name }}
          </router-link>
          <div v-else>{{ post?.ward?.name }}</div>
        </FormItem>

        <FormItem label="Giá (VND)">
          <div>{{ toVndPrefix(post?.price || 0) }}</div>
        </FormItem>
      </Col>
      <Col :span="24" :xl="12">
        <FormItem label="Hoa hồng (VND)">
          <div>{{ toVndPrefix(post?.commission || 0) }}</div>
        </FormItem>

        <FormItem label="Diện tích (m²)">
          <div>{{ toAcreage(post?.acreage || 0) }}</div>
        </FormItem>

        <FormItem label="Số phòng ngủ">
          <div>{{ post?.bedroom }}</div>
        </FormItem>

        <FormItem label="Số phòng tắm">
          <div>{{ post?.bathroom }}</div>
        </FormItem>

        <FormItem label="Số tầng">
          <div>{{ post?.floor }}</div>
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Mô tả</h3>
    <Row :gutter="24">
      <Col span="24">
        <FormItem label="Mô tả">
          <div style="white-space: pre-wrap">{{ post?.description }}</div>
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Hình ảnh</h3>
    <Row :gutter="24">
      <Col span="24">
        <FormItem label="Hình ảnh">
          <div class="images-wrap">
            <div
              v-if="post"
              v-for="image in post.images"
              :key="image.id"
              class="images"
            >
              <img :src="image.url" alt="" />
            </div>
          </div>
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Thời gian</h3>
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem label="Thời gian cho thuê (gần nhất)">
          <div v-if="post">
            {{
              post.rentedAt
                ? toDateTimeString(post.rentedAt)
                : 'Chưa từng được thuê'
            }}
          </div>
        </FormItem>

        <FormItem label="Thời gian mở cho thuê (gần nhất)">
          <div v-if="post">
            {{
              post.openedForRentAt ? toDateTimeString(post.openedForRentAt) : ''
            }}
          </div>
        </FormItem>

        <FormItem label="Thời gian cập nhật (gần nhất)">
          <div v-if="post">{{ toDateTimeString(post.updatedAt) }}</div>
        </FormItem>

        <FormItem label="Thời gian tạo">
          <div v-if="post">{{ toDateTimeString(post.createdAt) }}</div>
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Thông tin chủ nhà</h3>
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem label="Tên chủ nhà">
          <div>{{ post?.ownerName }}</div>
        </FormItem>

        <FormItem label="Địa chỉ chủ nhà">
          <div>{{ post?.ownerAddress }}</div>
        </FormItem>
      </Col>

      <Col span="12">
        <FormItem label="Số điện thoại chủ nhà">
          <div>{{ post?.ownerPhone }}</div>
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Thông tin người đăng</h3>
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem label="Tên người đăng">
          <router-link
            v-if="post?.createdBy?.id"
            :to="`/users/${post?.createdBy?.id}/view`"
          >
            {{ post?.createdBy?.fullName || post?.createdBy?.username }}
          </router-link>
          <div v-else>
            {{ post?.createdBy?.fullName || post?.createdBy?.username }}
          </div>
        </FormItem>
      </Col>
    </Row>
  </AForm>

  <Divider type="horizontal"></Divider>

  <AForm
    name="basic"
    layout="vertical"
    :colon="false"
    :model="denyFormState"
    @finish="denyPost"
  >
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem
          label="Lý do không duyệt"
          name="reason"
          :rules="[
            { required: true, message: 'Vui lòng nhập lý do không duyệt' }
          ]"
        >
          <ATextarea
            v-model:value="denyFormState.reason"
            placeholder="Nếu không duyệt, vui lòng nhập lý do"
            :rows="4"
          />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem>
          <AButton
            type="primary"
            style="margin-right: 10px; margin-bottom: 10px"
            @click="approvePost"
          >
            Duyệt bài
          </AButton>
          <AButton type="primary" danger html-type="submit">
            Không duyệt
          </AButton>
        </FormItem>
      </Col>
    </Row>
  </AForm>

  <Divider type="horizontal"></Divider>

  <Row :gutter="24">
    <Col :span="24" :xl="12">
      <FormItem>
        <AButton type="primary" style="margin-right: 10px; margin-bottom: 10px">
          <router-link :to="`/posts/${id}/edit`">
            Đi tới trang chỉnh sửa
          </router-link>
        </AButton>
        <AButton>
          <router-link to="/posts">Quay lại</router-link>
        </AButton>
      </FormItem>
    </Col>
  </Row>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Chi tiết bài đăng
  requireAuth: true
  permissions: [0, 1, 2]
</route>

<style scoped lang="scss">
.section-title {
  padding: 16px 0;
  font-weight: bold;
}

.post-detail {
  .images-wrap {
    display: flex;

    .images {
      img {
        max-height: 100px;
        width: 100px;
        object-fit: contain;
      }

      &:not(:last-child) {
        img {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
