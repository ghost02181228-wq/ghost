import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 重要：請將 'YOUR_REPO_NAME' 改為您的 GitHub 儲存庫名稱
  // 例如：如果您的倉庫是 https://github.com/user/my-stock-app
  // 這裡就填入 '/my-stock-app/'
  base: process.env.GITHUB_PAGES ? '/YOUR_REPO_NAME/' : './',
})