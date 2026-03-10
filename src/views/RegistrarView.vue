<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const files = ref([])
const isDragging = ref(false)
const status = ref(null) // null | 'loading' | 'success' | 'error'
const errorMsg = ref('')
const fileInput = ref(null)

function onFileChange(event) {
  addFiles(event.target.files)
}

function onDrop(event) {
  isDragging.value = false
  addFiles(event.dataTransfer.files)
}

function addFiles(fileList) {
  const newFiles = Array.from(fileList)
  const existing = new Set(files.value.map((f) => f.name + f.size))
  newFiles.forEach((f) => {
    if (!existing.has(f.name + f.size)) {
      files.value.push(f)
    }
  })
}

function removeFile(index) {
  files.value.splice(index, 1)
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

async function enviar() {
  if (files.value.length === 0) return

  status.value = 'loading'
  errorMsg.value = ''

  const formData = new FormData()
  files.value.forEach((file) => {
    formData.append('file', file)
    console.log('[enviar] Arquivo adicionado ao FormData:', file.name, file.size, file.type)
  })

  const url = `${API_URL}/cnd`
  console.log('[enviar] URL alvo:', url)
  console.log('[enviar] API_URL:', API_URL)

  try {
    console.log('[enviar] Iniciando fetch...')
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    console.log('[enviar] Resposta recebida — status:', response.status, response.statusText)

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }

    status.value = 'success'
    files.value = []
  } catch (err) {
    console.error('[enviar] Erro no fetch:', err)
    console.error('[enviar] Mensagem:', err.message)
    status.value = 'error'
    errorMsg.value = err.message
  }
}

function resetStatus() {
  status.value = null
  errorMsg.value = ''
}
</script>

<template>
  <div class="registrar-page">
    <div class="page-header">
      <RouterLink to="/" class="back-link">← Voltar</RouterLink>
      <h1>Registrar CND</h1>
    </div>

    <div class="container">
      <!-- Drop Zone -->
      <div
        class="drop-zone"
        :class="{ 'drop-zone--active': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
        @click="fileInput.click()"
      >
        <input
          ref="fileInput"
          type="file"
          multiple
          class="file-input"
          @change="onFileChange"
        />
        <p class="drop-zone__text">CLIQUE OU ARRASTE OS ARQUIVOS AQUI</p>
        <p class="drop-zone__hint">Suporta múltiplos arquivos</p>
      </div>

      <!-- File List -->
      <div v-if="files.length > 0" class="file-list">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="file-item"
        >
          <div class="file-item__info">
            <span class="file-item__name">{{ file.name }}</span>
            <span class="file-item__size">{{ formatSize(file.size) }}</span>
          </div>
          <button class="file-item__remove" @click="removeFile(index)">✕</button>
        </div>
      </div>

      <!-- Feedback -->
      <div v-if="status === 'success'" class="feedback feedback--success">
        <span>DOCUMENTOS ENVIADOS COM SUCESSO</span>
        <button class="feedback__close" @click="resetStatus">✕</button>
      </div>

      <div v-if="status === 'error'" class="feedback feedback--error">
        <span>{{ errorMsg }}</span>
        <button class="feedback__close" @click="resetStatus">✕</button>
      </div>

      <!-- Submit -->
      <button
        class="btn-enviar"
        :disabled="files.length === 0 || status === 'loading'"
        @click="enviar"
      >
        <span v-if="status === 'loading'" class="spinner" />
        <span v-else>
          {{ files.length > 0 ? `ENVIAR (${files.length})` : 'ENVIAR' }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.registrar-page {
  min-height: 100vh;
  background: #fff;
  padding: 2rem;
}

.page-header {
  max-width: 600px;
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

h1 {
  color: #000;
  font-size: 2.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Drop Zone */
.drop-zone {
  border: 2px solid #000;
  border-radius: 0;
  padding: 3.5rem 2rem;
  text-align: center;
  cursor: pointer;
  background: #fff;
  transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
}

.drop-zone:hover,
.drop-zone--active {
  background: #000;
  box-shadow: 6px 6px 0 #000;
  transform: translate(-3px, -3px);
}

.drop-zone:hover .drop-zone__text,
.drop-zone:hover .drop-zone__hint,
.drop-zone--active .drop-zone__text,
.drop-zone--active .drop-zone__hint {
  color: #fff;
}

.file-input {
  display: none;
}

.drop-zone__text {
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #000;
  margin-bottom: 0.35rem;
  transition: color 0.15s;
}

.drop-zone__hint {
  font-size: 0.8rem;
  color: #000;
  font-weight: 400;
  transition: color 0.15s;
}

/* File List */
.file-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 2px solid #000;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #000;
  background: #fff;
}

.file-item:last-child {
  border-bottom: none;
}

.file-item__info {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  min-width: 0;
}

.file-item__name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Courier New', monospace;
}

.file-item__size {
  font-size: 0.75rem;
  color: #000;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.file-item__remove {
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  margin-left: 0.5rem;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}

.file-item__remove:hover {
  background: #000;
  color: #fff;
}

/* Feedback */
.feedback {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  border: 2px solid #000;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.feedback--success {
  background: #000;
  color: #fff;
}

.feedback--error {
  background: #fff;
  color: #000;
}

.feedback__close {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0 0.25rem;
  margin-left: 1rem;
  flex-shrink: 0;
}

.feedback--success .feedback__close {
  color: #fff;
}

.feedback--error .feedback__close {
  color: #000;
}

/* Submit Button */
.btn-enviar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  padding: 1rem 1.5rem;
  background: #000;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 2px solid #000;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-enviar:hover:not(:disabled) {
  background: #fff;
  color: #000;
  box-shadow: 6px 6px 0 #000;
  transform: translate(-3px, -3px);
}

.btn-enviar:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
