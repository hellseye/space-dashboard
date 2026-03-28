import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.wheretheiss.at/v1/satellites/25544");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ISS data" });
  }
});

export default router;