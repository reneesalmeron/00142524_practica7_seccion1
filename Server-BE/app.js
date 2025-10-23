import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 5000;
const JWT_SECRET = "mi_clave_super_segura";

app.use(bodyParser.json());
app.use(cors());

// "Base de datos" simulada
const users = [];

// Registro
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username))
    return res.status(400).json({ message: "Usuario ya existe" });

  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  res.status(201).json({ message: "Usuario registrado correctamente" });
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware de verificación
const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Token requerido" });

  const token = auth.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};

// Ruta protegida
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: `Bienvenido, ${req.user.username}! Acceso concedido.` });
});

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Servidor Express funcionando correctamente 🚀");
});

app.listen(PORT, () => console.log(`✅ Servidor en http://localhost:${PORT}`));
