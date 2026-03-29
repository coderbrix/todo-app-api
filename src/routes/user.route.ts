import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  res.send({ ok: 1 });
});

router.get("/", (req, res) => {
  res.send({ ok: 10 });
});

export default router;
