"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const oracledb = __importStar(require("oracledb"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
dotenv_1.default.config();
app.use(express_1.default.json());
const oraConnAttribs = async () => {
    const connection = await oracledb.getConnection({ user: "bd150923124", password: "Gchlp9", connectionString: "172.16.12.14/xe" });
    console.log("Successfully connected to Oracle Database");
    return connection;
};
function rowsToAeronaves(oracleRows) {
    let aeronaves = [];
    let aeronave;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            aeronave = {
                codigo: registro.CODIGO,
                fabricante: registro.FABRICANTE,
                modelo: registro.MODELO,
                anoFabricacao: registro.ANO_FABRICACAO,
                totalAssentos: registro.TOTAL_ASSENTOS,
                referencia: registro.REFERENCIA,
            };
            aeronaves.push(aeronave);
        });
    }
    return aeronaves;
}
;
function rowsToVoos(oracleRows) {
    let voos = [];
    let voo;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            voo = {
                codigo: registro.CODIGO,
                trecho: registro.TRECHO,
                escalas: registro.ESCALAS,
                valor: registro.VALOR_PASSAGEM,
                dataSaida: registro.DATA_SAIDA,
                horaSaida: registro.HORA_SAIDA,
                dataChegada: registro.DATA_CHEGADA,
                horaChegada: registro.HORA_CHEGADA,
                dataVolta: registro.DATA_VOLTA,
                horaVolta: registro.HORA_VOLTA,
                dataChegada2: registro.DATA_CHEGADA2,
                horaChegada2: registro.HORA_CHEGADA2,
            };
            voos.push(voo);
        });
    }
    return voos;
}
;
function rowsToTrechos(oracleRows) {
    let trechos = [];
    let trecho;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            trecho = {
                codigo: registro.CODIGO,
                nome: registro.NOME,
                origem: registro.ORIGEM,
                destino: registro.DESTINO,
                aeronave: registro.AERONAVE,
                estilo_voo: registro.ESTILO_VOO,
            };
            trechos.push(trecho);
        });
    }
    return trechos;
}
;
function rowsToAeroportos(oracleRows) {
    let aeroportos = [];
    let aeroporto;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            aeroporto = {
                codigo: registro.CODIGO,
                nome: registro.NOME,
                sigla: registro.SIGLA,
                cidade: registro.CIDADE,
                pais: registro.PAIS,
            };
            aeroportos.push(aeroporto);
        });
    }
    return aeroportos;
}
;
// FUNÇÕES DE VALIDAÇÃO
function aeronaveValida(aero) {
    let valida = false;
    let mensagem = "";
    if (aero.marca === undefined) {
        mensagem = "Fabricante não informado";
    }
    if (aero.marca !== 'Embraer' && aero.marca !== 'Airbus' && aero.marca !== 'Boeing') {
        mensagem = "Fabricante deve ser: Embraer, Airbus ou Boeing.";
    }
    if (aero.modelo === undefined) {
        mensagem = "Modelo não informado.";
    }
    if (aero.qtdeAssentos === undefined) {
        mensagem = "Total de assentos não informado.";
    }
    if ((aero.qtdeAssentos !== undefined) && (aero.qtdeAssentos < 100 || aero.qtdeAssentos > 526)) {
        mensagem = "Total de assentos é inválido.";
    }
    if (aero.strAnoFab === undefined) {
        mensagem = "Ano de fabricação não informado.";
    }
    if ((aero.strAnoFab !== undefined) && (aero.strAnoFab < 1990 || aero.strAnoFab > 2026)) {
        mensagem = "Ano de fabricação deve ser entre 1990 e 2026.";
    }
    if (aero.referencia === undefined) {
        mensagem = "Referência da aeronave não fornecida.";
    }
    console.log("Validação de aeronave - Fabricante:", aero.marca);
    console.log("Validação de aeronave - Modelo:", aero.modelo);
    console.log("Validação de aeronave - Ano de Fabricação:", aero.strAnoFab);
    console.log("Validação de aeronave - Referência:", aero.referencia);
    console.log("Validação de aeronave - Assentos:", aero.qtdeAssentos);
    if (mensagem === "") {
        valida = true;
    }
    else {
        console.log("Erro de validação:", mensagem);
    }
    return [valida, mensagem];
}
function trechoValido(trecho) {
    let valida = false;
    let mensagem = "";
    if (trecho.nome === undefined) {
        mensagem = "Nome não informado";
    }
    if (trecho.origem === undefined) {
        mensagem = "Origem não informada.";
    }
    if (trecho.destino === undefined) {
        mensagem = "Destino não informado.";
    }
    if (trecho.aeronave === undefined) {
        mensagem = "Aeronave não informada.";
    }
    if (trecho.estilo_voo === undefined) {
        mensagem = "Aeronave não informada.";
    }
    console.log("Validação de trecho - Nome:", trecho.nome);
    console.log("Validação de trecho - Origem:", trecho.origem);
    console.log("Validação de trecho - Destino:", trecho.destino);
    console.log("Validação de trecho - Aeronave:", trecho.aeronave);
    console.log("Validação de trecho - Estilo Voo:", trecho.estilo_voo);
    if (mensagem === "") {
        valida = true;
    }
    else {
        console.log("Erro de validação:", mensagem);
    }
    return [valida, mensagem];
}
function vooValido(voo) {
    let valida = true;
    let mensagens = [];
    if (voo.trecho === undefined) {
        mensagens.push("Trecho não informada.");
        valida = false;
    }
    if (voo.escalas === undefined) {
        mensagens.push("Número de escalas não fornecido.");
        valida = false;
    }
    if (voo.valor === undefined) {
        mensagens.push("Valor da passagem não informado.");
        valida = false;
    }
    if (voo.dataSaida === undefined) {
        mensagens.push("Data de saída não informada.");
        valida = false;
    }
    if (voo.horaSaida === undefined) {
        mensagens.push("Hora de saída não informada.");
        valida = false;
    }
    if (voo.dataChegada === undefined) {
        mensagens.push("Data de chegada não informada.");
        valida = false;
    }
    if (voo.horaChegada === undefined) {
        mensagens.push("Hora de chegada não informada.");
        valida = false;
    }
    if (voo.dataVolta === undefined && voo.dataVolta === "") {
        mensagens.push("Data de volta não informada.");
        valida = false;
    }
    if (voo.horaVolta === undefined && voo.horaVolta === "") {
        mensagens.push("Hora de volta não informada.");
        valida = false;
    }
    if (voo.dataChegada2 === undefined && voo.dataChegada2 === "") {
        mensagens.push("Data de chegada da volta do voo não informada.");
        valida = false;
    }
    if (voo.horaChegada2 === undefined && voo.horaChegada2 === "") {
        mensagens.push("Hora de chegada da volta do voo não informada.");
        valida = false;
    }
    console.log("Validação de voo - Aeronave:", voo.trecho);
    console.log("Validação de voo - Escalas:", voo.escalas);
    console.log("Validação de voo - Valor da Passagem:", voo.valor);
    console.log("Validação de voo - Data de Saida:", voo.dataSaida);
    console.log("Validação de voo - Hora de Saida:", voo.horaSaida);
    console.log("Validação de voo - Data de Chegada:", voo.dataChegada);
    console.log("Validação de voo - Hora de Chegada:", voo.horaChegada);
    console.log("Validação de voo - Data de Chegada:", voo.dataVolta);
    console.log("Validação de voo - Hora de Chegada:", voo.horaVolta);
    console.log("Validação de voo - Data de Chegada:", voo.dataChegada2);
    console.log("Validação de voo - Hora de Chegada:", voo.horaChegada2);
    if (mensagens.length > 0) {
        console.log("Erro de validação:", mensagens);
    }
    return [valida, mensagens.join(" ")];
}
function aeroportoValido(aeroporto) {
    let valida = false;
    let mensagem = "";
    if (aeroporto.nome === undefined) {
        mensagem = "Nome não informado";
    }
    if (aeroporto.sigla === undefined) {
        mensagem = "Sigla não informada.";
    }
    if (aeroporto.cidade === undefined) {
        mensagem = "Cidade não informada.";
    }
    if (aeroporto.pais === undefined) {
        mensagem = "Pais não informado.";
    }
    console.log("Validação de aeroporto - Nome:", aeroporto.nome);
    console.log("Validação de aeroporto - Sigla:", aeroporto.sigla);
    console.log("Validação de aeroporto - Cidade:", aeroporto.cidade);
    console.log("Validação de aeroporto - Pais:", aeroporto.pais);
    if (mensagem === "") {
        valida = true;
    }
    else {
        console.log("Erro de validação:", mensagem);
    }
    return [valida, mensagem];
}
// FUNÇÕES DO SISTEMA
app.post("/comprarAssentos", async (req, res) => {
    console.log("Iniciando a função no backend");
    const assentos = req.body.assentos;
    console.log("Assentos recebidos:", assentos);
    let connection;
    try {
        connection = await oraConnAttribs();
        console.log("Conexão com Oracle estabelecida");
        for (let i = 0; i < assentos.length; i++) {
            console.log(`Inserindo assento ${i + 1}/${assentos.length}`);
            const assento = assentos[i];
            const cmdInsertAssento = `
        INSERT INTO INDISPONIVEIS (CODIGO, CODIGO_VOO, NUMERO_ASSENTO) 
        VALUES (INDISPONIVEIS_SEQ.NEXTVAL, :codigo, :assento)
        RETURNING CODIGO INTO :codigo_out`;
            const dados = {
                codigo: { val: assento.codigo, type: oracledb.STRING },
                assento: { val: assento.assento, type: oracledb.NUMBER, dir: oracledb.BIND_INOUT },
                codigo_out: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            };
            try {
                console.log("Chamando execute para o assento:", assento);
                const result = await connection.execute(cmdInsertAssento, dados, { autoCommit: true });
                if (result.rowsAffected && result.rowsAffected === 1) {
                    console.log(`Assento ${i + 1} inserido com sucesso`);
                }
                else {
                    console.log(`Erro durante a inserção do assento ${i + 1}. Nenhuma linha afetada.`);
                    res.send({
                        status: "ERROR",
                        message: `Erro durante a inserção do assento ${i + 1}.`
                    });
                    return;
                }
            }
            catch (error) {
                console.error(`Erro durante a inserção do assento ${i + 1}:`, error);
                res.send({
                    status: "ERROR",
                    message: `Erro durante a inserção do assento ${i + 1}.`
                });
                return;
            }
        }
        await connection.commit();
        console.log("Assentos comprados com sucesso");
        res.send({
            status: "SUCCESS",
            message: "Assentos comprados com sucesso."
        });
    }
    catch (error) {
        console.error("Erro ao conectar ao Oracle:", error);
        res.send({
            status: "ERROR",
            message: "Erro ao conectar ao Oracle. Detalhes do erro indisponíveis."
        });
    }
    finally {
        if (connection) {
            console.log("Fechando conexão com Oracle");
            await connection.close();
        }
    }
});
app.post("/buscarAssentosOcupados", async (req, res) => {
    console.log('Corpo da requisição:', req.body);
    const { codigoVoo, outrasInformacoes } = req.body;
    let cr = {
        status: "ERROR",
        message: "",
        payload: { assentosOcupados: [] },
    };
    try {
        let connection;
        try {
            connection = await oraConnAttribs();
            const cmdBuscarAssentosOcupados = `SELECT NUMERO_ASSENTO FROM INDISPONIVEIS WHERE CODIGO_VOO = :1`;
            const resultAssentos = await connection.execute(cmdBuscarAssentosOcupados, [codigoVoo], { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true });
            cr.payload = {
                assentosOcupados: resultAssentos.rows || [],
            };
            cr.status = "SUCCESS";
            cr.message = "Assentos ocupados encontrados.";
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.error(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
            }
        }
        finally {
            if (connection) {
                try {
                    await connection.close();
                }
                catch (closeError) {
                    console.error("Error closing Oracle connection:", closeError);
                }
            }
        }
    }
    catch (error) {
        console.error("Outer error:", error);
        cr.message = "Erro ao processar a solicitação.";
    }
    finally {
        return res.send(cr);
    }
});
app.post("/buscarTotalAssentos", async (req, res) => {
    var _a;
    console.log('Corpo da requisição:', req.body);
    const { codigoVoo, outrasInformacoes } = req.body;
    let cr = {
        status: "ERROR",
        message: "",
        payload: { totalAssentos: undefined },
    };
    try {
        let connection;
        try {
            connection = await oraConnAttribs();
            const cmdBuscarTotalAssentos = `
        SELECT TOTAL_ASSENTOS
        FROM AERONAVES
        WHERE CODIGO IN (
          SELECT AERONAVE
          FROM TRECHOS
          WHERE CODIGO IN (
            SELECT TRECHO
            FROM VOOS
            WHERE CODIGO = :1
          )
        )`;
            const resultTotalAssentos = await connection.execute(cmdBuscarTotalAssentos, [codigoVoo], { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true });
            const totalAssentosRow = ((_a = resultTotalAssentos.rows) === null || _a === void 0 ? void 0 : _a[0]) || {};
            cr.payload = {
                totalAssentos: totalAssentosRow.TOTAL_ASSENTOS || undefined,
            };
            cr.status = "SUCCESS";
            cr.message = "Total de assentos encontrados.";
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.error(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
            }
        }
        finally {
            if (connection) {
                try {
                    await connection.close();
                }
                catch (closeError) {
                    console.error("Error closing Oracle connection:", closeError);
                }
            }
        }
    }
    catch (error) {
        console.error("Outer error:", error);
        cr.message = "Erro ao processar a solicitação.";
    }
    finally {
        return res.send(cr);
    }
});
app.post("/buscarVoo", async (req, res) => {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const busca = req.body;
    let error;
    if (busca.volta === undefined) {
        try {
            let connection;
            try {
                connection = await oraConnAttribs();
                const cmdBuscarVoo = `
        SELECT
        V.CODIGO AS Codigo_Voo,
        V.ESCALAS,
        SAIDA.NOME AS Aeroporto_Saida,
        V.HORA_SAIDA,
        V.DATA_SAIDA,
        DESTINO.NOME AS Aeroporto_Destino,
        V.HORA_CHEGADA,
        V.DATA_CHEGADA,
        V.VALOR_PASSAGEM
        FROM
            VOOS V
        JOIN
            TRECHOS T ON V.TRECHO = T.CODIGO
        JOIN
            AEROPORTOS SAIDA ON T.ORIGEM = SAIDA.CODIGO
        JOIN
            AEROPORTOS DESTINO ON T.DESTINO = DESTINO.CODIGO
        WHERE
            SAIDA.CIDADE = :1
            AND DESTINO.CIDADE = :2
            AND V.DATA_SAIDA = :3`;
                const dados = [
                    busca.partida,
                    busca.destino,
                    busca.ida,
                ];
                console.log("Voo de Ida encontrado");
                const result = (await connection.execute(cmdBuscarVoo, dados, { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }));
                if (result.rows && result.rows.length > 0) {
                    cr.status = "SUCCESS";
                    cr.message = "Voos encontrados.";
                    cr.payload = result.rows;
                }
                else {
                    cr.message = "Nenhum voo encontrado para a cidade de destino e data de saída fornecidas.";
                }
            }
            catch (e) {
                if (e instanceof Error) {
                    cr.message = e.message;
                    console.log(e.message);
                }
                else {
                    cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
                }
                error = e;
            }
            finally {
                if (connection) {
                    try {
                        await connection.close();
                    }
                    catch (closeError) {
                        console.error("Error closing Oracle connection:", closeError);
                        error = closeError;
                    }
                }
            }
        }
        catch (e) { }
        if (error) {
            console.error("Outer error:", error);
            cr.message = "Erro ao processar a solicitação.";
        }
        else {
            return res.send(cr);
        }
    }
    else {
        try {
            let connection;
            try {
                connection = await oraConnAttribs();
                const cmdBuscarVoo = `
        SELECT
          V.CODIGO AS Codigo_Voo,
          V.ESCALAS,
          SAIDA.NOME AS Aeroporto_Saida,
          V.HORA_SAIDA,
          V.DATA_SAIDA,
          DESTINO.NOME AS Aeroporto_Destino,
          V.HORA_CHEGADA,
          V.DATA_CHEGADA,
          V.VALOR_PASSAGEM,
          V.DATA_VOLTA,
          V.HORA_VOLTA,
          V.DATA_CHEGADA2,
          V.HORA_CHEGADA2
        FROM
            VOOS V
        JOIN
            TRECHOS T ON V.TRECHO = T.CODIGO
        JOIN
            AEROPORTOS SAIDA ON T.ORIGEM = SAIDA.CODIGO
        JOIN
            AEROPORTOS DESTINO ON T.DESTINO = DESTINO.CODIGO
        WHERE
            SAIDA.CIDADE = :1
            AND DESTINO.CIDADE = :2
            AND V.DATA_SAIDA = :3
            AND V.DATA_VOLTA = :4`;
                const dados = [
                    busca.partida,
                    busca.destino,
                    busca.ida,
                    busca.volta,
                ];
                console.log("Voo de Ida e Volta encontrado");
                const result = (await connection.execute(cmdBuscarVoo, dados, { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }));
                console.log(result);
                if (result.rows && result.rows.length > 0) {
                    cr.status = "SUCCESS";
                    cr.message = "Voos encontrados.";
                    cr.payload = result.rows;
                }
                else {
                    cr.message = "Nenhum voo encontrado para a cidade de destino e data de saída fornecidas.";
                }
            }
            catch (e) {
                if (e instanceof Error) {
                    cr.message = e.message;
                    console.log(e.message);
                }
                else {
                    cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
                }
                error = e;
            }
            finally {
                if (connection) {
                    try {
                        await connection.close();
                    }
                    catch (closeError) {
                        console.error("Error closing Oracle connection:", closeError);
                        error = closeError;
                    }
                }
            }
        }
        catch (e) { }
        if (error) {
            console.error("Outer error:", error);
            cr.message = "Erro ao processar a solicitação.";
        }
        else {
            return res.send(cr);
        }
    }
});
app.post("/obterTrechoListado", async (req, res) => {
    console.log('Corpo da requisição:', req.body);
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const trecho = req.body;
    try {
        let connection;
        try {
            connection = await oraConnAttribs();
            const cmdBuscarTrecho = `
        SELECT * FROM TRECHOS WHERE CODIGO = :1`;
            const dados = [
                trecho.codigo,
            ];
            console.log('Consulta SQL:', cmdBuscarTrecho, ' com dados:', dados);
            const result = (await connection.execute(cmdBuscarTrecho, dados, { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }));
            if (result.rows && result.rows.length > 0) {
                cr.status = "SUCCESS";
                cr.message = "Trecho encontrado.";
                cr.payload = result.rows;
            }
            else {
                cr.message = "Nenhum trecho encontrado.";
            }
        }
        catch (e) {
            if (e instanceof Error) {
                cr.message = e.message;
                console.error(e.message);
            }
            else {
                cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
            }
        }
        finally {
            if (connection) {
                try {
                    await connection.close();
                }
                catch (closeError) {
                    console.error("Error closing Oracle connection:", closeError);
                }
            }
        }
    }
    catch (error) {
        console.error("Outer error:", error);
        cr.message = "Erro ao processar a solicitação.";
    }
    finally {
        return res.send(cr);
    }
});
// CRUDS
app.post("/incluirAeronave", async (req, res) => {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const aero = req.body;
    let error;
    try {
        let [valida, mensagem] = aeronaveValida(aero);
        if (!valida) {
            cr.message = mensagem;
            return res.send(cr);
        }
        else {
            let connection;
            try {
                connection = await oraConnAttribs();
                const cmdInsertAssento = `INSERT INTO AERONAVES 
        (CODIGO, FABRICANTE, MODELO, ANO_FABRICACAO, TOTAL_ASSENTOS, REFERENCIA)
        VALUES
        (AERONAVES_SEQ.NEXTVAL, :1, :2, :3, :4, :5)`;
                const dados = [
                    aero.marca,
                    aero.modelo,
                    aero.strAnoFab,
                    aero.qtdeAssentos,
                    aero.referencia,
                ];
                console.log("Dados a serem inseridos:", dados);
                const result = await connection.execute(cmdInsertAssento, dados, { autoCommit: true });
                console.log("Resultado do execute:", result);
                if (result.rowsAffected === 1) {
                    cr.status = "SUCCESS";
                    cr.message = "Aeronave inserida.";
                }
            }
            catch (e) {
                if (e instanceof Error) {
                    cr.message = e.message;
                    console.log(e.message);
                }
                else {
                    cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
                }
                error = e;
            }
            finally {
                if (connection) {
                    try {
                        await connection.close();
                    }
                    catch (closeError) {
                        console.error("Error closing Oracle connection:", closeError);
                        error = closeError;
                    }
                }
            }
        }
    }
    catch (e) { }
    if (error) {
        console.error("Outer error:", error);
    }
    else {
        return res.send(cr);
    }
});
app.get("/listarAeronave", async (req, res) => {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = await oraConnAttribs();
        let resultadoConsulta = await connection.execute(`SELECT * FROM AERONAVES`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = rowsToAeronaves(resultadoConsulta.rows);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (err) {
                console.error("Error closing Oracle connection:", err);
            }
        }
        res.send(cr);
    }
});
app.post("/alterarAeronave", async (req, res) => {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const aero = req.body;
    let [valida, mensagem] = aeronaveValida(aero);
    if (!valida) {
        cr.message = mensagem;
        return res.status(400).send(cr);
    }
    let connection;
    try {
        connection = await oraConnAttribs();
        const cmdUpdateAero = `UPDATE AERONAVES
    SET FABRICANTE = :fabricante,
        MODELO = :modelo,
        ANO_FABRICACAO = :ano_fabricacao,
        TOTAL_ASSENTOS = :total_assentos,
        REFERENCIA = :referencia
    WHERE CODIGO = :codigo`;
        const dados = {
            fabricante: aero.marca,
            modelo: aero.modelo,
            ano_fabricacao: aero.strAnoFab,
            total_assentos: aero.qtdeAssentos,
            referencia: aero.referencia,
            codigo: aero.codigo,
        };
        const result = await connection.execute(cmdUpdateAero, dados, { autoCommit: true });
        if (result.rowsAffected === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeronave alterada.";
            return res.send(cr);
        }
        else {
            cr.message = "Nenhuma aeronave foi alterada. Verifique o código fornecido.";
            return res.status(404).send(cr);
        }
    }
    catch (e) {
        cr.message = `Erro ao alterar aeronave: ${e.message}`;
        console.error(`Erro ao alterar aeronave: ${e.message}`);
        return res.status(500).send(cr);
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (closeError) {
                console.error("Erro ao fechar a conexão:", closeError);
            }
        }
    }
});
app.delete("/excluirAeronave", async (req, res) => {
    const codigo = req.body.codigo;
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = await oraConnAttribs();
        const cmdDeleteAero = `DELETE FROM AERONAVES WHERE CODIGO = :1`;
        const dados = [codigo];
        const result = await connection.execute(cmdDeleteAero, dados, {
            autoCommit: true,
        });
        if (result.rowsAffected === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeronave excluída.";
        }
        else {
            cr.message = "Aeronave não excluída. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (e) {
                console.error("Error closing Oracle connection:", e);
            }
        }
        res.send(cr);
    }
});
app.post("/incluirTrecho", async (req, res) => {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const trecho = req.body;
    let error;
    try {
        let [valida, mensagem] = trechoValido(trecho);
        if (!valida) {
            cr.message = mensagem;
            return res.send(cr);
        }
        else {
            let connection;
            try {
                connection = await oraConnAttribs();
                const cmdInsertAero = `INSERT INTO TRECHOS
        (CODIGO, NOME, ORIGEM, DESTINO, AERONAVE, ESTILO_VOO)
        VALUES
        (TRECHOS_SEQ.NEXTVAL, :1, :2, :3, :4, :5)`;
                const dados = [
                    trecho.nome,
                    trecho.origem,
                    trecho.destino,
                    trecho.aeronave,
                    trecho.estilo_voo,
                ];
                const result = await connection.execute(cmdInsertAero, dados, { autoCommit: true, });
                if (result.rowsAffected === 1) {
                    cr.status = "SUCCESS";
                    cr.message = "Trecho inserida.";
                }
            }
            catch (e) {
                if (e instanceof Error) {
                    cr.message = e.message;
                    console.log(e.message);
                }
                else {
                    cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
                }
                error = e;
            }
            finally {
                if (connection) {
                    try {
                        await connection.close();
                    }
                    catch (closeError) {
                        console.error("Error closing Oracle connection:", closeError);
                        error = closeError;
                    }
                }
            }
        }
    }
    catch (e) { }
    if (error) {
        console.error("Outer error:", error);
    }
    else {
        return res.send(cr);
    }
});
app.get("/listarTrecho", async (req, res) => {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = await oraConnAttribs();
        let resultadoConsulta = await connection.execute(`SELECT * FROM TRECHOS`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = rowsToTrechos(resultadoConsulta.rows);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (err) {
                console.error("Error closing Oracle connection:", err);
            }
        }
        res.send(cr);
    }
});
app.post("/alterarTrecho", async (req, res) => {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const trecho = req.body;
    let [valida, mensagem] = trechoValido(trecho);
    if (!valida) {
        cr.message = mensagem;
        return res.status(400).send(cr);
    }
    let connection;
    try {
        connection = await oraConnAttribs();
        const cmdUpdateTrecho = `UPDATE TRECHOS
      SET NOME = :nome,
          ORIGEM = :origem,
          DESTINO = :destino,
          AERONAVE = :aeronave,
          ESTILO_VOO = :estilo_voo
      WHERE CODIGO = :codigo`;
        const dados = {
            nome: trecho.nome,
            origem: trecho.origem,
            destino: trecho.destino,
            aeronave: trecho.aeronave,
            estilo_voo: trecho.estilo_voo,
            codigo: trecho.codigo,
        };
        const result = await connection.execute(cmdUpdateTrecho, dados, { autoCommit: true });
        if (result.rowsAffected === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeronave alterada.";
            return res.send(cr);
        }
        else {
            cr.message = "Nenhuma aeronave foi alterada. Verifique o código fornecido.";
            return res.status(404).send(cr);
        }
    }
    catch (e) {
        cr.message = `Erro ao alterar aeronave: ${e.message}`;
        console.error(`Erro ao alterar aeronave: ${e.message}`);
        return res.status(500).send(cr);
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (closeError) {
                console.error("Erro ao fechar a conexão:", closeError);
            }
        }
    }
});
app.delete("/excluirTrecho", async (req, res) => {
    const codigo = req.body.codigo;
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = await oraConnAttribs();
        const cmdDeleteAero = `DELETE FROM TRECHOS WHERE CODIGO = :1`;
        const dados = [codigo];
        const result = await connection.execute(cmdDeleteAero, dados, {
            autoCommit: true,
        });
        if (result.rowsAffected === 1) {
            cr.status = "SUCCESS";
            cr.message = "Trecho excluída.";
        }
        else {
            cr.message = "Trecho não excluída. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (e) {
                console.error("Error closing Oracle connection:", e);
            }
        }
        res.send(cr);
    }
});
app.post("/incluirVoo", async (req, res) => {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const voo = req.body;
    try {
        console.log("Received Voo:", voo);
        let [valida, mensagem] = vooValido(voo);
        if (!valida) {
            cr.message = mensagem;
            return res.send(cr);
        }
        else {
            let connection;
            try {
                connection = await oraConnAttribs();
                const cmdInsertVoo = `INSERT INTO VOOS
          (CODIGO, TRECHO, ESCALAS, VALOR_PASSAGEM, DATA_SAIDA, HORA_SAIDA, DATA_CHEGADA, HORA_CHEGADA, DATA_VOLTA, HORA_VOLTA, DATA_CHEGADA2, HORA_CHEGADA2)
          VALUES
          (VOOS_SEQ.NEXTVAL, :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11)`;
                const dados = [
                    voo.trecho,
                    voo.escalas,
                    voo.valor,
                    voo.dataSaida,
                    voo.horaSaida,
                    voo.dataChegada,
                    voo.horaChegada,
                    voo.dataVolta,
                    voo.horaVolta,
                    voo.dataChegada2,
                    voo.horaChegada2,
                ];
                const result = await connection.execute(cmdInsertVoo, dados, { autoCommit: true });
                if (result.rowsAffected === 1) {
                    cr.status = "SUCCESS";
                    cr.message = "Voo inserido.";
                }
            }
            catch (e) {
                console.error("Error during database operation:", e);
                cr.message = "Erro ao conectar ao Oracle. Detalhes: " + (e.message || e.toString());
            }
            finally {
                if (connection) {
                    try {
                        await connection.close();
                    }
                    catch (closeError) {
                        console.error("Error closing Oracle connection:", closeError);
                    }
                }
            }
        }
    }
    catch (e) {
        console.error("Outer error:", e);
    }
    return res.send(cr);
});
app.get("/listarVoo", async (req, res) => {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = await oraConnAttribs();
        let resultadoConsulta = await connection.execute(`SELECT * FROM VOOS`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = rowsToVoos(resultadoConsulta.rows);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (err) {
                console.error("Error closing Oracle connection:", err);
            }
        }
        res.send(cr);
    }
});
app.post("/incluirAeroporto", async (req, res) => {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const aeroporto = req.body;
    let error;
    try {
        let [valida, mensagem] = aeroportoValido(aeroporto);
        if (!valida) {
            cr.message = mensagem;
            return res.send(cr);
        }
        else {
            let connection;
            try {
                connection = await oraConnAttribs();
                const cmdInsertAeroportos = `INSERT INTO AEROPORTOS
        (CODIGO, NOME, SIGLA, CIDADE, PAIS)
        VALUES
        (AEROPORTOS_SEQ.NEXTVAL, :1, :2, :3, :4)`;
                const dados = [
                    aeroporto.nome,
                    aeroporto.sigla,
                    aeroporto.cidade,
                    aeroporto.pais,
                ];
                const result = await connection.execute(cmdInsertAeroportos, dados, { autoCommit: true, });
                if (result.rowsAffected === 1) {
                    cr.status = "SUCCESS";
                    cr.message = "Aeroporto inserido.";
                }
            }
            catch (e) {
                if (e instanceof Error) {
                    cr.message = e.message;
                    console.log(e.message);
                }
                else {
                    cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
                }
                error = e;
            }
            finally {
                if (connection) {
                    try {
                        await connection.close();
                    }
                    catch (closeError) {
                        console.error("Error closing Oracle connection:", closeError);
                        error = closeError;
                    }
                }
            }
        }
    }
    catch (e) { }
    if (error) {
        console.error("Outer error:", error);
    }
    else {
        return res.send(cr);
    }
});
app.post("/alterarVoo", async (req, res) => {
    console.log("Recebendo solicitação para /alterarVoo");
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const voo = req.body;
    let [valida, mensagem] = vooValido(voo);
    if (!valida) {
        cr.message = mensagem;
        return res.status(400).send(cr);
    }
    let connection;
    try {
        connection = await oraConnAttribs();
        const cmdUpdateVoo = `UPDATE VOOS
    SET TRECHO = :trecho,
        ESCALAS = :escalas,
        VALOR_PASSAGEM = :valor,
        DATA_SAIDA = :dataSaida,
        HORA_SAIDA = :horaSaida,
        DATA_CHEGADA = :dataChegada,
        HORA_CHEGADA = :horaChegada,
        DATA_VOLTA = :dataVolta,
        HORA_VOLTA = :horaVolta,
        DATA_CHEGADA2 = :dataChegada2,
        HORA_CHEGADA2 = :horaChegada2
    WHERE CODIGO = :codigo`;
        const dados = [
            voo.trecho,
            voo.escalas,
            voo.valor,
            voo.dataSaida,
            voo.horaSaida,
            voo.dataChegada,
            voo.horaChegada,
            voo.dataVolta,
            voo.horaVolta,
            voo.dataChegada2,
            voo.horaChegada2,
            voo.codigo,
        ];
        const result = await connection.execute(cmdUpdateVoo, dados, { autoCommit: true });
        if (result.rowsAffected === 1) {
            cr.status = "SUCCESS";
            cr.message = "Voo alterado.";
            return res.send(cr);
        }
        else {
            cr.message = "Nenhum voo foi alterado. Verifique o código fornecido.";
            return res.status(404).send(cr);
        }
    }
    catch (e) {
        cr.message = `Erro ao alterar voo: ${e.message}`;
        console.error(`Erro ao alterar voo: ${e.message}`);
        return res.status(500).send(cr);
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (closeError) {
                console.error("Erro ao fechar a conexão:", closeError);
            }
        }
    }
});
app.delete("/excluirVoo", async (req, res) => {
    const codigo = req.body.codigo;
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = await oraConnAttribs();
        const cmdDeleteVoo = `DELETE FROM VOOS WHERE CODIGO = :1`;
        const dadosDeleteVoo = [codigo];
        const result = await connection.execute(cmdDeleteVoo, dadosDeleteVoo, {
            autoCommit: true,
        });
        if (result.rowsAffected === 1) {
            cr.status = "SUCCESS";
            cr.message = "Voo excluído.";
        }
        else {
            cr.message = "Voo não excluída. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (e) {
                console.error("Error closing Oracle connection:", e);
            }
        }
        res.send(cr);
    }
});
app.get("/listarAeroporto", async (req, res) => {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = await oraConnAttribs();
        let resultadoConsulta = await connection.execute(`SELECT * FROM AEROPORTOS`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = rowsToAeroportos(resultadoConsulta.rows);
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (err) {
                console.error("Error closing Oracle connection:", err);
            }
        }
        res.send(cr);
    }
});
app.post("/alterarAeroporto", async (req, res) => {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const aeroporto = req.body;
    let [valida, mensagem] = aeroportoValido(aeroporto);
    if (!valida) {
        cr.message = mensagem;
        return res.status(400).send(cr);
    }
    let connection;
    try {
        connection = await oraConnAttribs();
        const cmdUpdateAeroporto = `UPDATE AEROPORTOS
      SET NOME = :nome,
          SIGLA = :sigla,
          CIDADE = :cidade,
          PAIS = :pais
      WHERE CODIGO = :codigo`;
        const dados = {
            nome: aeroporto.nome,
            sigla: aeroporto.sigla,
            cidade: aeroporto.cidade,
            pais: aeroporto.pais,
            codigo: aeroporto.codigo,
        };
        const result = await connection.execute(cmdUpdateAeroporto, dados, { autoCommit: true });
        if (result.rowsAffected === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeroporto alterado.";
            return res.send(cr);
        }
        else {
            cr.message = "Nenhum aeroporto foi alterada. Verifique o código fornecido.";
            return res.status(404).send(cr);
        }
    }
    catch (e) {
        cr.message = `Erro ao alterar aeroporto: ${e.message}`;
        console.error(`Erro ao alterar aeroporto: ${e.message}`);
        return res.status(500).send(cr);
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (closeError) {
                console.error("Erro ao fechar a conexão:", closeError);
            }
        }
    }
});
app.delete("/excluirAeroporto", async (req, res) => {
    const codigo = req.body.codigo;
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = await oraConnAttribs();
        const cmdDeleteAero = `DELETE FROM AEROPORTOS WHERE CODIGO = :1`;
        const dados = [codigo];
        const result = await connection.execute(cmdDeleteAero, dados, {
            autoCommit: true,
        });
        if (result.rowsAffected === 1) {
            cr.status = "SUCCESS";
            cr.message = "Trecho excluída.";
        }
        else {
            cr.message = "Trecho não excluída. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (e) {
                console.error("Error closing Oracle connection:", e);
            }
        }
        res.send(cr);
    }
});
app.listen(port, () => {
    console.log(`Http funcionando em ${port}`);
});
//end