<script setup lang="ts">
import { LockOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import { ObjectInitTransform } from '~@/utils/tools'

const message = useMessage()
const userStore = useUserStore()
const multiTabStore = useMultiTab()
const layoutMenuStore = useLayoutMenu()
const router = useRouter()
const { avatar, nickname } = storeToRefs(userStore)
const visible = ref(false)
const formData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const labelCol = { style: { width: '100px' } }
const wrapperCol = { span: 20 }

const formRef = ref<FormInstance>()
const rules: Record<string, Rule[]> = {
  oldPassword: [{ required: true, message: '请输入原密码' }],
  newPassword: [{ required: true, message: '请输入新密码' }],
  confirmPassword: [{ required: true, message: '请输入确认密码' }],
}

function updateHandler() {
  formRef.value?.validate().then(() => {
    if (formData.newPassword !== formData.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }
    userStore.changePassword(formData).then(() => {
      message.success('修改成功')
      close()
    })
  })
}

function close() {
  visible.value = false
}
async function handleClick({ key }: any) {
  if (key === 'logout') {
    const hide = message.loading('退出登录...', 0)
    try {
      await userStore.logout()
    }
    finally {
      hide()
      message.success('退出登录成功', 3)
      router.push({
        path: '/login',
      }).then(() => {
        multiTabStore.clear()
        layoutMenuStore.clear()
      })
    }
  }
  else if (key === 'password') {
    ObjectInitTransform(formData)
    visible.value = true
  }
}
</script>

<template>
  <a-dropdown>
    <span hover="bg-[var(--hover-color)]" flex items-center h-48px px-12px cursor-pointer class="transition-all-300">
      <a-avatar :src="avatar" mr-8px size="small" />
      <span class="anticon">{{ nickname }}</span>
    </span>
    <template #overlay>
      <a-menu @click="handleClick">
        <a-menu-item key="password">
          <template #icon>
            <LockOutlined />
          </template>
          <p class="mb-0">
            修改密码
          </p>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="logout">
          <template #icon>
            <LogoutOutlined />
          </template>
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <!-- 修改密码弹窗 -->
  <a-modal v-model:open="visible" title="修改密码" :width="500" @ok="updateHandler" @cancel="close">
    <a-form
      ref="formRef" :model="formData" :rules="rules" class="w-full mt-4" :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="原密码" name="oldPassword">
        <a-input v-model:value="formData.oldPassword" />
      </a-form-item>
      <a-form-item label="新密码" name="newPassword">
        <a-input-password v-model:value="formData.newPassword" />
      </a-form-item>
      <a-form-item label="确认密码" name="confirmPassword">
        <a-input-password v-model:value="formData.confirmPassword" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
