import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as oracledb from "oracledb";
import { Connection } from "oracledb";

const app = express();
const port = 3000;

app.use(cors());

dotenv.config();

app.use(express.json());

const oraConnAttribs = async (): Promise<Connection> => {
  const connection = await oracledb.getConnection({ user: "bd150923124", password: "Gchlp9", connectionString: "172.16.12.14/xe" });
  console.log("Successfully connected to Oracle Database");
  return connection;
};

export type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

type Aeronave = {
  codigo?: number, 
  marca?: string, 
  modelo?: string,
  strAnoFab?: number, 
  qtdeAssentos?: number,
  referencia?: string,
}

type Trecho = {
  codigo?: number,
  nome?: string,
  origem?: string,
  destino?: string,
  aeronave?: number,
}

type Voo = {
  codigo?: number,
  aeronave?: number,
  aeroportoPartida?: number,
  aeroportoDestino?: number, 
  escalas?: number,
  valor?: number,
  dataSaida?: string,
  horaSaida?: string,
  dataChegada?: string,
  horaChegada?: string
};

type Aeroporto = {
  codigo?: number,
  nome?: string,
  sigla?: string,
  cidade?: string,
  pais?: number,
}

function rowsToAeronaves(oracleRows: unknown[] | undefined) : Array<Aeronave> {
  let aeronaves: Array<Aeronave> = [];
  let aeronave;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      aeronave = {
        codigo: registro.CODIGO,
        fabricante: registro.FABRICANTE,
        modelo: registro.MODELO,
        anoFabricacao: registro.ANO_FABRICACAO,
        totalAssentos: registro.TOTAL_ASSENTOS,
        referencia: registro.REFERENCIA,
      } as Aeronave;

      aeronaves.push(aeronave);
    })
  }
  return aeronaves;
};

function rowsToVoos(oracleRows: unknown[] | undefined) : Array<Voo> {
  let voos: Array<Voo> = [];
  let voo;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      voo = {
        codigo: registro.CODIGO,
        aeronave: registro.AERONAVE,
        aeroportoPartida: registro.AEROPORTO_SAIDA,
        aeroportoDestino: registro.AEROPORTO_DESTINO,
        escalas: registro.ESCALAS,
        valor: registro.VALOR_PASSAGEM,
        dataSaida: registro.DATA_SAIDA,
        horaSaida: registro.HORA_SAIDA,
        dataChegada: registro.DATA_CHEGADA,
        horaChegada: registro.HORA_CHEGADA,
      } as Voo;

      voos.push(voo);
    })
  }
  return voos;
};

function rowsToTrechos(oracleRows: unknown[] | undefined) : Array<Trecho> {
  let trechos: Array<Trecho> = [];
  let trecho;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      trecho = {
        codigo: registro.CODIGO,
        nome: registro.NOME,
        origem: registro.ORIGEM,
        destino: registro.DESTINO,
        aeronave: registro.AERONAVE,
      } as Trecho;

      trechos.push(trecho);
    })
  }
  return trechos;
};

function rowsToAeroportos(oracleRows: unknown[] | undefined) : Array<Aeroporto> {
  let aeroportos: Array<Aeroporto> = [];
  let aeroporto;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      aeroporto = {
        codigo: registro.CODIGO,
        nome: registro.NOME,
        sigla: registro.SIGLA,
        cidade: registro.CIDADE,
        pais: registro.PAIS,
      } as Aeroporto;

      aeroportos.push(aeroporto);
    })
  }
  return aeroportos;
};

function aeronaveValida(aero: Aeronave) {
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
  } else {
    console.log("Erro de validação:", mensagem);
  }

  return [valida, mensagem] as const;
}

function trechoValido(trecho: Trecho) {
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

  console.log("Validação de trecho - Nome:", trecho.nome);
  console.log("Validação de trecho - Origem:", trecho.origem);
  console.log("Validação de trecho - Destino:", trecho.destino);
  console.log("Validação de trecho - Aeronave:", trecho.aeronave);

  if (mensagem === "") {
    valida = true;
  } else {
    console.log("Erro de validação:", mensagem);
  }

  return [valida, mensagem] as const;
}

function vooValido(voo: Voo) {
  let valida = true;  
  let mensagens: string[] = [];

  if (voo.aeronave === undefined) {
    mensagens.push("Aeronave não informada.");
    valida = false;  
  }

  if (voo.aeroportoPartida === undefined) {
    mensagens.push("Aeroporto de saída não fornecido.");
    valida = false;
  }
  
  if (voo.aeroportoDestino === undefined) {
    mensagens.push("Aeroporto de destino não fornecido.");
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

  if (voo.horaChegada === undefined){
    mensagens.push("Hora de chegada não informada.");
    valida = false;
  }

  console.log("Validação de voo - Aeronave:", voo.aeronave);
  console.log("Validação de voo - Aeroporto de Saida:", voo.aeroportoPartida);
  console.log("Validação de voo - Aeroporto de Destino:", voo.aeroportoDestino);
  console.log("Validação de voo - Escalas:", voo.escalas);
  console.log("Validação de voo - Valor da Passagem:", voo.valor);
  console.log("Validação de voo - Data de Saida:", voo.dataSaida);
  console.log("Validação de voo - Hora de Saida:", voo.horaSaida);
  console.log("Validação de voo - Data de Chegada:", voo.dataChegada);
  console.log("Validação de voo - Hora de Chegada:", voo.horaChegada);

  if (mensagens.length > 0) {
    console.log("Erro de validação:", mensagens);
  }

  return [valida, mensagens.join(" ")] as const;
}

function aeroportoValido(aeroporto: Aeroporto) {
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
  } else {
    console.log("Erro de validação:", mensagem);
  }

  return [valida, mensagem] as const;
}

app.post("/incluirAeronave", async (req, res) => {

  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const aero: Aeronave = req.body as Aeronave;

  let error: any;

  try {
    let [valida, mensagem] = aeronaveValida(aero);
    if (!valida) {

      cr.message = mensagem;

      return res.send(cr);

    } else {
      let connection;
      try {
        connection = await oraConnAttribs();

        const cmdInsertAero = `INSERT INTO AERONAVES 
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

        const result = await connection.execute(cmdInsertAero, dados, {autoCommit: true,});

        if (result.rowsAffected === 1) {
          cr.status = "SUCCESS";
          cr.message = "Aeronave inserida.";
        }
      } catch (e) {
        if (e instanceof Error) {
          cr.message = e.message;
          console.log(e.message);
        } else {
          cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
        error = e;
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (closeError) {
            console.error("Error closing Oracle connection:", closeError);
            error = closeError;
          }
        }
      }
    }
  } catch(e){}
  if(error){

    console.error("Outer error:", error);
  } 
  else{

    return res.send(cr);
  }
});

app.post("/incluirTrecho", async (req, res) => {

  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const trecho: Trecho = req.body as Trecho;

  let error: any;

  try {
    let [valida, mensagem] = trechoValido(trecho);
    if (!valida) {

      cr.message = mensagem;

      return res.send(cr);

    } else {
      let connection;
      try {
        connection = await oraConnAttribs();

        const cmdInsertAero = `INSERT INTO TRECHOS
        (CODIGO, NOME, ORIGEM, DESTINO, AERONAVE)
        VALUES
        (TRECHOS_SEQ.NEXTVAL, :1, :2, :3, :4)`;
        const dados = [
          trecho.nome,
          trecho.origem,
          trecho.destino,
          trecho.aeronave,
        ];

        const result = await connection.execute(cmdInsertAero, dados, {autoCommit: true,});

        if (result.rowsAffected === 1) {
          cr.status = "SUCCESS";
          cr.message = "Trecho inserida.";
        }
      } catch (e) {
        if (e instanceof Error) {
          cr.message = e.message;
          console.log(e.message);
        } else {
          cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
        error = e;
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (closeError) {
            console.error("Error closing Oracle connection:", closeError);
            error = closeError;
          }
        }
      }
    }
  } catch(e){}
  if(error){

    console.error("Outer error:", error);
  } 
  else{

    return res.send(cr);
  }
});

app.post("/incluirVoo", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const voo: Voo = req.body as Voo;

  try {
    console.log("Received Voo:", voo); // Log received data

    let [valida, mensagem] = vooValido(voo);
    if (!valida) {
      cr.message = mensagem;
      return res.send(cr);
    } else {
      let connection;
      try {
        connection = await oraConnAttribs();

        const cmdInsertVoo = `INSERT INTO VOOS
          (CODIGO, AERONAVE, AEROPORTO_SAIDA, AEROPORTO_DESTINO, ESCALAS, VALOR_PASSAGEM, DATA_SAIDA, HORA_SAIDA, DATA_CHEGADA, HORA_CHEGADA)
          VALUES
          (VOOS_SEQ.NEXTVAL, :1, :2, :3, :4, :5, :6, :7, :8, :9)`;

        const dados = [
          voo.aeronave,
          voo.aeroportoPartida,
          voo.aeroportoDestino,
          voo.escalas,
          voo.valor,
          voo.dataSaida,
          voo.horaSaida,
          voo.dataChegada,
          voo.horaChegada,
        ];

        const result = await connection.execute(cmdInsertVoo, dados, { autoCommit: true });

        if (result.rowsAffected === 1) {
          cr.status = "SUCCESS";
          cr.message = "Voo inserido.";
        }
      } catch (e: any) { // Add ': any' to specify that 'e' can be of any type
        console.error("Error during database operation:", e);
        cr.message = "Erro ao conectar ao Oracle. Detalhes: " + (e.message || e.toString());
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (closeError) {
            console.error("Error closing Oracle connection:", closeError);
          }
        }
      }
    }
  } catch (e) {
    console.error("Outer error:", e);
  }

  return res.send(cr);
});

app.post("/incluirAeroporto", async (req, res) => {

  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const aeroporto: Aeroporto = req.body as Aeroporto;

  let error: any;

  try {
    let [valida, mensagem] = aeroportoValido(aeroporto);
    if (!valida) {

      cr.message = mensagem;

      return res.send(cr);

    } else {
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

        const result = await connection.execute(cmdInsertAeroportos, dados, {autoCommit: true,});

        if (result.rowsAffected === 1) {
          cr.status = "SUCCESS";
          cr.message = "Aeroporto inserido.";
        }
      } catch (e) {
        if (e instanceof Error) {
          cr.message = e.message;
          console.log(e.message);
        } else {
          cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
        error = e;
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (closeError) {
            console.error("Error closing Oracle connection:", closeError);
            error = closeError;
          }
        }
      }
    }
  } catch(e){}
  if(error){

    console.error("Outer error:", error);
  } 
  else{

    return res.send(cr);
  }
});

app.get("/listarAeronave", async (req, res) => {
  
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;

  try {
    connection = await oraConnAttribs();

    let resultadoConsulta = await connection.execute(`SELECT * FROM AERONAVES`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    cr.payload = rowsToAeronaves(resultadoConsulta.rows);
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } 
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing Oracle connection:", err);
      }
    }
    res.send(cr);
  }
});

app.get("/listarVoo", async (req, res) => {
  
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;

  try {
    connection = await oraConnAttribs();

    let resultadoConsulta = await connection.execute(`SELECT * FROM VOOS`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    cr.payload = rowsToVoos(resultadoConsulta.rows);
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } 
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing Oracle connection:", err);
      }
    }
    res.send(cr);
  }
});

app.get("/listarTrecho", async (req, res) => {
  
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;

  try {
    connection = await oraConnAttribs();

    let resultadoConsulta = await connection.execute(`SELECT * FROM TRECHOS`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    cr.payload = rowsToTrechos(resultadoConsulta.rows);
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } 
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing Oracle connection:", err);
      }
    }
    res.send(cr);
  }
});

app.get("/listarAeroporto", async (req, res) => {
  
  let cr: CustomResponse = { status: "ERROR", message: "", payload: undefined };
  let connection;

  try {
    connection = await oraConnAttribs();

    let resultadoConsulta = await connection.execute(`SELECT * FROM AEROPORTOS`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    cr.payload = rowsToAeroportos(resultadoConsulta.rows);
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } 
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing Oracle connection:", err);
      }
    }
    res.send(cr);
  }
});

app.post("/alterarAeronave", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const aero: Aeronave = req.body as Aeronave;

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
    } else {
      cr.message = "Nenhuma aeronave foi alterada. Verifique o código fornecido.";
      return res.status(404).send(cr); // Return a 404 Not Found status if no rows were affected
    }
  } catch (e: any) {
    cr.message = `Erro ao alterar aeronave: ${(e as Error).message}`;
    console.error(`Erro ao alterar aeronave: ${(e as Error).message}`);
    return res.status(500).send(cr); // Return a 500 Internal Server Error status for other errors
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Erro ao fechar a conexão:", closeError);
      }
    }
  }
});

app.post("/alterarTrecho", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const trecho: Trecho = req.body as Trecho;

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
    } else {
      cr.message = "Nenhuma aeronave foi alterada. Verifique o código fornecido.";
      return res.status(404).send(cr); // Return a 404 Not Found status if no rows were affected
    }
  } catch (e: any) {
    cr.message = `Erro ao alterar aeronave: ${(e as Error).message}`;
    console.error(`Erro ao alterar aeronave: ${(e as Error).message}`);
    return res.status(500).send(cr); // Return a 500 Internal Server Error status for other errors
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Erro ao fechar a conexão:", closeError);
      }
    }
  }
});

app.post("/alterarVoo", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const voo: Voo = req.body as Voo;

  let [valida, mensagem] = vooValido(voo);
  if (!valida) {
    cr.message = mensagem;
    return res.status(400).send(cr); // Return a 400 Bad Request status for validation errors
  }

  let connection;
  try {
    connection = await oraConnAttribs();

    const cmdUpdateVoo = `UPDATE VOOS
    SET AERONAVE = :aeronave,
        AEROPORTO_SAIDA = :aeroporto_saida,
        AEROPORTO_DESTINO = :aeroporto_destino,
        ESCALAS = :escalas,
        VALOR_PASSAGEM = :valor_passagem,
        DATA_SAIDA = :data_saida,
        HORA_SAIDA = :hora_saida,
        DATA_CHEGADA = :data_chegada,
        HORA_CHEGADA = :hora_chegada
    WHERE CODIGO = :codigo`;

    const dados = {
      aeronave: voo.aeronave,
      aeroporto_saida: voo.aeroportoPartida,
      aeroporto_destino: voo.aeroportoDestino,
      escalas: voo.escalas,
      valor_passagem: voo.valor,
      data_saida: voo.dataSaida,
      hora_saida: voo.horaSaida,
      data_chegada: voo.dataChegada,
      hora_chegada: voo.horaChegada,
      codigo: voo.codigo,
    };

    const result = await connection.execute(cmdUpdateVoo, dados, { autoCommit: true });

    if (result.rowsAffected === 1) {
      cr.status = "SUCCESS";
      cr.message = "Voo alterado.";
      return res.send(cr);
    } else {
      cr.message = "Nenhuma aeronave foi alterada. Verifique o código fornecido.";
      return res.status(404).send(cr); // Return a 404 Not Found status if no rows were affected
    }
  } catch (e: any) {
    cr.message = `Erro ao alterar aeronave: ${(e as Error).message}`;
    console.error(`Erro ao alterar aeronave: ${(e as Error).message}`);
    return res.status(500).send(cr); // Return a 500 Internal Server Error status for other errors
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Erro ao fechar a conexão:", closeError);
      }
    }
  }
});

app.post("/alterarAeroporto", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  const aeroporto: Aeroporto = req.body as Aeroporto;

  let [valida, mensagem] = aeroportoValido(aeroporto);
  if (!valida) {
    cr.message = mensagem;
    return res.status(400).send(cr); // Return a 400 Bad Request status for validation errors
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
    } else {
      cr.message = "Nenhum aeroporto foi alterada. Verifique o código fornecido.";
      return res.status(404).send(cr); // Return a 404 Not Found status if no rows were affected
    }
  } catch (e: any) {
    cr.message = `Erro ao alterar aeroporto: ${(e as Error).message}`;
    console.error(`Erro ao alterar aeroporto: ${(e as Error).message}`);
    return res.status(500).send(cr); // Return a 500 Internal Server Error status for other errors
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Erro ao fechar a conexão:", closeError);
      }
    }
  }
});

app.delete("/excluirAeronave", async (req, res) => {
  const codigo = req.body.codigo as number;

  let cr: CustomResponse = {
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
    } else {
      cr.message = "Aeronave não excluída. Verifique se o código informado está correto.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("Error closing Oracle connection:", e);
      }
    }
    res.send(cr);
  }
});

app.delete("/excluirTrecho", async (req, res) => {
  const codigo = req.body.codigo as number;

  let cr: CustomResponse = {
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
    } else {
      cr.message = "Trecho não excluída. Verifique se o código informado está correto.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("Error closing Oracle connection:", e);
      }
    }
    res.send(cr);
  }
});

app.delete("/excluirVoo", async (req, res) => {
  const codigo = req.body.codigo as number;

  let cr: CustomResponse = {
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
    } else {
      cr.message = "Voo não excluída. Verifique se o código informado está correto.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("Error closing Oracle connection:", e);
      }
    }
    res.send(cr);
  }
});

app.delete("/excluirAeroporto", async (req, res) => {
  const codigo = req.body.codigo as number;

  let cr: CustomResponse = {
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
    } else {
      cr.message = "Trecho não excluída. Verifique se o código informado está correto.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("Error closing Oracle connection:", e);
      }
    }
    res.send(cr);
  }
});

app.listen(port, ()=>{
    console.log(`Http funcionando em ${port}`);
});