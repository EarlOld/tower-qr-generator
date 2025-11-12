import { test, expect } from '@playwright/test'

test.describe('QR Code Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the main page with header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Bashta QR Code Generator')
    await expect(page.locator('.logo')).toBeVisible()
  })

  test('should show placeholder when URL is empty', async ({ page }) => {
    await expect(page.getByText('Введіть URL для генерації QR-коду')).toBeVisible()
  })

  test('should generate QR code when URL is entered', async ({ page }) => {
    const urlInput = page.getByPlaceholder('https://example.com')
    await urlInput.fill('https://bashta.in.ua')

    // Wait for QR code to be generated
    await expect(page.locator('.qr-code')).toBeVisible({ timeout: 3000 })

    // Placeholder should be hidden
    await expect(page.getByText('Введіть URL для генерації QR-коду')).toBeHidden()
  })

  test('should disable download button when URL is empty', async ({ page }) => {
    const downloadBtn = page.getByTestId('export-btn')
    await expect(downloadBtn).toBeDisabled()
  })

  test('should enable download button when URL is provided', async ({ page }) => {
    const urlInput = page.getByPlaceholder('https://example.com')
    await urlInput.fill('https://bashta.in.ua')

    const downloadBtn = page.getByTestId('export-btn')
    await expect(downloadBtn).toBeEnabled()
  })

  test('should display customization options', async ({ page }) => {
    await expect(page.getByText('Налаштування QR-коду')).toBeVisible()
    await expect(page.getByText('Формат файлу')).toBeVisible()
    await expect(page.getByText('Колір коду')).toBeVisible()
    await expect(page.getByText('Колір фону')).toBeVisible()
  })

  test('should change format from PNG to SVG', async ({ page }) => {
    const urlInput = page.getByPlaceholder('https://example.com')
    await urlInput.fill('https://bashta.in.ua')

    // Check initial format
    await expect(page.getByText('Завантажити PNG')).toBeVisible()

    // Change format to SVG
    const formatDropdown = page.getByTestId('render-select').locator('..')
    await formatDropdown.click()
    await page.getByText('SVG', { exact: true }).click()

    // Check button text changed
    await expect(page.getByText('Завантажити SVG')).toBeVisible()
  })

  test('should allow changing foreground color', async ({ page }) => {
    const urlInput = page.getByPlaceholder('https://example.com')
    await urlInput.fill('https://bashta.in.ua')

    // Find the color hex input for foreground (first one)
    const colorInputs = page.locator('.color-hex-input')
    const fgColorInput = colorInputs.first()

    await fgColorInput.clear()
    await fgColorInput.fill('#ff0000')
    await fgColorInput.blur()

    // Verify the value was set
    await expect(fgColorInput).toHaveValue('#ff0000')
  })

  test('should allow changing background color', async ({ page }) => {
    const urlInput = page.getByPlaceholder('https://example.com')
    await urlInput.fill('https://bashta.in.ua')

    // Find the color hex input for background (second one)
    const colorInputs = page.locator('.color-hex-input')
    const bgColorInput = colorInputs.nth(1)

    await bgColorInput.clear()
    await bgColorInput.fill('#00ff00')
    await bgColorInput.blur()

    // Verify the value was set
    await expect(bgColorInput).toHaveValue('#00ff00')
  })

  test('should update QR code when URL changes', async ({ page }) => {
    const urlInput = page.getByPlaceholder('https://example.com')

    // Enter first URL
    await urlInput.fill('https://bashta.in.ua')
    await expect(page.locator('.qr-code')).toBeVisible()

    // Change to second URL
    await urlInput.clear()
    await urlInput.fill('https://google.com')

    // QR code should still be visible (regenerated)
    await expect(page.locator('.qr-code')).toBeVisible()
  })

  test('should have responsive layout', async ({ page }) => {
    // Check that main elements are visible
    await expect(page.locator('.app-header')).toBeVisible()
    await expect(page.locator('.main-content')).toBeVisible()
    await expect(page.locator('.app-footer')).toBeVisible()
  })

  test('should display footer with copyright', async ({ page }) => {
    const currentYear = new Date().getFullYear()
    await expect(page.getByText(`© ${currentYear} QR Code Generator`)).toBeVisible()
  })

  test('should maintain state when switching between formats', async ({ page }) => {
    const urlInput = page.getByPlaceholder('https://example.com')
    await urlInput.fill('https://bashta.in.ua')

    // Set custom colors
    const colorInputs = page.locator('.color-hex-input')
    await colorInputs.first().fill('#ff0000')
    await colorInputs.nth(1).fill('#ffff00')

    // Switch format
    const formatDropdown = page.getByTestId('render-select').locator('..')
    await formatDropdown.click()
    await page.getByText('SVG', { exact: true }).click()

    // Colors should be maintained
    await expect(colorInputs.first()).toHaveValue('#ff0000')
    await expect(colorInputs.nth(1)).toHaveValue('#ffff00')
    await expect(page.getByText('Завантажити SVG')).toBeVisible()
  })
})
