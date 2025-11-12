<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import QRGenerator from './components/QRGenerator.vue'
import QRCustomizer from './components/QRCustomizer.vue'
import type { QROptions } from './components/QRGenerator.vue'
import logoUrl from '@/assets/logo.png'


const url = ref('')
const qrOptions = ref<QROptions>({
  size: 300,
  level: 'H',
  bgColor: '#ffffff',
  fgColor: '#112337',
  margin: 1,
  renderAs: 'canvas'
})
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <img :src="logoUrl" alt="Logo" class="logo" />
        <div>
          <h1 class="title">Bashta QR Code Generator</h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-grid">
        <!-- Left Column - Input & Preview -->
        <div class="left-column">
          <!-- URL Input -->
          <div class="card">
            <label for="url-input" class="input-label">
              <i class="pi pi-link"></i>
              Введіть URL
            </label>
            <InputText
              id="url-input"
              v-model="url"
              type="url"
              placeholder="https://example.com"
              data-testid="url-input"
              style="width: 100%"
            />
          </div>

          <!-- QR Code Preview -->
          <QRGenerator :url="url" :options="qrOptions"/>
        </div>

        <!-- Right Column - Customization -->
        <div>
          <QRCustomizer v-model="qrOptions" />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="footer-content">
        <p>
          © {{ new Date().getFullYear() }} QR Code Generator. Створено для bashta.in.ua з
          <span style="color: #ef4444">♥</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

@media (min-width: 640px) {
  .app-header {
    padding: 1.5rem;
  }
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .header-content {
    gap: 1rem;
  }
}

.logo {
  width: 36px;
  height: 36px;
}

@media (min-width: 640px) {
  .logo {
    width: 48px;
    height: 48px;
  }
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-heading);
  font-family: var(--font-heading);
}

@media (min-width: 640px) {
  .title {
    font-size: 1.5rem;
  }
}

@media (min-width: 768px) {
  .title {
    font-size: 1.875rem;
  }
}

.subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
  display: none;
}

@media (min-width: 640px) {
  .subtitle {
    display: block;
    font-size: 0.875rem;
  }
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
}

@media (min-width: 640px) {
  .main-content {
    padding: 1.5rem;
  }
}

@media (min-width: 768px) {
  .main-content {
    padding: 2rem;
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .content-grid {
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

@media (min-width: 640px) {
  .card {
    padding: 1.5rem;
  }
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-heading);
  margin-bottom: 0.75rem;
}

.input-label i {
  color: var(--color-primary);
}

.app-footer {
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.footer-content p {
  margin: 0;
}
</style>
