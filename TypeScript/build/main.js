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
                //cidadeOrigem: registro.CIDADE_ORIGEM,
                //dataSaida: registro.DATA_SAIDA,
                //horaSaida: registro.HORA_SAIDA,
                //cidadeDestino: registro.CIDADE_DESTINO,
                //dataChegada: registro.DATA_CHEGADA,
                //horaChegada: registro.HORA_CHEGADA,
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
                aeronave: registro.AERONAVE,
                aeroportoPartida: registro.AEROPORTOPARTIDA,
                aeroportoDestino: registro.AEROPORTODESTINO,
                escalas: registro.ESCALAS,
                valorPassagem: registro.VALORPASSAGEM,
                cidadeOrigem: registro.CIDADE_ORIGEM,
                dataSaida: registro.DATA_SAIDA,
                horaSaida: registro.HORA_SAIDA,
                cidadeDestino: registro.CIDADE_DESTINO,
                dataChegada: registro.DATA_CHEGADA,
                horaChegada: registro.HORA_CHEGADA,
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
            };
            trechos.push(trecho);
        });
    }
    return trechos;
}
;
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
    if ((aero.qtdeAssentos !== undefined) && (aero.qtdeAssentos < 100 || aero.qtdeAssentos > 1000)) {
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
    if (trecho.codigo === undefined) {
        mensagem = "Fabricante não informado";
    }
    if (trecho.nome === undefined) {
        mensagem = "Fabricante não informado";
    }
    if (trecho.origem === undefined) {
        mensagem = "Modelo não informado.";
    }
    if (trecho.destino === undefined) {
        mensagem = "Modelo não informado.";
    }
    if (trecho.aeronave === undefined) {
        mensagem = "Total de assentos não informado.";
    }
    console.log("Validação de aeronave - Fabricante:", trecho.nome);
    console.log("Validação de aeronave - Modelo:", trecho.origem);
    console.log("Validação de aeronave - Ano de Fabricação:", trecho.destino);
    console.log("Validação de aeronave - Referência:", trecho.aeronave);
    if (mensagem === "") {
        valida = true;
    }
    else {
        console.log("Erro de validação:", mensagem);
    }
    return [valida, mensagem];
}
function vooValido(voo) {
    let valida = false;
    let mensagem = "";
    if (voo.codigo === undefined) {
        mensagem = "Fabricante não informado";
    }
    if (voo.dataSaida === undefined) {
        mensagem = "Fabricante não informado";
    }
    if (voo.horaSaida === undefined) {
        mensagem = "Modelo não informado.";
    }
    if (voo.dataChegada === undefined) {
        mensagem = "Total de assentos não informado.";
    }
    if (voo.horaChegada !== undefined) {
        mensagem = "Total de assentos é inválido.";
    }
    if (voo.valorPassagem === undefined) {
        mensagem = "Ano de fabricação não informado.";
    }
    if (voo.escalas !== undefined) {
        mensagem = "Ano de fabricação deve ser entre 1990 e 2026.";
    }
    if (voo.aeroportoSaida === undefined) {
        mensagem = "Referência da aeronave não fornecida.";
    }
    if (voo.aeroportoSaida === undefined) {
        mensagem = "Cidade de origem não fornecida.";
    }
    if (voo.aeroportoDestino === undefined) {
        mensagem = "Data de saida não fornecida.";
    }
    console.log("Validação de aeronave - Fabricante:", voo.dataSaida);
    console.log("Validação de aeronave - Modelo:", voo.horaSaida);
    console.log("Validação de aeronave - Ano de Fabricação:", voo.dataChegada);
    console.log("Validação de aeronave - Referência:", voo.valorPassagem);
    console.log("Validação de aeronave - Assentos:", voo.escalas);
    console.log("Validação de aeronave - Cidade de Origem:", voo.aeroportoSaida);
    console.log("Validação de aeronave - Data de Saida:", voo.aeroportoSaida);
    console.log("Validação de aeronave - Hora de Saida:", voo.aeroportoDestino);
    if (mensagem === "") {
        valida = true;
    }
    else {
        console.log("Erro de validação:", mensagem);
    }
    return [valida, mensagem];
}
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
                const cmdInsertAero = `INSERT INTO AERONAVES 
        (CODIGO, FABRICANTE, MODELO, ANO_FABRICACAO, TOTAL_ASSENTOS, REFERENCIA)
        VALUES
        (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4, :5)`;
                const dados = [
                    aero.marca,
                    aero.modelo,
                    aero.strAnoFab,
                    aero.qtdeAssentos,
                    aero.referencia,
                ];
                const result = await connection.execute(cmdInsertAero, dados, { autoCommit: true, });
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
        (NOME, ORIGEM, DESTINO, AERONAVE)
        VALUES
        (:1, :2, :3, :4)`;
                const dados = [
                    trecho.nome,
                    trecho.origem,
                    trecho.destino,
                    trecho.aeronave,
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
app.post("/incluirVoo", async (req, res) => {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const voo = req.body;
    let error;
    try {
        let [valida, mensagem] = vooValido(voo);
        if (!valida) {
            cr.message = mensagem;
            return res.send(cr);
        }
        else {
            let connection;
            try {
                connection = await oraConnAttribs();
                const cmdInsertAero = `INSERT INTO VOOS
        (DATA_SAIDA, HORA_SAIDA, DATA_CHEGADA, HORA_CHEGADA, VALOR_PASSAGEM, ESCALAS, AEROPORTO_SAIDA, AEROPORTO_DESTINO, AERONAVE)
        VALUES
        (:1, :2, :3, :4, :5, :6, :7, :8, :9)`;
                const dados = [
                    voo.dataSaida,
                    voo.horaSaida,
                    voo.dataChegada,
                    voo.horaChegada,
                    voo.valorPassagem,
                    voo.escalas,
                    voo.aeroportoSaida,
                    voo.aeroportoDestino,
                    voo.aeronave,
                ];
                const result = await connection.execute(cmdInsertAero, dados, { autoCommit: true, });
                if (result.rowsAffected === 1) {
                    cr.status = "SUCCESS";
                    cr.message = "Voo inserido.";
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
        return res.status(400).send(cr); // Return a 400 Bad Request status for validation errors
    }
    let connection;
    try {
        connection = await oraConnAttribs();
        const cmdUpdateAero = `UPDATE AERONAVES
      SET FABRICANTE = :fabricante,
          MODELO = :modelo,
          ANO_FABRICACAO = :ano_fabricacao,
          TOTAL_ASSENTOS = :total_assentos,
          REFERENCIA = :referencia,
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
            return res.status(404).send(cr); // Return a 404 Not Found status if no rows were affected
        }
    }
    catch (e) {
        cr.message = `Erro ao alterar aeronave: ${e.message}`;
        console.error(`Erro ao alterar aeronave: ${e.message}`);
        return res.status(500).send(cr); // Return a 500 Internal Server Error status for other errors
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
        return res.status(400).send(cr); // Return a 400 Bad Request status for validation errors
    }
    let connection;
    try {
        connection = await oraConnAttribs();
        const cmdUpdateTrecho = `UPDATE TRECHOS
      SET NOME = :nome,
          ORIGEM = :origem,
          DESTINO = :destino,
          AERONAVE = :aeronave
      WHERE CODIGO = :codigo`;
        const dados = {
            nome: trecho.nome,
            origem: trecho.origem,
            destino: trecho.destino,
            aeronave: trecho.aeronave,
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
            return res.status(404).send(cr); // Return a 404 Not Found status if no rows were affected
        }
    }
    catch (e) {
        cr.message = `Erro ao alterar aeronave: ${e.message}`;
        console.error(`Erro ao alterar aeronave: ${e.message}`);
        return res.status(500).send(cr); // Return a 500 Internal Server Error status for other errors
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
app.post("/alterarVoo", async (req, res) => {
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    const voo = req.body;
    let [valida, mensagem] = vooValido(voo);
    if (!valida) {
        cr.message = mensagem;
        return res.status(400).send(cr); // Return a 400 Bad Request status for validation errors
    }
    let connection;
    try {
        connection = await oraConnAttribs();
        const cmdUpdateVoo = `UPDATE VOOS
    SET DATA_SAIDA = :data_saida,
        HORA_SAIDA = :hora_saida,
        DATA_CHEGADA = :data_chegada,
        HORA_CHEGADA = :hora_chegada,
        VALOR_PASSAGEM = :valor_passagem,
        ESCALAS = :escalas,
        AEROPORTO_SAIDA = :aeroporto_saida,
        AEROPORTO_DESTINO = :aeroporto_destino
    WHERE CODIGO = :codigo`;
        const dados = {
            data_saida: voo.dataSaida,
            hora_saida: voo.horaSaida,
            data_chegada: voo.dataChegada,
            hora_chegada: voo.horaChegada,
            valor_passagem: voo.valorPassagem,
            escalas: voo.escalas,
            aeroporto_saida: voo.aeroportoSaida,
            aeroporto_destino: voo.aeroportoDestino,
            aeronave: voo.aeronave,
            codigo: voo.codigo,
        };
        const result = await connection.execute(cmdUpdateVoo, dados, { autoCommit: true });
        if (result.rowsAffected === 1) {
            cr.status = "SUCCESS";
            cr.message = "Voo alterado.";
            return res.send(cr);
        }
        else {
            cr.message = "Nenhuma aeronave foi alterada. Verifique o código fornecido.";
            return res.status(404).send(cr); // Return a 404 Not Found status if no rows were affected
        }
    }
    catch (e) {
        cr.message = `Erro ao alterar aeronave: ${e.message}`;
        console.error(`Erro ao alterar aeronave: ${e.message}`);
        return res.status(500).send(cr); // Return a 500 Internal Server Error status for other errors
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
app.listen(port, () => {
    console.log(`Http funcionando em ${port}`);
});
