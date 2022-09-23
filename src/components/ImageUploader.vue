<script setup lang="ts">
import { Upload, Modal, UploadChangeParam, UploadFile } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { FileType } from 'ant-design-vue/lib/upload/interface'

defineProps(['value'])
const emit = defineEmits(['update:value'])

const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')
const requestHeaders = { 'Content-Type': 'application/json' }

const fileList = ref<UploadFile[]>([])

const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const handleCancel = () => {
  previewVisible.value = false
  previewTitle.value = ''
}

const handlePreview = async (file: UploadFile) => {
  const { url, preview, originFileObj, name } = file
  if (!url && !preview) {
    file.preview = (await getBase64(originFileObj as FileType)) as string
  }

  previewImage.value = (url || file.preview) as string
  previewVisible.value = true

  if (url) {
    previewTitle.value = url.substring(url.lastIndexOf('/') + 1)
  } else {
    previewTitle.value = name
  }
}

const handleChange = (info: UploadChangeParam<UploadFile>) => {
  fileList.value = info.fileList
  emit('update:value', info.fileList)
}
</script>

<template>
  <div class="clearfix">
    <Upload
      v-model:file-list="fileList"
      multiple
      action="http://localhost:5000/upload"
      list-type="picture-card"
      name="image"
      :request-headers="requestHeaders"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList && fileList.length < 8">
        <plus-outlined />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </Upload>
    <Modal
      :visible="previewVisible"
      :title="previewTitle"
      :footer="null"
      @cancel="handleCancel"
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
    </Modal>
  </div>
</template>
