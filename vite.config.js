import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/court-staff/', // تم الحفاظ على إعدادات الـ Base الخاصة بك للرفع على GitHub Pages
  build: {
    // رفع الحد الأقصى للتحذير إلى 1000 كيلوبايت (1 ميجابايت) بدلاً من 500
    chunkSizeWarningLimit: 1000, 
    
    // فصل المكتبات الخارجية عن كود المشروع الأساسي لتحسين وتسريع التحميل
    rollupOptions: {
      output: {
        manualChunks(id) {
          // أي كود قادم من node_modules (زي React, Lucide, Axios) هيتجمع في ملف اسمه vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})