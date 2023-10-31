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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowsToAeronaves = exports.oraConnAttribs = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const oracledb = __importStar(require("oracledb"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
dotenv_1.default.config();
app.use(express_1.default.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Esta funcionando no padrao");
}));
const oraConnAttribs = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield oracledb.getConnection({ user: "bd150923124", password: "Gchlp9", connectionString: "BD-ACD" });
    console.log("Successfully connected to Oracle Database");
    return connection;
});
exports.oraConnAttribs = oraConnAttribs;
function rowsToAeronaves(oracleRows) {
    // conventendo um array do oracle para um array aeronave em js
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
exports.rowsToAeronaves = rowsToAeronaves;
function aeronaveValida(aero) {
    let valida = false;
    let mensagem = "";
    if (aero.fabricante === undefined) {
        mensagem = "Fabricante não informado";
    }
    if (aero.fabricante !== 'Embraer' && aero.fabricante !== 'Airbus' && aero.fabricante !== 'Boeing') {
        mensagem = "Fabricante deve ser: Embraer, Airbus ou Boeing.";
    }
    if (aero.modelo === undefined) {
        mensagem = "Modelo não informado.";
    }
    if (aero.totalAssentos === undefined) {
        mensagem = "Total de assentos não informado";
    }
    if ((aero.totalAssentos !== undefined) && (aero.totalAssentos < 100 || aero.totalAssentos > 1000)) {
        mensagem = "Total de assentos é inválido";
    }
    if (aero.anoFabricacao === undefined) {
        mensagem = "Ano de fabricação não informado";
    }
    if ((aero.anoFabricacao !== undefined) && (aero.anoFabricacao < 1990 || aero.anoFabricacao > 2026)) {
        mensagem = "Ano de fabricação deve ser entre 1990 e 2026";
    }
    if (aero.referencia === undefined) {
        mensagem = "Referência da aeronave não fornecida.";
    }
    if (mensagem === "") {
        valida = true;
    }
    return [valida, mensagem];
}
app.get("/incluirAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                connection = yield (0, exports.oraConnAttribs)();
                const cmdInsertAero = `INSERT INTO AERONAVES 
        (CODIGO, FABRICANTE, MODELO, ANO_FABRICACAO, TOTAL_ASSENTOS, REFERENCIA)
        VALUES
        (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4, :5)`;
                const dados = [
                    aero.fabricante,
                    aero.modelo,
                    aero.anoFabricacao,
                    aero.totalAssentos,
                    aero.referencia,
                ];
                const result = yield connection.execute(cmdInsertAero, dados, {
                    autoCommit: true,
                });
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
                        yield connection.close();
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
}));
app.get("/listarAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined };
    let connection;
    try {
        connection = yield (0, exports.oraConnAttribs)();
        let resultadoConsulta = yield connection.execute(`SELECT * FROM AERONAVES`, [], {
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
                yield connection.close();
            }
            catch (err) {
                console.error("Error closing Oracle connection:", err);
            }
        }
        res.send(cr);
    }
}));
app.get("/alterarAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            connection = yield (0, exports.oraConnAttribs)();
            const cmdUpdateAero = `UPDATE AERONAVES
      SET FABRICANTE = :1, MODELO = :2, ANO_FABRICACAO = :3, TOTAL_ASSENTOS = :4, REFERENCIA = :5
      WHERE CODIGO = :6`;
            const dados = [
                aero.fabricante,
                aero.modelo,
                aero.anoFabricacao,
                aero.totalAssentos,
                aero.referencia,
                aero.codigo,
            ];
            const result = yield connection.execute(cmdUpdateAero, dados, {
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
                    yield connection.close();
                }
                catch (e) {
                    console.error("Error closing Oracle connection:", e);
                }
            }
            res.send(cr);
        }
    }
}));
app.delete("/excluirAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codigo = req.body.codigo;
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let connection;
    try {
        connection = yield (0, exports.oraConnAttribs)();
        const cmdDeleteAero = `DELETE FROM AERONAVES WHERE CODIGO = :1`;
        const dados = [codigo];
        const result = yield connection.execute(cmdDeleteAero, dados, {
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
                yield connection.close();
            }
            catch (e) {
                console.error("Error closing Oracle connection:", e);
            }
        }
        res.send(cr);
    }
}));
app.listen(port, () => {
    console.log(`Http funcionando em ${port}`);
});
