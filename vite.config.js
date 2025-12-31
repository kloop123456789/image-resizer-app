import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // REPO_NAME should be replaced by the user's repository name, e.g. '/image-resizer/'
  // For now we will instruct them to change this or use a relative base './' which often works for simple deployments.
  base: './',
})
