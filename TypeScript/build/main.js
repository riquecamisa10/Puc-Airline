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
        mensagem = "Total de assentos não informado";
    }
    if ((aero.qtdeAssentos !== undefined) && (aero.qtdeAssentos < 100 || aero.qtdeAssentos > 1000)) {
        mensagem = "Total de assentos é inválido";
    }
    if (aero.strAnoFab === undefined) {
        mensagem = "Ano de fabricação não informado";
    }
    if ((aero.strAnoFab !== undefined) && (aero.strAnoFab < 1990 || aero.strAnoFab > 2026)) {
        mensagem = "Ano de fabricação deve ser entre 1990 e 2026";
    }
    if (aero.referencia === undefined) {
        mensagem = "Referência da aeronave não fornecida.";
    }
    console.log("Validação de aeronave - Fabricante:", aero.marca);
    console.log("Validação de aeronave - Modelo:", aero.modelo);
    console.log("Validação de aeronave - Assentos:", aero.qtdeAssentos);
    console.log("Validação de aeronave - Ano de Fabricação:", aero.strAnoFab);
    console.log("Validação de aeronave - Referência:", aero.referencia);
    if (mensagem === "") {
        valida = true;
    }
    else {
        console.log("Erro de validação:", mensagem);
    }
    return [valida, mensagem];
}
app.get("/teste", async (_req, res) => {
    console.log(`Estou funcionando no teste em ${port}`);
    res.send("Teste realizado com sucesso");
});
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
        res.send(cr);
    }
    else {
        let connection;
        try {
            connection = await oraConnAttribs();
            const cmdUpdateAero = `UPDATE AERONAVES
      SET FABRICANTE = :1, MODELO = :2, ANO_FABRICACAO = :3, TOTAL_ASSENTOS = :4, REFERENCIA = :5
      WHERE CODIGO = :6`;
            const dados = [
                aero.marca,
                aero.modelo,
                aero.strAnoFab,
                aero.qtdeAssentos,
                aero.referencia,
                aero.codigo,
            ];
            const result = await connection.execute(cmdUpdateAero, dados, {
                autoCommit: true,
            });
            if (result.rowsAffected === 1) {
                cr.status = "SUCCESS";
                cr.message = "Aeronave alterada.";
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
app.listen(port, () => {
    console.log(`Http funcionando em ${port}`);
});
