import express from "express";
import path from "path";

const router = express.Router();

const routes = () => {
  router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });

  return router;
};

export default routes;
