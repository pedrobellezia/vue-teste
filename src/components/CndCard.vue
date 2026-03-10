<script setup>
defineProps({
  cnd: {
    type: Object,
    required: true
  }
})

const API_URL = import.meta.env.VITE_API_URL

const isVencido = (dateString) => {
  return new Date(dateString) < new Date()
}

const getStatusColor = (status, validade) => {
  if (isVencido(validade)) return '#f97316'
  return status === 'regular' ? '#22c55e' : '#ef4444'
}

const getBadgeLabel = (status, validade) => {
  if (isVencido(validade)) return 'VENCIDA'
  return status.toUpperCase()
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3>CND {{ cnd.tipo.toUpperCase() }}</h3>
      <span
          class="status-badge"
          :style="{ backgroundColor: getStatusColor(cnd.status, cnd.validade) }"
      >
        {{ getBadgeLabel(cnd.status, cnd.validade) }}
      </span>
    </div>

    <div class="card-body">
      <div class="info-row">
        <span class="label">Emissão:</span>
        <span class="value">{{ formatDate(cnd.emissao) }}</span>
      </div>
      <div class="info-row">
        <span class="label">Validade:</span>
        <span class="value">
          {{ formatDate(cnd.validade) }}
        </span>
      </div>
    </div>

    <div class="card-footer">
      <a
          :href="`${API_URL}/public/${cnd.file_name}`"
          target="_blank"
          class="download-button"
      >
        Baixar PDF
      </a>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border: 2px solid #000;
  border-radius: 0;
  overflow: hidden;
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 8px 8px 0 #000;
  transform: translate(-4px, -4px);
}

.card-header {
  background: #000;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #000;
}

.card-header h3 {
  color: #fff;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.status-badge {
  padding: 0.4rem 1rem;
  border-radius: 0;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 2px solid #000;
}

.card-body {
  padding: 1.5rem;
  background: #fff;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #000;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  color: #000;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.value {
  color: #000;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.value.vencido {
  color: #ef4444;
  font-weight: 700;
}

.badge-vencido {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: #ef4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.card-footer {
  padding: 1.5rem;
  background: #fff;
  text-align: center;
  border-top: 2px solid #000;
}

.download-button {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.85rem;
  border: 2px solid #000;
  transition: all 0.2s ease;
}

.download-button:hover {
  background: #fff;
  color: #000;
}
</style>

