<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  cnpj: {
    type: String,
    required: true
  }
})

const formatCNPJ = (value) => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '')
  return numbers
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}
</script>

<template>
  <div class="fornecedor-info">
    <h2>{{ name }}</h2>
    <p class="cnpj-display">CNPJ: {{ formatCNPJ(cnpj) }}</p>
  </div>
</template>

<style scoped>
.fornecedor-info {
  background: white;
  padding: 2rem;
  border: 3px solid #000;
  border-radius: 0;
  margin-bottom: 2rem;
  text-align: center;
}

.fornecedor-info h2 {
  color: #000;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cnpj-display {
  color: #000;
  font-size: 1.2rem;
  font-weight: 400;
  font-family: 'Courier New', monospace;
}
</style>

