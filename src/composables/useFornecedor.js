import {ref} from 'vue'

const API_URL = import.meta.env.VITE_API_URL
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH

console.log('[useFornecedor] Composable inicializado')
console.log('[useFornecedor] API_URL:', API_URL)
console.log('[useFornecedor] API_BASE_PATH:', API_BASE_PATH)

export function useFornecedor() {
    console.log('[useFornecedor] Instância criada')

    const fornecedorData = ref(null)
    const loading = ref(false)
    const error = ref('')

    const buscarFornecedor = async (cnpj) => {
        console.log('[useFornecedor] buscarFornecedor chamado com CNPJ:', cnpj)
        loading.value = true
        error.value = ''
        fornecedorData.value = null

        try {
            // Monta a URL completa usando as variáveis de ambiente
            const url = `${API_URL}${API_BASE_PATH}/${cnpj}?limit=1`
            console.log('[useFornecedor] URL da requisição:', url)

            console.log('[useFornecedor] Iniciando fetch...')
            const response = await fetch(url)
            console.log('[useFornecedor] Resposta recebida - status:', response.status, response.statusText)

            const result = await response.json()
            console.log('[useFornecedor] Resultado parseado:', result)

            if (result.success) {
                console.log('[useFornecedor] Sucesso! Dados do fornecedor:', result.data)
                fornecedorData.value = result.data
            } else {
                console.log('[useFornecedor] Fornecedor não encontrado')
                error.value = 'Fornecedor não encontrado'
            }
        } catch (err) {
            console.error('[useFornecedor] Erro na busca:', err)
            console.error('[useFornecedor] Mensagem de erro:', err.message)
            error.value = 'Erro ao buscar fornecedor: ' + err.message
        } finally {
            loading.value = false
            console.log('[useFornecedor] buscarFornecedor finalizado')
        }
    }

    return {
        fornecedorData,
        loading,
        error,
        buscarFornecedor
    }
}

