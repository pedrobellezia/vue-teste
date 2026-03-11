<script setup>
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'
import FornecedorInfo from '@/components/FornecedorInfo.vue'
import CndCard from '@/components/CndCard.vue'
import { useFornecedor } from '@/composables/useFornecedor'

const searchBarRef = ref(null)
const { fornecedorData, loading, error, buscarFornecedor } = useFornecedor()

const handleSearch = async (cnpj) => {
  searchBarRef.value.setLoading(true)
  await buscarFornecedor(cnpj)
  searchBarRef.value.setLoading(false)

  if (error.value) {
    searchBarRef.value.setError(error.value)
  }
}

watch(loading, (newValue) => {
  if (searchBarRef.value) {
    searchBarRef.value.setLoading(newValue)
  }
})
</script>

<template>
  <div class="consultar-page">
    <div class="container">
      <header class="page-header">
        <RouterLink to="/" class="back-link">← Voltar</RouterLink>
        <h1>Consulta de Cnd's</h1>
      </header>

      <SearchBar ref="searchBarRef" @search="handleSearch" />

      <div v-if="fornecedorData" class="results-section">
        <FornecedorInfo
          :name="fornecedorData.name"
          :cnpj="fornecedorData.cnpj"
        />

        <div class="cards-container">
          <CndCard
            v-for="(cnd, index) in fornecedorData.cnd"
            :key="index"
            :cnd="cnd"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.consultar-page {
  min-height: 100vh;
  background: #fff;
  padding: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  max-width: 600px;
  margin: 0 auto 1rem;
  text-align: center;
  position: relative;
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
  position: absolute;
  left: 0;
  top: 0;
}

.back-link:hover {
  border-bottom-color: #000;
}

.page-header h1 {
  color: #000;
  font-size: 2.5rem;
  margin: 0;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding-top: 2.5rem;
}


.results-section {
  margin-top: 2rem;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
  }
}
</style>
