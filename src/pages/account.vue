<script lang="ts">
export default {
  name: 'AccountPage'
}
</script>

<script setup lang="ts">
import {
  PageHeader,
  Row,
  Col,
  Form as AForm,
  FormItem,
  Input as AInput,
  InputPassword,
  Button as AButton,
  Divider,
  FormInstance,
  message
} from 'ant-design-vue'
import { IChangePassword, IUpdateInfo, IUser, Nullable } from '~/interfaces'
import { useAuthStore } from '~/store/stores/authStore'
import { getUserTypeText } from '~/utils/formatter'

interface IUpdateInfoFormState {
  fullName: string
}

interface IChangePasswordFormState {
  newPassword: string
}

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)

const router = useRouter()

const updateInfoFormState = ref<IUpdateInfoFormState>({
  fullName: ''
})

const changePasswordFormState = ref<IChangePasswordFormState>({
  newPassword: ''
})

const changePasswordFormRef = ref<FormInstance>()

const isUserInfoChanged = computed(() => {
  if (currentUser.value) {
    const { fullName: currentUserFullname } = currentUser.value as IUser
    const { fullName: formStateFullname } = updateInfoFormState.value
    const isFullnameChanged = currentUserFullname !== formStateFullname
    return isFullnameChanged
  }

  return false
})

const onUpdateInfo = async (values: IUpdateInfoFormState) => {
  if (isUserInfoChanged.value) {
    await authStore.updateInfo(values as IUpdateInfo)
    message.success('Cập nhật thông tin thành công')
  } else {
    message.error('Không có thông tin nào thay đổi')
  }
}

const onChangePassword = async (values: IChangePasswordFormState) => {
  await authStore.changePassword(values as IChangePassword)
  changePasswordFormRef.value?.resetFields()
  message.success('Đổi mật khẩu thành công')
}

watch(
  currentUser,
  (newValue: Nullable<IUser>) => {
    if (newValue) {
      updateInfoFormState.value = {
        fullName: newValue.fullName || ''
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <PageHeader
    title="Thông tin tài khoản"
    style="padding-left: 0; padding-right: 0"
    @back="router.back"
  />

  <div v-bind="$attrs">
    <h3 class="section-title">Thông tin cá nhân</h3>
    <AForm
      name="basic"
      layout="vertical"
      :colon="false"
      :model="updateInfoFormState"
      @finish="onUpdateInfo"
    >
      <Row :gutter="24">
        <Col :span="24" :xl="12">
          <FormItem label="Họ và tên" name="fullName">
            <AInput
              v-model:value="updateInfoFormState.fullName"
              placeholder="(rỗng)"
            />
          </FormItem>

          <FormItem label="Loại tài khoản">
            <div>{{ getUserTypeText(currentUser?.type) }}</div>
          </FormItem>

          <FormItem>
            <AButton
              type="primary"
              html-type="submit"
              :disabled="!isUserInfoChanged"
              style="margin-right: 10px; margin-bottom: 10px"
            >
              Đổi
            </AButton>
          </FormItem>
        </Col>
      </Row>
    </AForm>

    <Divider type="horizontal"></Divider>

    <h3 class="section-title">Đổi mật khẩu</h3>
    <AForm
      name="basic"
      ref="changePasswordFormRef"
      layout="vertical"
      :colon="false"
      :model="changePasswordFormState"
      @finish="onChangePassword"
    >
      <Row>
        <Col :span="24" :xl="12">
          <FormItem
            label="Mật khẩu mới"
            name="newPassword"
            :rules="[
              { required: true, message: 'Mật khẩu mới là trường bắt buộc' }
            ]"
          >
            <InputPassword
              v-model:value="changePasswordFormState.newPassword"
            />
          </FormItem>

          <FormItem>
            <AButton
              type="primary"
              html-type="submit"
              :disabled="!changePasswordFormState.newPassword"
              style="margin-right: 10px; margin-bottom: 10px"
            >
              Đổi
            </AButton>
          </FormItem>
        </Col>
      </Row>
    </AForm>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Thông tin tài khoản
  requireAuth: true
</route>

<style scoped lang="scss">
.section-title {
  padding: 16px 0;
  font-weight: bold;
}
</style>
