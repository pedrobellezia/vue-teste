import {ref} from 'vue'

const API_URL = import.meta.env.VITE_API_URL
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH

export function useFornecedor() {
    const fornecedorData = ref(null)
    const loading = ref(false)
    const error = ref('')

    const buscarFornecedor = async (cnpj) => {
        loading.value = true
        error.value = ''
        fornecedorData.value = null

        try {
            // Monta a URL completa usando as variáveis de ambiente
            const url = `${API_URL}${API_BASE_PATH}/${cnpj}?limit=1`

            const response = await fetch(url)

            const result = await response.json()

            if (result.success) {
                fornecedorData.value = result.data
            } else {
                error.value = 'Fornecedor não encontrado'
            }
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

