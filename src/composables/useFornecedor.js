import {ref} from 'vue'

const API_URL = import.meta.env.VITE_API_URL
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH

const normalizeFornecedor = (data) => {
    if (!data || typeof data !== 'object') return null

    return {
        cnpj: data.cnpj || '',
        name: data.name || data.nome || '',
        cnd: Array.isArray(data.cnd) ? data.cnd : [],
    }
}

export function useFornecedor() {
    const fornecedorData = ref(null)
    const loading = ref(false)
    const error = ref('')

    const buscarFornecedor = async (cnpj) => {
        loading.value = true
        error.value = ''
        fornecedorData.value = null

        try {
            const url = `${API_URL}${API_BASE_PATH}/${cnpj}?limit=1`

            const response = await fetch(url)
            const result = await response.json()

            if (!response.ok) {
                error.value = result?.error || `Erro ${response.status}: ${response.statusText}`
                return
            }

            if (result?.success && result?.data) {
                fornecedorData.value = normalizeFornecedor(result.data)
                if (!fornecedorData.value) {
                    error.value = 'Resposta inválida da API'
                }
                return
            }

            error.value = result?.error || 'Fornecedor não encontrado'
        } catch (err) {
            error.value = 'Erro ao buscar fornecedor: ' + err.message
        } finally {
            loading.value = false
        }
    }

    return {
        fornecedorData,
        loading,
        error,
        buscarFornecedor
    }
}

