import React from 'react'
import currencyFormatter from 'currency-formatter'

export default props => {

    const rows = props.pacientes.map( paciente => {
        return (
            <tr key={paciente.id}>
                <td>{paciente.nome}</td>
                <td>{paciente.status}</td>
                <td>
                    <button className="btn btn-success" title="ATIVAR"
                            disabled={ paciente.status !== 'INATIVO' }
                            onClick={e => props.alterarStatus(paciente, 'ATIVO')} 
                            type="button">
                            <i className="pi pi-check"></i>
                    </button>
                    <button className="btn btn-warning"  title="INATIVAR"
                            disabled={ paciente.status !== 'ATIVO' }
                            onClick={e => props.alterarStatus(paciente, 'INATIVO')} 
                            type="button">
                            <i className="pi pi-times"></i>
                    </button>
                    <button type="button"   title="Editar"
                            className="btn btn-primary"
                            onClick={e => props.editAction(paciente.id)}>
                            <i className="pi pi-pencil"></i>
                    </button>
                    <button type="button"  title="Excluir"
                            className="btn btn-danger" 
                            onClick={ e => props.deleteAction(paciente)}>
                            <i className="pi pi-trash"></i>
                    </button>
                </td>
            </tr>
        )
    } )

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Nome</th>                    
                    <th scope="col">Status</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}