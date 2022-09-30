<script setup lang="ts">
import {
  Form,
  FormItem,
  Row,
  Col,
  Button,
  PageHeader,
  Divider,
  Tag,
  Textarea
} from 'ant-design-vue'

import { IPost, Nullable } from '~/interfaces'
import {
  toVndPrefix,
  toAcreage,
  toDateTime,
  getVerifyStatusColor,
  getVerifyStatusText
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
    post.value = response.data.post
    denyFormState.value.reason = response.data.post.denyReason
  } catch {
    router.push('/posts')
  }
})
</script>

<template>
  <PageHeader title="Chi tiết bài đăng" @back="router.back">
    <template #extra>
      <Tag v-if="post?.isCheap" color="blue">Giá rẻ</Tag>
      <Tag v-if="post?.isFeatured" color="pink">Nổi bật</Tag>
      <Tag v-if="post?.isRented" color="default">Đã thuê</Tag>
      <Tag :color="getVerifyStatusColor(post?.verifyStatus)">
        {{ getVerifyStatusText(post?.verifyStatus) }}
      </Tag>
    </template>
  </PageHeader>

  <div class="post-detail" v-bind="$attrs">
    <h3 class="section-title">Thông tin cơ bản</h3>
    <Row>
      <Col span="12">
        <FormItem
          label="Tiêu đề"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ post?.title }}</div>
        </FormItem>

        <FormItem
          label="Loại"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ post?.category?.name }}</div>
        </FormItem>

        <FormItem
          label="Quận huyện"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ post?.ward?.district?.name }}</div>
        </FormItem>

        <FormItem
          label="Xã phường"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ post?.ward?.name }}</div>
        </FormItem>

        <FormItem
          label="Giá (VND)"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ toVndPrefix(post?.price || 0) }}</div>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem
          label="Hoa hồng (VND)"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ toVndPrefix(post?.commission || 0) }}</div>
        </FormItem>

        <FormItem
          label="Diện tích (m²)"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ toAcreage(post?.acreage || 0) }}</div>
        </FormItem>

        <FormItem
          label="Số phòng ngủ"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ post?.bedroom }}</div>
        </FormItem>

        <FormItem
          label="Số phòng tắm"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ post?.bathroom }}</div>
        </FormItem>

        <FormItem
          label="Số tầng"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ post?.floor }}</div>
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Mô tả</h3>
    <Row>
      <Col span="24">
        <FormItem
          label="Mô tả"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <div style="white-space: pre-wrap">{{ post?.description }}</div>
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Hình ảnh</h3>
    <Row>
      <Col span="24">
        <FormItem
          label="Hình ảnh"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
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
    <Row>
      <Col span="12">
        <FormItem
          label="Thời gian cho thuê (gần nhất)"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div v-if="post">
            {{
              post.rentedAt ? toDateTime(post.rentedAt) : 'Chưa từng được thuê'
            }}
          </div>
        </FormItem>

        <FormItem
          label="Thời gian mở cho thuê (gần nhất)"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div v-if="post">{{ toDateTime(post.openedForRentAt) }}</div>
        </FormItem>

        <FormItem
          label="Thời gian cập nhật (gần nhất)"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div v-if="post">{{ toDateTime(post.updatedAt) }}</div>
        </FormItem>

        <FormItem
          label="Thời gian tạo"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div v-if="post">{{ toDateTime(post.createdAt) }}</div>
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Thông tin chủ hộ</h3>
    <Row>
      <Col span="12">
        <FormItem
          label="Tên chủ hộ"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ post?.ownerName }}</div>
        </FormItem>

        <FormItem
          label="Địa chỉ chủ hộ"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ post?.ownerAddress }}</div>
        </FormItem>
      </Col>

      <Col span="12">
        <FormItem
          label="Số điện thoại chủ hộ"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ post?.ownerPhone }}</div>
        </FormItem>
      </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Thông tin người đăng</h3>
    <Row>
      <Col span="12">
        <FormItem
          label="Tên người đăng"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>
            {{ post?.createdBy?.fullName || post?.createdBy?.username }}
          </div>
        </FormItem>
      </Col>

      <Col span="12"> </Col>
    </Row>

    <Divider type="horizontal"></Divider>

    <Form
      name="basic"
      :model="denyFormState"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      @finish="denyPost"
    >
      <Row>
        <Col span="12">
          <FormItem
            label="Lý do không duyệt"
            name="reason"
            :rules="[
              { required: true, message: 'Vui lòng nhập lý do không duyệt' }
            ]"
          >
            <Textarea
              v-model:value="denyFormState.reason"
              placeholder="Nếu không duyệt, vui lòng nhập lý do"
              :rows="4"
            ></Textarea>
          </FormItem>

          <FormItem :wrapper-col="{ offset: 8, span: 16 }">
            <Button type="primary" @click="approvePost">Duyệt bài</Button>
            <Button
              type="primary"
              danger
              style="margin-left: 10px"
              html-type="submit"
            >
              Không duyệt
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider type="horizontal"></Divider>

    <Row>
      <Col span="12">
        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary">
            <router-link :to="`/posts/${id}/edit`">
              Đi tới trang chỉnh sửa
            </router-link>
          </Button>
          <Button style="margin-left: 10px">
            <router-link to="/posts">Quay lại</router-link>
          </Button>
        </FormItem>
      </Col>
    </Row>
  </div>
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
  padding: 16px 24px;
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
