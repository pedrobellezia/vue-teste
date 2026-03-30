import { ref } from 'vue'
import { useRouter } from 'vue-router'

const API_URL_PYTHON = import.meta.env.VITE_DEVLOGS_PYTHON || 'http://192.168.4.27:5049'
const API_URL_NODE = import.meta.env.VITE_API_URL || 'http://192.168.4.27:3030'
const PYTHON_AUTH_TOKEN = import.meta.env.VITE_PYTHON_AUTH_TOKEN || '_uldVm_WS9zfs80XNPuSf5ye4fXd7zkRi2M6_LNutQk'

export function useDevlogs() {
  const router = useRouter()
  const loading = ref(false)
  const error = ref(null)
  const results = ref(null)
  const selectedType = ref(null)

  const fetchPythonLogs = async (filters) => {
    loading.value = true
    error.value = null

    try {
      const payload = {
        tipo_cnd: filters.tipo_cnd?.filter(Boolean) || undefined,
        cnpj: filters.cnpj?.filter(Boolean) || undefined,
        error_type: filters.error_type?.filter(Boolean) || undefined,
        level: filters.level?.filter(Boolean) || undefined,
        init_date: filters.init_date || undefined,
        end_date: filters.end_date || undefined,
      }

      console.log('[Devlogs] Python - Enviando payload:', payload)

      const response = await fetch(`${API_URL_PYTHON}/devlogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PYTHON_AUTH_TOKEN}`,
        },
        body: JSON.stringify(payload),
      })

      console.log('[Devlogs] Python - Status:', response.status)

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('[Devlogs] Python - Resposta:', data)

      results.value = {
        type: 'python',
        data: Array.isArray(data) ? data : data.data || [],
        filters,
      }

      await router.push({ name: 'devlogs-results' })
    } catch (err) {
      console.error('[Devlogs] Python - Erro:', err)
      error.value = err.message || 'Erro ao buscar logs do Python'
      loading.value = false
    }
  }

  const fetchNodeLogs = async (filters) => {
    loading.value = true
    error.value = null

    try {
      const payload = {
        level: filters.level?.filter(Boolean) || [],
        type: filters.type?.filter(Boolean) || [],
        path: filters.path?.filter(Boolean) || [],
        statusCode: filters.statusCode?.filter(Boolean) || [],
        method: filters.method?.filter(Boolean) || [],
        init_date: filters.init_date || '',
        end_date: filters.end_date || '',
      }

      console.log('[Devlogs] Node - Enviando payload:', payload)

      const response = await fetch(`${API_URL_NODE}/devlogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('[Devlogs] Node - Status:', response.status)

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('[Devlogs] Node - Resposta:', data)

      results.value = {
        type: 'node',
        data: Array.isArray(data) ? data : data.data || [],
        filters,
      }

      await router.push({ name: 'devlogs-results' })
    } catch (err) {
      console.error('[Devlogs] Node - Erro:', err)
      error.value = err.message || 'Erro ao buscar logs do Node'
      loading.value = false
    }
  }

  const submitFilters = async (filters, type) => {
    console.log(`[Devlogs] Submetendo filtros para ${type}:`, filters)

    if (type === 'python') {
      await fetchPythonLogs(filters)
    } else if (type === 'node') {
      await fetchNodeLogs(filters)
    }

    loading.value = false
  }

  const clearResults = () => {
    results.value = null
    error.value = null
    selectedType.value = null
  }

  return {
    loading,
    error,
    results,
    selectedType,
    submitFilters,
    clearResults,
  }
}

