import Anthropic from "@anthropic-ai/sdk";

export const validateSimilarity = async (transcription, recordData) => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `
                  Eres un asistente de auditoría. Tu tarea es comparar la información de un 
                  formulario con la transcripción de una entrevista de audio y determinar qué 
                  tan similares son.

                  Datos del formulario:
                  ${JSON.stringify(recordData, null, 2)}

                  Transcripción del audio:
                  ${transcription}
                  
                  Analiza la similitud entre los datos del formulario y lo que se dice en el audio
                  responde unicamente con un JSON con este formato exacto, sin texto adicional:
                  {
                    "score": número entre 0 y 100,
                    "status": "approved" | "rejected" | "review",
                    "reasoning": "explicación breve en español"
                  }

                  Criterios:
                  - score >= 90 -> approved
                  - score < 60 -> review
                  - score < 40 -> rejected

                  cabe resaltar que si en el audio no se menciona alguna pregunta relacionada a los datos generales de la tabla en cuanto a
                  los indices establecidos , se debe tener en cuenta pero nuestro principal interés es los datos que si se preguntan
                  y que tengan la mayor relación lo verbal como la información diligenciada en el documento.

                  `,
        },
      ],
    });

    const text = response.content
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("")
      .trim();

    // Quitar fences de markdown si los agrega
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const result = JSON.parse(cleaned);
    return result;
  } catch (error) {
    throw new Error(`Claude error: ${error.message}`);
  }
};
