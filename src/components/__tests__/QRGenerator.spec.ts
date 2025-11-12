import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import QRGenerator from '../QRGenerator.vue'
import type { QROptions } from '../QRGenerator.vue'

// Mock qrcode.vue
vi.mock('qrcode.vue', () => ({
  default: {
    name: 'QrcodeVue',
    props: ['value', 'size', 'level', 'background', 'foreground', 'margin', 'renderAs', 'image'],
    template: '<canvas data-testid="qr-canvas"></canvas>'
  }
}))

describe('QRGenerator', () => {
  const defaultOptions: QROptions = {
    size: 300,
    level: 'M',
    bgColor: '#ffffff',
    fgColor: '#000000',
    margin: 1,
    renderAs: 'canvas'
  }

  const createWrapper = (props: { url: string; options: QROptions; logoUrl?: string }) => {
    return mount(QRGenerator, {
      props,
      global: {
        plugins: [PrimeVue]
      }
    })
  }

  it('renders properly', () => {
    const wrapper = createWrapper({
      url: '',
      options: defaultOptions
    })

    expect(wrapper.find('.qr-card').exists()).toBe(true)
  })

  it('shows placeholder when url is empty', () => {
    const wrapper = createWrapper({
      url: '',
      options: defaultOptions
    })

    expect(wrapper.text()).toContain('Введіть URL для генерації QR-коду')
  })

  it('shows QR code when url is provided', () => {
    const wrapper = createWrapper({
      url: 'https://example.com',
      options: defaultOptions
    })

    const qrComponent = wrapper.findComponent({ name: 'QrcodeVue' })
    expect(qrComponent.exists()).toBe(true)
  })

  it('disables export button when url is empty', () => {
    const wrapper = createWrapper({
      url: '',
      options: defaultOptions
    })

    const exportBtn = wrapper.find('[data-testid="export-btn"]')
    expect(exportBtn.attributes('disabled')).toBeDefined()
  })

  it('enables export button when url is provided', () => {
    const wrapper = createWrapper({
      url: 'https://example.com',
      options: defaultOptions
    })

    const exportBtn = wrapper.find('[data-testid="export-btn"]')
    expect(exportBtn.attributes('disabled')).toBeUndefined()
  })

  it('shows correct export format in button text', () => {
    const wrapper = createWrapper({
      url: 'https://example.com',
      options: { ...defaultOptions, renderAs: 'canvas' }
    })

    expect(wrapper.text()).toContain('PNG')
  })

  it('shows SVG format when renderAs is svg', () => {
    const wrapper = createWrapper({
      url: 'https://example.com',
      options: { ...defaultOptions, renderAs: 'svg' }
    })

    expect(wrapper.text()).toContain('SVG')
  })

  it('passes correct props to QrcodeVue component', () => {
    const url = 'https://example.com'
    const wrapper = createWrapper({
      url,
      options: defaultOptions
    })

    const qrComponent = wrapper.findComponent({ name: 'QrcodeVue' })
    expect(qrComponent.props('value')).toBe(url)
    expect(qrComponent.props('size')).toBe(defaultOptions.size)
    expect(qrComponent.props('level')).toBe(defaultOptions.level)
    expect(qrComponent.props('background')).toBe(defaultOptions.bgColor)
    expect(qrComponent.props('foreground')).toBe(defaultOptions.fgColor)
    expect(qrComponent.props('margin')).toBe(defaultOptions.margin)
    expect(qrComponent.props('renderAs')).toBe(defaultOptions.renderAs)
  })

  it('exposes export methods', () => {
    const wrapper = createWrapper({
      url: 'https://example.com',
      options: defaultOptions
    })

    expect(typeof wrapper.vm.exportPNG).toBe('function')
    expect(typeof wrapper.vm.exportSVG).toBe('function')
    expect(typeof wrapper.vm.export).toBe('function')
  })

  it('updates when options change', async () => {
    const wrapper = createWrapper({
      url: 'https://example.com',
      options: defaultOptions
    })

    const newOptions: QROptions = {
      ...defaultOptions,
      size: 400,
      fgColor: '#ff0000'
    }

    await wrapper.setProps({ options: newOptions })

    const qrComponent = wrapper.findComponent({ name: 'QrcodeVue' })
    expect(qrComponent.props('size')).toBe(400)
    expect(qrComponent.props('foreground')).toBe('#ff0000')
  })
})
