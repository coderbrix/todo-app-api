import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  res.send({ ok: 1 });
});

export default router;
