import React, { useState, useEffect } from "react";
import "../estilos/Checkout.css";

const Checkout = () => {
  // Dados de exemplo - endereços do usuário
  const enderecos = [
    {
      id: 1,
      apelido: 'Casa',
      logradouro: 'Rua das Flores, 123',
      complemento: 'Apto 101',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01001-000',
      principal: true
    },
    {
      id: 2,
      apelido: 'Trabalho',
      logradouro: 'Av. Paulista, 1000',
      complemento: 'Sala 502',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-000',
      principal: false
    },
    {
      id: 3,
      apelido: 'Casa de Praia',
      logradouro: 'Rua do Sol, 500',
      complemento: '',
      bairro: 'Praia do Canto',
      cidade: 'Vitória',
      estado: 'ES',
      cep: '29055-010',
      principal: false
    }
  ];

  return (
    <div className="enderecoContainer">
      <div className="enderecoFormContainer">
        <h1 className="enderecoTitulo">Selecione o endereço de entrega</h1>
        
        <div className="enderecoLista">
          {enderecos.map((endereco) => (
            <div 
              key={endereco.id} 
              className={`enderecoItem ${endereco.principal ? 'principal' : ''}`}
            >
              <div className="enderecoRadio">
                <input 
                  type="radio" 
                  id={`endereco-${endereco.id}`}
                  name="enderecoEntrega" 
                  defaultChecked={endereco.principal}
                />
                <label htmlFor={`endereco-${endereco.id}`}></label>
              </div>
              
              <div className="enderecoInfo">
                <h3>
                  {endereco.apelido} 
                  {endereco.principal && <span className="enderecoTag">Principal</span>}
                </h3>
                <p>{endereco.logradouro}, {endereco.complemento}</p>
                <p>{endereco.bairro}, {endereco.cidade} - {endereco.estado}</p>
                <p>CEP: {endereco.cep}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="enderecoBtnPrimario">
          Confirmar Endereço Selecionado
        </button>

        <button className="enderecoBtnSecundario">
          Adicionar Novo Endereço
        </button>
      </div>
    </div>
  );
};

export default Checkout;