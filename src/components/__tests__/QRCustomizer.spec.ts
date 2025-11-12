import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import QRCustomizer from '../QRCustomizer.vue'
import type { QROptions } from '../QRGenerator.vue'

describe('QRCustomizer', () => {
  const defaultOptions: QROptions = {
    size: 300,
    level: 'M',
    bgColor: '#ffffff',
    fgColor: '#000000',
    margin: 1,
    renderAs: 'canvas'
  }

  const createWrapper = (props: { modelValue: QROptions }) => {
    return mount(QRCustomizer, {
      props,
      global: {
        plugins: [PrimeVue]
      }
    })
  }

  it('renders properly', () => {
    const wrapper = createWrapper({
      modelValue: defaultOptions
    })

    expect(wrapper.find('.customizer-card').exists()).toBe(true)
    expect(wrapper.text()).toContain('Налаштування QR-коду')
  })

  it('displays format and color controls', () => {
    const wrapper = createWrapper({
      modelValue: defaultOptions
    })

    expect(wrapper.find('[data-testid="render-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="fg-color-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="bg-color-input"]').exists()).toBe(true)
  })

  it('emits update:modelValue when render mode changes', async () => {
    const wrapper = createWrapper({
      modelValue: defaultOptions
    })

    // Find the Dropdown component and trigger change
    const renderDropdown = wrapper.findComponent({ name: 'Dropdown' })
    await renderDropdown.vm.$emit('update:modelValue', 'svg')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emittedValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as QROptions
    expect(emittedValue.renderAs).toBe('svg')
  })

  it('emits update:modelValue when foreground color changes', async () => {
    const wrapper = createWrapper({
      modelValue: defaultOptions
    })

    // Find the ColorPicker component for foreground and trigger change
    const colorPickers = wrapper.findAllComponents({ name: 'ColorPicker' })
    expect(colorPickers.length).toBeGreaterThan(0)
    await colorPickers[0]?.vm.$emit('update:modelValue', 'ff0000')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emittedValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as QROptions
    expect(emittedValue.fgColor).toBe('#ff0000')
  })

  it('emits update:modelValue when background color changes', async () => {
    const wrapper = createWrapper({
      modelValue: defaultOptions
    })

    // Find the ColorPicker component for background and trigger change
    const colorPickers = wrapper.findAllComponents({ name: 'ColorPicker' })
    expect(colorPickers.length).toBeGreaterThan(1)
    await colorPickers[1]?.vm.$emit('update:modelValue', '00ff00')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emittedValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as QROptions
    expect(emittedValue.bgColor).toBe('#00ff00')
  })

  it('updates local options when modelValue prop changes', async () => {
    const wrapper = createWrapper({
      modelValue: defaultOptions
    })

    const newOptions: QROptions = {
      ...defaultOptions,
      fgColor: '#0000ff',
      renderAs: 'svg'
    }

    await wrapper.setProps({ modelValue: newOptions })

    // Check that the color input shows the new value
    const colorInputs = wrapper.findAll('.color-hex-input')
    expect(colorInputs.length).toBeGreaterThan(0)
    expect((colorInputs[0]?.element as HTMLInputElement).value).toBe('#0000ff')
  })

  it('allows manual hex color input for foreground', async () => {
    const wrapper = createWrapper({
      modelValue: defaultOptions
    })

    const colorInputs = wrapper.findAll('.color-hex-input')
    expect(colorInputs.length).toBeGreaterThan(0)
    const fgInput = colorInputs[0]

    if (fgInput) {
      await fgInput.setValue('#ff00ff')
      await fgInput.trigger('input')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emittedValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as QROptions
      expect(emittedValue.fgColor).toBe('#ff00ff')
    }
  })

  it('allows manual hex color input for background', async () => {
    const wrapper = createWrapper({
      modelValue: defaultOptions
    })

    const colorInputs = wrapper.findAll('.color-hex-input')
    expect(colorInputs.length).toBeGreaterThan(1)
    const bgInput = colorInputs[1]

    if (bgInput) {
      await bgInput.setValue('#00ffff')
      await bgInput.trigger('input')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emittedValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as QROptions
      expect(emittedValue.bgColor).toBe('#00ffff')
    }
  })
})
