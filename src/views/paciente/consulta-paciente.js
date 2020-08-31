import React from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import PacienteTable from './pacienteTable'
import PacienteService from '../../app/service/pacienteService'
import LocalStorageService from '../../app/service/localstorageService'

import * as messages from '../../components/toastr'

import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';



class ConsultaPaciente extends React.Component {

    state = {
        nome: '',
        status: '',
        showConfirmDialog: false,
        pacienteDeletar: {},
        pacientes : []
    }

    constructor(){
        super();
        this.service = new PacienteService();
    }

    buscar = () => {
        if(!this.state.nome){
            messages.mensagemErro('O preenchimento do campo Nome é obrigatório.')
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const pacienteFiltro = {
            nome: this.state.nome,
            usuario: usuarioLogado.id
        }

        this.service
            .consultar(pacienteFiltro)
            .then( resposta => {
                const lista = resposta.data;
                
                if(lista.length < 1){
                    messages.mensagemAlert("Nenhum resultado encontrado.");
                }
                this.setState({ pacientes: lista })
            }).catch( error => {
                console.log(error)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-paciente/${id}`)
    }

    abrirConfirmacao = (paciente) => {
        this.setState({ showConfirmDialog : true, pacienteDeletar: paciente  })
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog : false, pacienteDeletar: {}  })
    }

    deletar = () => {
        this.service
            .deletar(this.state.pacienteDeletar.id)
            .then(response => {
                const pacientes = this.state.pacientes;
                const index = pacientes.indexOf(this.state.pacienteDeletar)
                pacientes.splice(index, 1);
                this.setState( { pacientes: pacientes, showConfirmDialog: false } )
                messages.mensagemSucesso('Paciente deletado com sucesso!')
            }).catch(error => {
                messages.mensagemErro('Ocorreu um erro ao tentar deletar o Paciente')
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-paciente')
    }

    alterarStatus = (paciente, status) => {
        this.service
            .alterarStatus(paciente.id, status)
            .then( response => {
                const pacientes = this.state.pacientes;
                const index = pacientes.indexOf(paciente);
                if(index !== -1){
                    paciente['status'] = status;
                    pacientes[index] = paciente
                    this.setState({paciente});
                }
                messages.mensagemSucesso("Status atualizado com sucesso!")
            })
    }

    render(){
        const meses = this.service.obterListaMeses();

        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} 
                        className="p-button-secondary" />
            </div>
        );

        return (
            <Card title="Consulta Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">

                            <FormGroup htmlFor="inputNome" label="Nome: ">
                                <input type="text" 
                                       className="form-control" 
                                       id="inputNome" 
                                       value={this.state.nome}
                                       onChange={e => this.setState({nome: e.target.value})}
                                       placeholder="Digite o Nome" />
                            </FormGroup>

                            <button onClick={this.buscar} 
                                    type="button" 
                                    className="btn btn-success">
                                    <i className="pi pi-search"></i> Buscar
                            </button>
                            <button onClick={this.preparaFormularioCadastro} 
                                    type="button" 
                                    className="btn btn-danger">
                                    <i className="pi pi-plus"></i> Cadastrar
                            </button>

                        </div>
                        
                    </div>
                </div>   
                <br/ >
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <PacienteTable  pacientes={this.state.pacientes} 
                                            deleteAction={this.abrirConfirmacao}
                                            editAction={this.editar}
                                            alterarStatus={this.alterarStatus} />
                        </div>
                    </div>  
                </div> 
                <div>
                    <Dialog header="Confirmação" 
                            visible={this.state.showConfirmDialog} 
                            style={{width: '50vw'}}
                            footer={confirmDialogFooter} 
                            modal={true} 
                            onHide={() => this.setState({showConfirmDialog: false})}>
                        Confirma a exclusão deste Paciente?
                    </Dialog>
                </div>           
            </Card>

        )
    }
}

export default withRouter(ConsultaPaciente);