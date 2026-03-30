<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const typeInputs = ref([''])
const pathInputs = ref([''])
const methodInputs = ref([''])
const statusCodeInputs = ref([''])
const selectedLevels = ref([])
const initDate = ref('')
const endDate = ref('')

const levels = ['info', 'warn', 'error']

const addType = () => {
  typeInputs.value.push('')
}

const removeType = (index) => {
  typeInputs.value.splice(index, 1)
}

const addPath = () => {
  pathInputs.value.push('')
}

const removePath = (index) => {
  pathInputs.value.splice(index, 1)
}

const addMethod = () => {
  methodInputs.value.push('')
}

const removeMethod = (index) => {
  methodInputs.value.splice(index, 1)
}

const addStatusCode = () => {
  statusCodeInputs.value.push('')
}

const removeStatusCode = (index) => {
  statusCodeInputs.value.splice(index, 1)
}

const toggleLevel = (level) => {
  const idx = selectedLevels.value.indexOf(level)
  if (idx === -1) {
    selectedLevels.value.push(level)
  } else {
    selectedLevels.value.splice(idx, 1)
  }
}

const handleSubmit = () => {
  const filters = {
    type: typeInputs.value,
    path: pathInputs.value,
    method: methodInputs.value,
    statusCode: statusCodeInputs.value.map(code => {
      const num = parseInt(code, 10)
      return isNaN(num) ? null : num
    }).filter(Boolean),
    level: selectedLevels.value,
    init_date: initDate.value,
    end_date: endDate.value,
  }

  console.log('[DevlogsNodeFilters] Enviando:', filters)
  emit('submit', filters)
}

const resetFilters = () => {
  typeInputs.value = ['']
  pathInputs.value = ['']
  methodInputs.value = ['']
  statusCodeInputs.value = ['']
  selectedLevels.value = []
  initDate.value = ''
  endDate.value = ''
}
</script>

<template>
  <div class="filters-form">
    <!-- Type -->
    <div class="form-group">
      <label class="form-label">Tipo (Opcional)</label>
      <div class="dynamic-inputs">
        <div v-for="(type, index) in typeInputs" :key="`type-${index}`" class="input-row">
          <input
            v-model="typeInputs[index]"
            type="text"
            class="form-input"
            placeholder="Digite um tipo"
          />
          <button
            v-if="typeInputs.length > 1"
            type="button"
            class="btn-remove"
            @click="removeType(index)"
          >
            ✕
          </button>
        </div>
      </div>
      <button type="button" class="btn-add" @click="addType">+ Adicionar Tipo</button>
    </div>

    <!-- Path -->
    <div class="form-group">
      <label class="form-label">Caminho (Opcional)</label>
      <div class="dynamic-inputs">
        <div v-for="(path, index) in pathInputs" :key="`path-${index}`" class="input-row">
          <input
            v-model="pathInputs[index]"
            type="text"
            class="form-input"
            placeholder="ex: /cnd, /fornecedor"
          />
          <button
            v-if="pathInputs.length > 1"
            type="button"
            class="btn-remove"
            @click="removePath(index)"
          >
            ✕
          </button>
        </div>
      </div>
      <button type="button" class="btn-add" @click="addPath">+ Adicionar Caminho</button>
    </div>

    <!-- Method -->
    <div class="form-group">
      <label class="form-label">Método HTTP (Opcional)</label>
      <div class="dynamic-inputs">
        <div v-for="(method, index) in methodInputs" :key="`method-${index}`" class="input-row">
          <input
            v-model="methodInputs[index]"
            type="text"
            class="form-input"
            placeholder="ex: GET, POST, PUT"
          />
          <button
            v-if="methodInputs.length > 1"
            type="button"
            class="btn-remove"
            @click="removeMethod(index)"
          >
            ✕
          </button>
        </div>
      </div>
      <button type="button" class="btn-add" @click="addMethod">+ Adicionar Método</button>
    </div>

    <!-- Status Code -->
    <div class="form-group">
      <label class="form-label">Código de Status (Opcional)</label>
      <div class="dynamic-inputs">
        <div v-for="(code, index) in statusCodeInputs" :key="`status-${index}`" class="input-row">
          <input
            v-model="statusCodeInputs[index]"
            type="number"
            class="form-input"
            placeholder="ex: 200, 404, 500"
          />
          <button
            v-if="statusCodeInputs.length > 1"
            type="button"
            class="btn-remove"
            @click="removeStatusCode(index)"
          >
            ✕
          </button>
        </div>
      </div>
      <button type="button" class="btn-add" @click="addStatusCode">+ Adicionar Status Code</button>
    </div>

    <!-- Level -->
    <div class="form-group">
      <label class="form-label">Nível (Opcional)</label>
      <div class="checkbox-group">
        <label v-for="level in levels" :key="level" class="checkbox-label">
          <input
            type="checkbox"
            :checked="selectedLevels.includes(level)"
            @change="toggleLevel(level)"
            class="checkbox-input"
          />
          <span>{{ level.toUpperCase() }}</span>
        </label>
      </div>
    </div>

    <!-- Dates -->
    <div class="date-group">
      <div class="form-group">
        <label class="form-label">Data Inicial (Opcional)</label>
        <input v-model="initDate" type="date" class="form-input" />
      </div>
      <div class="form-group">
        <label class="form-label">Data Final (Opcional)</label>
        <input v-model="endDate" type="date" class="form-input" />
      </div>
    </div>

    <!-- Buttons -->
    <div class="form-actions">
      <button type="button" class="btn-reset" @click="resetFilters">
        LIMPAR FILTROS
      </button>
      <button
        type="button"
        class="btn-submit"
        :disabled="loading"
        @click="handleSubmit"
      >
        <span v-if="loading" class="spinner"></span>
        <span v-else>BUSCAR LOGS</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.filters-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #000;
}

.dynamic-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.form-input {
  flex: 1;
  padding: 0.625rem 0.75rem;
  border: 1px solid #000;
  border-radius: 0;
  font-size: 0.9rem;
  font-family: inherit;
  background: #fff;
  color: #000;
  transition: border-color 0.15s;
}

.form-input:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.btn-remove {
  padding: 0.625rem 0.75rem;
  border: 1px solid #ff4444;
  background: #fff;
  color: #ff4444;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.btn-remove:hover {
  background: #ff4444;
  color: #fff;
}

.btn-add {
  padding: 0.5rem 0.75rem;
  border: 1px solid #000;
  background: #fff;
  color: #000;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s;
  align-self: flex-start;
}

.btn-add:hover {
  background: #000;
  color: #fff;
}

/* Checkboxes */
.checkbox-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #000;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #000;
}

/* Dates */
.date-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Actions */
.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-reset {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #666;
  background: #fff;
  color: #666;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-reset:hover {
  background: #666;
  color: #fff;
  box-shadow: 4px 4px 0 #666;
  transform: translate(-2px, -2px);
}

.btn-submit {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.875rem 1rem;
  border: 2px solid #000;
  background: #000;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-submit:hover:not(:disabled) {
  background: #fff;
  color: #000;
  box-shadow: 4px 4px 0 #000;
  transform: translate(-2px, -2px);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .date-group {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>

