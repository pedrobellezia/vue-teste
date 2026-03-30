<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useDevlogs } from '@/composables/useDevlogs'

const router = useRouter()
const { results, error, clearResults } = useDevlogs()

// Fallback se results for vazio
if (!results.value) {
  router.push({ name: 'devlogs' })
}

const expandedLogs = ref(new Set())

const isPythonLogs = computed(() => results.value?.type === 'python')
const isNodeLogs = computed(() => results.value?.type === 'node')

const toggleExpand = (index) => {
  if (expandedLogs.value.has(index)) {
    expandedLogs.value.delete(index)
  } else {
    expandedLogs.value.add(index)
  }
}

const isExpanded = (index) => expandedLogs.value.has(index)

const getLevelColor = (level) => {
  const normalizedLevel = level?.toLowerCase() || 'info'
  if (normalizedLevel === 'error') return '#ff4444'
  if (normalizedLevel === 'warn') return '#ffaa00'
  return '#0066ff'
}

const getLogTypeLabel = (type) => {
  if (type === 'python') return 'Python'
  if (type === 'node') return 'Node.js'
  return type
}

const handleGoBack = () => {
  clearResults()
  router.push({ name: 'devlogs' })
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleString('pt-BR')
  } catch {
    return dateString
  }
}
</script>

<template>
  <div class="devlogs-result-page">
    <div class="page-header">
      <button class="back-link" @click="handleGoBack">← Voltar</button>
      <h1>Resultado dos Logs</h1>
    </div>

    <div class="container">
      <!-- Info Bar -->
      <div class="info-bar">
        <span class="info-badge">{{ getLogTypeLabel(results?.type) }}</span>
        <span class="info-count">{{ results?.data?.length || 0 }} log(s) encontrado(s)</span>
      </div>

      <!-- Empty State -->
      <div v-if="!results?.data || results.data.length === 0" class="empty-state">
        <p>Nenhum log encontrado com os filtros aplicados.</p>
      </div>

      <!-- Logs Container -->
      <div v-else class="logs-container">
        <!-- Python Logs -->
        <div v-if="isPythonLogs" class="logs-list">
          <div
            v-for="(log, index) in results.data"
            :key="index"
            class="log-card"
            :class="{ 'log-card--expanded': isExpanded(index) }"
            :style="{ borderLeftColor: getLevelColor(log.level) }"
          >
            <div class="log-header" @click="toggleExpand(index)">
              <div class="log-header__info">
                <span class="log-level" :style="{ backgroundColor: getLevelColor(log.level) }">
                  {{ log.level || 'INFO' }}
                </span>
                <span class="log-timestamp">{{ formatDate(log.timestamp) }}</span>
              </div>
              <button class="expand-btn" :class="{ 'expand-btn--open': isExpanded(index) }">
                ▼
              </button>
            </div>

            <div class="log-body">
              <div class="log-meta">
                <div class="meta-item">
                  <span class="meta-label">CNPJ:</span>
                  <code>{{ log.cnpj || 'N/A' }}</code>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Tipo CND:</span>
                  <code>{{ log.tipo_cnd || 'N/A' }}</code>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Tipo de Erro:</span>
                  <code>{{ log.error_type || 'N/A' }}</code>
                </div>
              </div>

              <div class="log-message">
                <span class="message-label">MENSAGEM:</span>
                <p>{{ log.message || 'Sem mensagem' }}</p>
              </div>

              <!-- Expandable Content -->
              <div v-if="isExpanded(index)" class="log-details">
                <div v-if="log.error" class="detail-section">
                  <h4>Error:</h4>
                  <pre><code>{{ JSON.stringify(log.error, null, 2) }}</code></pre>
                </div>
                <div v-if="log.exception" class="detail-section">
                  <h4>Exception:</h4>
                  <pre><code>{{ JSON.stringify(log.exception, null, 2) }}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Node Logs -->
        <div v-if="isNodeLogs" class="logs-list">
          <div
            v-for="(log, index) in results.data"
            :key="index"
            class="log-card"
            :class="{ 'log-card--expanded': isExpanded(index) }"
            :style="{ borderLeftColor: getLevelColor(log.level) }"
          >
            <div class="log-header" @click="toggleExpand(index)">
              <div class="log-header__info">
                <span class="log-level" :style="{ backgroundColor: getLevelColor(log.level) }">
                  {{ log.level ? log.level.toUpperCase() : 'INFO' }}
                </span>
                <span class="log-timestamp">{{ formatDate(log.timestamp) }}</span>
              </div>
              <button class="expand-btn" :class="{ 'expand-btn--open': isExpanded(index) }">
                ▼
              </button>
            </div>

            <div class="log-body">
              <div class="log-meta">
                <div class="meta-item">
                  <span class="meta-label">Type:</span>
                  <code>{{ log.type || 'N/A' }}</code>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Path:</span>
                  <code>{{ log.path || 'N/A' }}</code>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Method:</span>
                  <code>{{ log.method || 'N/A' }}</code>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Status Code:</span>
                  <code>{{ log.statusCode || 'N/A' }}</code>
                </div>
              </div>

              <div class="log-message">
                <span class="message-label">MENSAGEM:</span>
                <p>{{ log.message || 'Sem mensagem' }}</p>
              </div>

              <!-- Expandable Content -->
              <div v-if="isExpanded(index)" class="log-details">
                <div v-if="log.stack" class="detail-section">
                  <h4>Stack Trace:</h4>
                  <pre><code>{{ log.stack }}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.devlogs-result-page {
  min-height: 100vh;
  background: #fff;
  padding: 2rem;
}

.page-header {
  max-width: 1000px;
  margin: 0 auto 2.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #000;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 2px solid #000;
  background: #fff;
  padding: 0.625rem 0.875rem;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.back-link:hover {
  background: #000;
  color: #fff;
  box-shadow: 4px 4px 0 #000;
  transform: translate(-2px, -2px);
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
  max-width: 1000px;
  margin: 0 auto;
}

/* Info Bar */
.info-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #000;
  background: #f9f9f9;
  margin-bottom: 1.5rem;
}

.info-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: #000;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 0;
}

.info-count {
  font-size: 0.9rem;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Empty State */
.empty-state {
  padding: 3rem 1rem;
  border: 2px dashed #ccc;
  text-align: center;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

/* Logs Container */
.logs-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  padding-right: 0.5rem;
}

.logs-container::-webkit-scrollbar {
  width: 8px;
}

.logs-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.logs-container::-webkit-scrollbar-thumb {
  background: #000;
  border-radius: 0;
}

.logs-container::-webkit-scrollbar-thumb:hover {
  background: #333;
}

/* Log Card */
.log-card {
  border: 2px solid #000;
  border-left: 5px solid #0066ff;
  background: #fff;
  border-radius: 0;
  overflow: hidden;
  transition: box-shadow 0.15s;
}

.log-card:hover {
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

/* Log Header */
.log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f9f9f9;
  border-bottom: 2px solid #000;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}

.log-header:hover {
  background: #efefef;
}

.log-header__info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.log-level {
  display: inline-block;
  padding: 0.375rem 0.625rem;
  background: #0066ff;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 0;
  flex-shrink: 0;
}

.log-timestamp {
  font-size: 0.8rem;
  color: #666;
  font-family: 'Courier New', monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expand-btn {
  background: none;
  border: none;
  font-size: 1rem;
  color: #000;
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s ease;
  font-weight: 700;
  flex-shrink: 0;
}

.expand-btn--open {
  transform: rotate(180deg);
}

/* Log Body */
.log-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.log-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
}

.meta-item code {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #000;
  background: #f5f5f5;
  padding: 0.375rem 0.5rem;
  border-radius: 0;
  word-break: break-all;
}

.log-message {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message-label {
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
}

.log-message p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #000;
  word-break: break-word;
}

/* Log Details (Expandable) */
.log-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #ccc;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-section h4 {
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
  margin: 0;
}

.detail-section pre {
  margin: 0;
  padding: 0.75rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 0;
  overflow-x: auto;
  font-size: 0.8rem;
  line-height: 1.4;
  font-family: 'Courier New', monospace;
  color: #000;
}

.detail-section code {
  word-break: break-word;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header h1 {
    font-size: 1.85rem;
  }

  .log-meta {
    grid-template-columns: 1fr;
  }

  .logs-container {
    max-height: none;
  }
}
</style>

