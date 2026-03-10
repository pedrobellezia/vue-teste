<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])

const cnpj = ref('')
const loading = ref(false)
const error = ref('')

const formatCNPJ = (value) => {
  const numbers = value.replace(/\D/g, '')
  return numbers
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18)
}

const handleInput = (event) => {
  cnpj.value = formatCNPJ(event.target.value)
}

const buscarFornecedor = () => {
  if (!cnpj.value) {
    error.value = 'Por favor, digite um CNPJ'
    return
  }

  const cnpjNumeros = cnpj.value.replace(/\D/g, '')

  if (cnpjNumeros.length !== 14) {
    error.value = 'CNPJ deve ter 14 dígitos'
    return
  }

  error.value = ''
  emit('search', cnpjNumeros)
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    buscarFornecedor()
  }
}

const setLoading = (value) => {
  loading.value = value
}

const setError = (message) => {
  error.value = message
}

defineExpose({ setLoading, setError })
</script>

<template>
  <div class="search-section">
    <p class="subtitle">Digite o CNPJ para consultar os dados do fornecedor</p>

    <div class="search-wrapper">
      <input
        type="text"
        v-model="cnpj"
        @input="handleInput"
        @keypress="handleKeyPress"
        placeholder="00.000.000/0000-00"
        class="search-input"
        :disabled="loading"
      />
      <button
        @click="buscarFornecedor"
        class="search-button"
        :disabled="loading"
      >
        {{ loading ? 'Buscando...' : 'Buscar' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.search-section {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 3rem 1rem;
}

h1 {
  color: #000;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.subtitle {
  color: #000;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  font-weight: 400;
}

.search-wrapper {
  display: flex;
  gap: 0.5rem;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  border: 2px solid #000;
  border-radius: 0;
  outline: none;
  background: #fff;
  color: #000;
  font-family: 'Courier New', monospace;
  font-weight: 500;
  transition: all 0.2s ease;
}

.search-input:focus {
  box-shadow: 4px 4px 0 #000;
  transform: translate(-2px, -2px);
}

.search-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-button {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  background: #000;
  border: 2px solid #000;
  border-radius: 0;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.search-button:hover:not(:disabled) {
  background: #fff;
  color: #000;
}

.search-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #000;
  color: #fff;
  border: 2px solid #000;
  border-radius: 0;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  display: inline-block;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .search-wrapper {
    flex-direction: column;
  }
}
</style>

