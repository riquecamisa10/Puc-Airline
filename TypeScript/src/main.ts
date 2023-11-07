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

type Aeronave = {
  codigo?: number, 
  fabricante?: string, 
  modelo?: string,
  anoFabricacao?: number, 
  totalAssentos?: number,
  referencia?: string
}

export type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

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

function aeronaveValida(aero: Aeronave) {
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

  console.log("Validação de aeronave - Fabricante:", aero.fabricante);
  console.log("Validação de aeronave - Modelo:", aero.modelo);
  console.log("Validação de aeronave - Assentos:", aero.totalAssentos);
  console.log("Validação de aeronave - Ano de Fabricação:", aero.anoFabricacao);
  console.log("Validação de aeronave - Referência:", aero.referencia);

  if (mensagem === "") {
    valida = true;
  } else {
    console.log("Erro de validação:", mensagem);
  }

  return [valida, mensagem] as const;
}

app.get("/teste", async (_req: any, res: any) => {
  console.log(`Estou funcionando no teste em ${port}`);
  res.send("Teste realizado com sucesso");
});

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
        (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4, :5)`;
        const dados = [
          aero.fabricante,
          aero.modelo,
          aero.anoFabricacao,
          aero.totalAssentos,
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
    res.send(cr);
  } else {
    let connection;
    try {
      connection = await oraConnAttribs();

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

      const result = await connection.execute(cmdUpdateAero, dados, {
        autoCommit: true,
      });

      if (result.rowsAffected === 1) {
        cr.status = "SUCCESS";
        cr.message = "Aeronave alterada.";
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

app.listen(port, ()=>{
    console.log(`Http funcionando em ${port}`);
});