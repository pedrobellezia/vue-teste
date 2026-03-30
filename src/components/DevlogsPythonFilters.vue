<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const cnpjInputs = ref([''])
const tipoCndInputs = ref([''])
const errorTypeInputs = ref([''])
const selectedLevels = ref([])
const initDate = ref('')
const endDate = ref('')

const levels = ['INFO', 'WARN', 'ERROR']

const addCnpj = () => {
  cnpjInputs.value.push('')
}

const removeCnpj = (index) => {
  cnpjInputs.value.splice(index, 1)
}

const addTipoCnd = () => {
  tipoCndInputs.value.push('')
}

const removeTipoCnd = (index) => {
  tipoCndInputs.value.splice(index, 1)
}

const addErrorType = () => {
  errorTypeInputs.value.push('')
}

const removeErrorType = (index) => {
  errorTypeInputs.value.splice(index, 1)
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
    cnpj: cnpjInputs.value,
    tipo_cnd: tipoCndInputs.value,
    error_type: errorTypeInputs.value,
    level: selectedLevels.value,
    init_date: initDate.value,
    end_date: endDate.value,
  }

  console.log('[DevlogsPythonFilters] Enviando:', filters)
  emit('submit', filters)
}

const resetFilters = () => {
  cnpjInputs.value = ['']
  tipoCndInputs.value = ['']
  errorTypeInputs.value = ['']
  selectedLevels.value = []
  initDate.value = ''
  endDate.value = ''
}
</script>

<template>
  <div class="filters-form">
    <!-- CNPJ -->
    <div class="form-group">
      <label class="form-label">CNPJ (Opcional)</label>
      <div class="dynamic-inputs">
        <div v-for="(cnpj, index) in cnpjInputs" :key="`cnpj-${index}`" class="input-row">
          <input
            v-model="cnpjInputs[index]"
            type="text"
            class="form-input"
            placeholder="Digite um CNPJ"
          />
          <button
            v-if="cnpjInputs.length > 1"
            type="button"
            class="btn-remove"
            @click="removeCnpj(index)"
          >
            ✕
          </button>
        </div>
      </div>
      <button type="button" class="btn-add" @click="addCnpj">+ Adicionar CNPJ</button>
    </div>

    <!-- Tipo CND -->
    <div class="form-group">
      <label class="form-label">Tipo CND (Opcional)</label>
      <div class="dynamic-inputs">
        <div v-for="(tipo, index) in tipoCndInputs" :key="`tipo-${index}`" class="input-row">
          <input
            v-model="tipoCndInputs[index]"
            type="text"
            class="form-input"
            placeholder="Digite um tipo"
          />
          <button
            v-if="tipoCndInputs.length > 1"
            type="button"
            class="btn-remove"
            @click="removeTipoCnd(index)"
          >
            ✕
          </button>
        </div>
      </div>
      <button type="button" class="btn-add" @click="addTipoCnd">+ Adicionar Tipo CND</button>
    </div>

    <!-- Error Type -->
    <div class="form-group">
      <label class="form-label">Tipo de Erro (Opcional)</label>
      <div class="dynamic-inputs">
        <div v-for="(error, index) in errorTypeInputs" :key="`error-${index}`" class="input-row">
          <input
            v-model="errorTypeInputs[index]"
            type="text"
            class="form-input"
            placeholder="Digite um tipo de erro"
          />
          <button
            v-if="errorTypeInputs.length > 1"
            type="button"
            class="btn-remove"
            @click="removeErrorType(index)"
          >
            ✕
          </button>
        </div>
      </div>
      <button type="button" class="btn-add" @click="addErrorType">+ Adicionar Tipo de Erro</button>
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
          <span>{{ level }}</span>
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

