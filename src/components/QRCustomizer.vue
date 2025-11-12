<script setup lang="ts">
import { ref, watch } from 'vue'
import Dropdown from 'primevue/dropdown'
import ColorPicker from 'primevue/colorpicker'
import type { QROptions } from './QRGenerator.vue'

const props = defineProps<{
  modelValue: QROptions
}>()

const emit = defineEmits<{
  'update:modelValue': [value: QROptions]
}>()

const localOptions = ref<QROptions>({ ...props.modelValue })

watch(
  () => props.modelValue,
  (newVal) => {
    localOptions.value = { ...newVal }
  },
  { deep: true }
)

const updateOption = <K extends keyof QROptions>(key: K, value: QROptions[K]) => {
  localOptions.value[key] = value
  emit('update:modelValue', { ...localOptions.value })
}

const formatOptions = [
  { label: 'PNG (Canvas)', value: 'canvas' },
  { label: 'SVG', value: 'svg' }
]
</script>

<template>
  <div class="customizer-card">
    <h3 class="customizer-title">Налаштування QR-коду</h3>

    <div class="customizer-content">
      <!-- Format Selection -->
      <div class="setting-item">
        <label for="renderAs" class="setting-label">Формат файлу</label>
        <Dropdown
          id="renderAs"
          :model-value="localOptions.renderAs"
          @update:model-value="updateOption('renderAs', $event as QROptions['renderAs'])"
          :options="formatOptions"
          option-label="label"
          option-value="value"
          data-testid="render-select"
          class="w-full"
        />
      </div>

      <!-- Colors Row -->
      <div class="colors-row">
        <div class="setting-item">
          <label for="fgColor" class="setting-label">Колір коду</label>
          <div class="color-input-group">
            <ColorPicker
              id="fgColor"
              :model-value="localOptions.fgColor.substring(1)"
              @update:model-value="updateOption('fgColor', '#' + $event)"
              data-testid="fg-color-input"
              format="hex"
            />
            <input
              type="text"
              :value="localOptions.fgColor"
              @input="updateOption('fgColor', ($event.target as HTMLInputElement).value)"
              pattern="^#[0-9A-Fa-f]{6}$"
              class="p-inputtext color-hex-input"
            />
          </div>
        </div>

        <div class="setting-item">
          <label for="bgColor" class="setting-label">Колір фону</label>
          <div class="color-input-group">
            <ColorPicker
              id="bgColor"
              :model-value="localOptions.bgColor.substring(1)"
              @update:model-value="updateOption('bgColor', '#' + $event)"
              data-testid="bg-color-input"
              format="hex"
            />
            <input
              type="text"
              :value="localOptions.bgColor"
              @input="updateOption('bgColor', ($event.target as HTMLInputElement).value)"
              pattern="^#[0-9A-Fa-f]{6}$"
              class="p-inputtext color-hex-input"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customizer-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

@media (min-width: 640px) {
  .customizer-card {
    padding: 1.5rem;
  }
}

.customizer-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-heading);
  font-family: var(--font-heading);
  margin-bottom: 1rem;
}

@media (min-width: 640px) {
  .customizer-title {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
}

.customizer-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .customizer-content {
    gap: 1.25rem;
  }
}

.colors-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .colors-row {
    grid-template-columns: 1fr 1fr;
  }
}

.setting-item {
  display: flex;
  flex-direction: column;
}

.setting-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.color-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-hex-input {
  flex: 1;
  font-family: monospace;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.w-full {
  width: 100%;
}
</style>
