<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useDevlogs } from '@/composables/useDevlogs'
import DevlogsPythonFilters from '@/components/DevlogsPythonFilters.vue'
import DevlogsNodeFilters from '@/components/DevlogsNodeFilters.vue'

const { loading, error, selectedType, submitFilters } = useDevlogs()

const logType = ref(null)
const showFilters = ref(false)

const handleTypeChange = (type) => {
  logType.value = type
  showFilters.value = true
}

const handleSubmit = async (filters) => {
  const type = logType.value === 'python' ? 'python' : 'node'
  await submitFilters(filters, type)
}
</script>

<template>
  <div class="devlogs-page">
    <div class="page-header">
      <RouterLink to="/" class="back-link">← Voltar</RouterLink>
      <h1>Developer Logs</h1>
    </div>

    <div class="container">
      <!-- Select Type -->
      <div class="type-selector">
        <label class="type-label">Selecione o tipo de log:</label>
        <div class="type-options">
          <button
            class="type-btn"
            :class="{ 'type-btn--active': logType === 'python' }"
            @click="handleTypeChange('python')"
          >
            <span class="type-btn__label">Python</span>
          </button>
          <button
            class="type-btn"
            :class="{ 'type-btn--active': logType === 'node' }"
            @click="handleTypeChange('node')"
          >
            <span class="type-btn__label">Node.js</span>
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div v-if="showFilters" class="filters-section">
        <div class="filters-header">
          <h2>Filtros</h2>
          <button
            class="collapse-btn"
            :class="{ 'collapse-btn--open': showFilters }"
            @click="showFilters = !showFilters"
          >
            ▼
          </button>
        </div>

        <div class="filters-content">
          <DevlogsPythonFilters
            v-if="logType === 'python'"
            :loading="loading"
            @submit="handleSubmit"
          />
          <DevlogsNodeFilters
            v-if="logType === 'node'"
            :loading="loading"
            @submit="handleSubmit"
          />
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <span>{{ error }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <span>Carregando logs...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.devlogs-page {
  min-height: 100vh;
  background: #fff;
  padding: 2rem;
}

.page-header {
  max-width: 800px;
  margin: 0 auto 2.5rem;
}

.back-link {
  display: inline-block;
  color: #000;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
  border-bottom: 2px solid transparent;
  transition: border-color 0.15s;
}

.back-link:hover {
  border-bottom-color: #000;
}

.page-header h1 {
  color: #000;
  font-size: 2.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Type Selector */
.type-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.type-label {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #000;
}

.type-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.type-btn {
  flex: 1;
  min-width: 150px;
  padding: 0.875rem 1rem;
  border: 2px solid #000;
  border-radius: 0;
  background: #fff;
  color: #000;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.15s ease;
}

.type-btn:hover {
  background: #000;
  color: #fff;
  box-shadow: 4px 4px 0 #000;
  transform: translate(-2px, -2px);
}

.type-btn--active {
  background: #000;
  color: #fff;
}

.type-btn__label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Filters Section */
.filters-section {
  border: 2px solid #000;
  border-radius: 0;
  overflow: hidden;
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 2px solid #000;
  background: #f9f9f9;
  cursor: pointer;
  user-select: none;
}

.filters-header h2 {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #000;
  margin: 0;
}

.collapse-btn {
  background: none;
  border: none;
  font-size: 1rem;
  color: #000;
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s ease;
  font-weight: 700;
}

.collapse-btn--open {
  transform: rotate(180deg);
}

.filters-content {
  padding: 1.5rem;
  background: #fff;
}

/* Error Message */
.error-message {
  padding: 1rem;
  background: #fff;
  border: 2px solid #ff4444;
  color: #ff4444;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Loading State */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  border: 2px solid #000;
  background: #f9f9f9;
  min-height: 150px;
}

.loading-state span {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #000;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(0, 0, 0, 0.3);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 1.85rem;
  }

  .type-options {
    flex-direction: column;
  }

  .type-btn {
    flex: initial;
  }
}
</style>

