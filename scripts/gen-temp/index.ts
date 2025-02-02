import fs from 'node:fs'
import path from 'node:path'

import { apiTemplate, dataTemplate, formModalTemplate, typeTemplate, vueTemplate } from './temp'

// 定义变量 moduleName
const moduleName = 'auth'

// eslint-disable-next-line node/prefer-global/process
const srcPath = path.join(process.cwd(), 'src/pages/platform')

// 创建文件夹

const folderPath = path.join(srcPath, moduleName)
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath)
}

// 创建 moduleName.api.ts 文件
const apiTsPath = path.join(folderPath, `${moduleName}.api.ts`)
fs.writeFileSync(apiTsPath, apiTemplate(moduleName))

// 创建 moduleName.type.ts 文件
const typeTsPath = path.join(folderPath, `${moduleName}.type.ts`)
fs.writeFileSync(typeTsPath, typeTemplate(moduleName))

// 创建 moduleName.data.ts 文件
const dataTsPath = path.join(folderPath, `${moduleName}.data.ts`)
fs.writeFileSync(dataTsPath, dataTemplate())

// 创建 index.vue 文件
const vuePath = path.join(folderPath, `index.vue`)
fs.writeFileSync(vuePath, vueTemplate(moduleName))

// 创建 components 文件夹
const componentsPath = path.join(folderPath, 'components')
if (!fs.existsSync(componentsPath)) {
  fs.mkdirSync(componentsPath)
}

// 创建 form-modal.vue 文件
const formModalPath = path.join(componentsPath, 'form-modal.vue')
fs.writeFileSync(formModalPath, formModalTemplate(moduleName))

console.log('文件夹和文件创建成功')
