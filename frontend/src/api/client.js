import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000/api" });

let _schema = null;
export const setSchema = (s) => (_schema = s);
export const getSchema = () => _schema;

export const connectDB = (db_url) => API.post("/schema/connect", { db_url });
export const getDictionary = (schema) => API.post("/dictionary/generate", { schema });
export const getERDiagram = (schema) => API.post("/er/generate", { schema });
export const sendChat = (question, schema, history) => API.post("/chat/message", { question, schema, history });
export const convertNLSQL = (question, schema) => API.post("/nlsql/convert", { question, schema });
export const getHealthScore = (schema) => API.post("/health/score", { schema });
export const getPIIReport = (schema) => API.post("/pii/detect", { schema });
export const executeQuery = (sql, db_url) => API.post("/schema/execute", { sql, db_url });
export const executeCSVQuery = (sql, db_url) => API.post("/schema/execute-csv", { sql, db_url });
export const uploadCSV = (files) => {
  const formData = new FormData();
  // append each file individually
  Array.from(files).forEach(file => {
    formData.append("files", file);
  });
  return API.post("/schema/upload-csv", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};