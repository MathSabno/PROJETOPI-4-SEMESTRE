import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import { } from "react-router-dom";
import "../../estilos/alterarDadosCliente.css";

const AlterarDadosCliente = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const location = useLocation();
    const userId = location.state?.userId;
    const userNome = location.state?.userNome;


    const [cliente, setCliente] = useState({
        nomeCompleto: "",
        dataNascimento: "",
        genero: null,
        enderecosEntrega: []
    });

    const [enderecoPadraoIndex, setEnderecoPadraoIndex] = useState(0);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        const carregarDadosCliente = async () => {
            try {
                setCarregando(true);
                const clientes = await authService.listarClientes();
                const clienteEncontrado = clientes.find(c => c.id === parseInt(id));

                if (!clienteEncontrado) {
                    throw new Error("Cliente não encontrado");
                }

                console.log("Dados do cliente:", clienteEncontrado);

                const enderecos = clienteEncontrado.enderecosEntrega || [];
                const padraoIndex = enderecos.findIndex(e => e.isPadrao) || 0;

                setCliente({
                    nomeCompleto: clienteEncontrado.name,
                    dataNascimento: clienteEncontrado.dt_Nascimento?.split('T')[0] || "",
                    genero: clienteEncontrado.genero || null,
                    enderecosEntrega: enderecos
                });
                setEnderecoPadraoIndex(padraoIndex);
            } catch (error) {
                setErro(error.message || "Erro ao carregar dados do cliente");
            } finally {
                setCarregando(false);
            }
        };

        if (id) carregarDadosCliente();
        else setErro("ID do cliente não encontrado");
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const valorFinal = name === 'genero'
            ? (value === "" ? null : parseInt(value))
            : value;

        setCliente(prev => ({ ...prev, [name]: valorFinal }));
    };

    const handleEnderecoEntregaChange = (index, e) => {
        const endereco = cliente.enderecosEntrega[index];
        if (endereco.id) return;

        const { name, value } = e.target;
        const newEnderecos = [...cliente.enderecosEntrega];
        newEnderecos[index] = { ...newEnderecos[index], [name]: value };
        setCliente(prev => ({ ...prev, enderecosEntrega: newEnderecos }));
    };

    const buscarCep = async (cep, index) => {
        const endereco = cliente.enderecosEntrega[index];
        if (endereco.id) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) throw new Error("CEP não encontrado");

            const newEnderecos = [...cliente.enderecosEntrega];
            newEnderecos[index] = {
                ...newEnderecos[index],
                logradouro: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                uf: data.uf
            };
            setCliente(prev => ({ ...prev, enderecosEntrega: newEnderecos }));
        } catch (error) {
            setErro("CEP inválido ou não encontrado");
        }
    };

    const adicionarEnderecoEntrega = () => {
        setCliente(prev => ({
            ...prev,
            enderecosEntrega: [
                ...prev.enderecosEntrega,
                { cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "" }
            ]
        }));
    };

    const removerEnderecoEntrega = (index) => {
        if (cliente.enderecosEntrega.length <= 1) {
            setErro("É necessário ter pelo menos um endereço");
            return;
        }
        const newEnderecos = cliente.enderecosEntrega.filter((_, i) => i !== index);
        setCliente(prev => ({ ...prev, enderecosEntrega: newEnderecos }));
    };

    const validarFormulario = () => {
        if (!cliente.nomeCompleto.trim()) return "O nome completo é obrigatório";
        if (cliente.genero && ![1, 2, 3].includes(cliente.genero)) return "Selecione um gênero válido";
        if (cliente.novaSenha && cliente.novaSenha.length < 6) return "A senha deve ter pelo menos 6 caracteres";
        if (cliente.novaSenha !== cliente.confirmarSenha) return "As senhas não coincidem";

        // Valida novos endereços
        for (const [index, endereco] of cliente.enderecosEntrega.entries()) {
            if (!endereco.id) { // Apenas valida novos endereços
                if (!endereco.cep || !endereco.logradouro || !endereco.numero ||
                    !endereco.bairro || !endereco.cidade || !endereco.uf) {
                    return "Preencha todos os campos obrigatórios dos novos endereços";
                }
            }
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setMensagem("");

        const erroValidacao = validarFormulario();
        if (erroValidacao) return setErro(erroValidacao);

        setCarregando(true);

        try {
            const dadosAtualizacao = {
                Id: parseInt(id),
                NomeCompleto: cliente.nomeCompleto,
                DataNascimento: cliente.dataNascimento || null,
                Genero: cliente.genero,
                EnderecosEntrega: cliente.enderecosEntrega.map((endereco, index) => ({
                    ...endereco,
                    IsPadrao: index === enderecoPadraoIndex
                }))
            };

            await authService.atualizarCliente(dadosAtualizacao);
            setMensagem("Dados atualizados com sucesso!");
            setTimeout(() => navigate("/listagem-de-produtos-logado", {
                state: {
                    userNome: userNome,
                    userId: userId
                }
            }), 2000);
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Erro ao atualizar dados");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="dadosContainer">
            <div className="dadosFormContainer">
                <h1 className="titulo">Alterar Meus Dados</h1>
                <form onSubmit={handleSubmit} className="form">
                    {/* Dados Pessoais */}
                    <div className="formSection">
                        <h2>Dados Pessoais</h2>
                        <div className="formGroup">
                            <label>Nome Completo *</label>
                            <input
                                type="text"
                                name="nomeCompleto"
                                value={cliente.nomeCompleto}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="formGroup">
                            <label>Data de Nascimento</label>
                            <input
                                type="date"
                                name="dataNascimento"
                                value={cliente.dataNascimento || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="formGroup">
                            <label>Gênero</label>
                            <select
                                name="genero"
                                value={cliente.genero || ""}
                                onChange={handleChange}
                            >
                                <option value="">Selecione</option>
                                <option value="1">Masculino</option>
                                <option value="2">Feminino</option>
                                <option value="3">Outro</option>
                            </select>
                        </div>
                    </div>
                    {/* Endereços de Entrega */}
                    <div className="formSection">
                        <h2>Endereços de Entrega</h2>
                        {cliente.enderecosEntrega.map((endereco, index) => (
                            <div key={index} className={`enderecoEntregaGroup ${endereco.id ? 'enderecoExistente' : ''}`}>
                                <h3>Endereço {index + 1} {endereco.id && "(Existente)"}</h3>

                                <div className="formGroup">
                                    <label>CEP</label>
                                    <input
                                        name="cep"
                                        value={endereco.cep}
                                        onChange={(e) => handleEnderecoEntregaChange(index, e)}
                                        onBlur={(e) => buscarCep(e.target.value, index)}
                                        readOnly={!!endereco.id}
                                    />
                                </div>

                                {['logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'uf'].map((campo) => (
                                    <div className="formGroup" key={campo}>
                                        <label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
                                        <input
                                            name={campo}
                                            value={endereco[campo]}
                                            onChange={(e) => handleEnderecoEntregaChange(index, e)}
                                            readOnly={!!endereco.id}
                                        />
                                    </div>
                                ))}

                                {cliente.enderecosEntrega.length > 1 && (
                                    <div className="formGroup">
                                        <label>
                                            <input
                                                type="radio"
                                                name="enderecoPadrao"
                                                checked={enderecoPadraoIndex === index}
                                                onChange={() => setEnderecoPadraoIndex(index)}
                                            />
                                            Endereço Padrão
                                        </label>
                                    </div>
                                )}

                                {cliente.enderecosEntrega.length > 1 && !endereco.id && (
                                    <button
                                        type="button"
                                        onClick={() => removerEnderecoEntrega(index)}
                                        className="botaooRemover"
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={adicionarEnderecoEntrega}
                            className="botoes"
                        >
                            Adicionar Novo Endereço
                        </button>
                        <button className="botoes" type="submit" disabled={carregando}>
                            {carregando ? "Salvando..." : "Salvar Alterações"}
                        </button>
                        <button className="botaooRemover" onClick={() => navigate("/listagem-de-produtos-logado", {
                            state: {
                                userNome: userNome,
                                userId: userId
                            }
                        })}>
                            Voltar
                        </button>
                    </div>
                </form>

                {erro && <p className="erro">{erro}</p>}
                {mensagem && <p className="mensagem">{mensagem}</p>}


            </div>
        </div>
    );
};

export default AlterarDadosCliente;