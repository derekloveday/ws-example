import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get("/api/hello", (req, res) => {
  res.json({ message: "World" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
