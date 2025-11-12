<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import QrcodeVue from 'qrcode.vue'

export interface QROptions {
  size: number
  level: 'L' | 'M' | 'Q' | 'H'
  bgColor: string
  fgColor: string
  margin: number
  renderAs: 'canvas' | 'svg'
}

const props = defineProps<{
  url: string
  options: QROptions
  logoUrl?: string
}>()

const qrRef = ref<InstanceType<typeof QrcodeVue> | null>(null)

const imageSettings = computed(() => {
  if (!props.logoUrl) return undefined

  return {
    src: props.logoUrl,
    width: props.options.size * 0.2,
    height: props.options.size * 0.2,
    excavate: true
  }
})

const handleExport = () => {
  if (props.options.renderAs === 'canvas') {
    handleExportPNG()
  } else {
    handleExportSVG()
  }
}

const handleExportPNG = () => {
  const canvas = qrRef.value?.$el.nextSibling as HTMLCanvasElement | null
  if (!canvas) return

  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'qr-code.png'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  })
}

const handleExportSVG = () => {
  const svg = qrRef.value?.$el as HTMLElement
  if (!svg) return

  const svgData = new XMLSerializer().serializeToString(svg)
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = 'qr-code.svg'
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}

defineExpose({
  exportPNG: handleExportPNG,
  exportSVG: handleExportSVG,
  export: handleExport,
})
</script>

<template>
  <div class="qr-card">
    <!-- QR Code Preview -->
    <div class="qr-preview-container">
      <div class="qr-preview-area">
        <div v-if="!url" class="qr-placeholder">
          <p class="qr-placeholder-text">Введіть URL для генерації QR-коду</p>
        </div>
        <div v-else class="qr-code-wrapper">
          <QrcodeVue
            ref="qrRef"
            :value="url"
            :size="options.size"
            :level="options.level"
            :background="options.bgColor"
            :foreground="options.fgColor"
            :margin="options.margin"
            :render-as="options.renderAs"
            :image-settings="imageSettings"
            class="qr-code"
          />
        </div>
      </div>

      <!-- Download Button -->
      <Button
        :disabled="!url"
        @click="handleExport"
        icon="pi pi-download"
        :label="`Завантажити ${options.renderAs === 'canvas' ? 'PNG' : 'SVG'}`"
        data-testid="export-btn"
        class="w-full"
      />
    </div>
  </div>
</template>

<style scoped>
.qr-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

@media (min-width: 640px) {
  .qr-card {
    padding: 1.5rem;
  }
}

.qr-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

@media (min-width: 640px) {
  .qr-preview-container {
    gap: 1.5rem;
  }
}

.qr-preview-area {
  background: #f9fafb;
  padding: 1.5rem;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  width: 100%;
}

@media (min-width: 640px) {
  .qr-preview-area {
    padding: 2rem;
    min-height: 380px;
  }
}

.qr-placeholder {
  text-align: center;
  padding: 1rem;
}

.qr-placeholder-text {
  color: #6b7280;
  font-size: 0.875rem;
}

@media (min-width: 640px) {
  .qr-placeholder-text {
    font-size: 1rem;
  }
}

.qr-code-wrapper {
  background: white;
  padding: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  max-width: 100%;
  overflow: hidden;
}

@media (min-width: 640px) {
  .qr-code-wrapper {
    padding: 1rem;
  }
}

.qr-code {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
