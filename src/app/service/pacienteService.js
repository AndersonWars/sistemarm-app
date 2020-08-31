import ApiService from '../apiservice'

import ErroValidacao from '../exception/ErroValidacao'

export default class PacienteService extends ApiService {

    constructor(){
        super('/api/pacientes')
    }

    obterListaMeses(){
        return  [
            { label: 'Selecione...', value: '' },
            { label: 'Janeiro', value: 1 },
            { label: 'Fevereiro', value: 2 },
            { label: 'Março', value: 3 },
            { label: 'Abril', value: 4 },
            { label: 'Maio', value: 5 },
            { label: 'Junho', value: 6 },
            { label: 'Julho', value: 7 },
            { label: 'Agosto', value: 8 },
            { label: 'Setembro', value: 9 },
            { label: 'Outubro', value: 10 },
            { label: 'Novembro', value: 11 },
            { label: 'Dezembro', value: 12 },
        ]
    }

    obterPorId(id){
        return this.get(`/${id}`);
    }

    alterarStatus(id, status){
        return this.put(`/${id}/atualiza-status`, { status })
    }

    validar(paciente){
        const erros = [];

        if(!paciente.nome){
            erros.push("Informe o nome.")
        }

        if(erros && erros.length > 0){
            throw new ErroValidacao(erros);
        }
    }

    salvar(paciente){
        return this.post('/', paciente);
    }

    atualizar(paciente){
        return this.put(`/${paciente.id}`, paciente);
    }

    consultar(pacienteFiltro){
        let params = `?nome=${pacienteFiltro.nome}`

        if(pacienteFiltro.status){
            params = `${params}&status=${pacienteFiltro.status}`
        }

        if(pacienteFiltro.usuario){
            params = `${params}&usuario=${pacienteFiltro.usuario}`
        }

        return this.get(params);
    }

    deletar(id){
        return this.delete(`/${id}`)
    }
}