
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const {
    OPENAI_API_KEY,
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  } = process.env;

  if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({
      error: "GLITCH AI server is not configured."
    });
  }

  try {
    // Verify the signed-in GlitchBox user
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ")
      ? auth.slice(7)
      : "";

    if (!token) {
      return res.status(401).json({
        error: "Please sign in first."
      });
    }

    const userCheck = await fetch(
      SUPABASE_URL + "/auth/v1/user",
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: "Bearer " + token
        }
      }
    );

    if (!userCheck.ok) {
      return res.status(401).json({
        error: "Your session has expired."
      });
    }

    // Validate messages
    const messages = req.body?.messages;

    if (
      !Array.isArray(messages) ||
      messages.length < 1 ||
      messages.length > 12
    ) {
      return res.status(400).json({
        error: "Invalid conversation."
      });
    }

    const safeMessages = messages.map(message => {
      if (
        !message ||
        !["user", "assistant"].includes(message.role) ||
        typeof message.content !== "string" ||
        message.content.length > 4000
      ) {
        throw new Error("Invalid message.");
      }

      return {
        role: message.role,
        content: message.content
      };
    });

    if (
      safeMessages[safeMessages.length - 1].role !== "user"
    ) {
      return res.status(400).json({
        error: "Your latest message must be from you."
      });
    }

    // Connect to OpenAI
    const aiResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + OPENAI_API_KEY
        },
        body: JSON.stringify({
          model: "gpt-6-luna",

          instructions: `
You are GLITCH AI, the official AI assistant
inside GlitchBoxOfficial.

PERSONALITY:
- Friendly, intelligent and confident.
- Gaming-focused.
- Helpful and conversational.
- Use occasional gaming humor.
- Keep answers easy to understand.

YOUR JOB:
1. Help players with games.
2. Explain GlitchBoxOfficial features.
3. Help troubleshoot technical problems.
4. Give gaming strategies and challenges.
5. Provide player safety guidance.
6. Help users navigate the website.

SECURITY:
- Never ask for passwords.
- Never reveal API keys or private information.
- Never pretend to be an administrator.
- Never claim to ban, unban or change accounts.
- Never invent information about a player's account.
- Refer account-specific problems to official support.

You are GLITCH AI. Represent GlitchBoxOfficial
professionally and helpfully.
          `,

          input: safeMessages,
          max_output_tokens: 800,
          store: false
        })
      }
    );

    const result = await aiResponse.json();

    if (!aiResponse.ok) {
      console.error("OpenAI error:", result);

      return res.status(502).json({
        error: "GLITCH AI could not connect. Try again."
      });
    }

    const reply = (result.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n")
      .trim();

    if (!reply) {
      return res.status(502).json({
        error: "GLITCH AI returned an empty response."
      });
    }

    return res.status(200).json({
      reply: reply
    });

  } catch (error) {
    console.error("GLITCH AI error:", error);

    return res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
}
