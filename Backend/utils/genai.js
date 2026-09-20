export async function getGeminiResponse(userMessage) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/interactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        model: "gemini-3.7-flash",
        input: userMessage,
      }),
    },
  );

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini request failed");
  }

  const text =
    data?.steps?.[1]?.content?.[0]?.text ||
    data?.steps?.find((step) => step?.content?.[0]?.text)?.content?.[0]?.text ||
    data?.output_text ||
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  return text;
}
