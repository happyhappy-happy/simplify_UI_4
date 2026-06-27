// api/tts.js
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const text = req.query?.text || req.body?.text;

  if (!text) {
    return res.status(400).json({ error: "Missing text parameter" });
  }

  if (!process.env.HF_API_TOKEN) {
    return res.status(500).json({ error: "HF_API_TOKEN is not configured" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/mms-tts-nan",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "audio/wav",
          "x-wait-for-model": "false",
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.text();
      console.error("Hugging Face API error:", err);
      return res.status(500).json({ error: err });
    }

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/wav");
    return res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("Proxy error:", error);
    const message = error?.name === "AbortError"
      ? "Hugging Face request timed out"
      : error?.message || "fetch failed";
    return res.status(500).json({ error: message, detail: String(error) });
  }
};
