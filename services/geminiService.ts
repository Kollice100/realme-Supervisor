
import { GoogleGenAI, Type } from "@google/genai";
import { Sale, Salesperson, SalesInsight } from "../types";

export const getSalesInsights = async (sales: Sale[], salespeople: Salesperson[]): Promise<SalesInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Format data for the prompt
  const salesSummary = sales.map(s => {
    const seller = salespeople.find(sp => sp.id === s.salespersonId)?.name || 'Desconhecido';
    return `Promotor: ${seller}, Valor: R$${s.amount}, Produto: ${s.product}, Data: ${s.date}`;
  }).join('\n');

  const prompt = `Analise os seguintes dados de vendas e forneça insights estratégicos em português do Brasil:\n\n${salesSummary}\n\nForneça uma análise de tendências, conselhos para os promotores que estão vendendo mais e dicas para quem precisa melhorar o desempenho.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: 'Resumo geral das vendas' },
          topPerformerAdvice: { type: Type.STRING, description: 'Conselhos para os melhores promotores' },
          lowPerformerAdvice: { type: Type.STRING, description: 'Estratégias para quem precisa melhorar' },
          trendAnalysis: { type: Type.STRING, description: 'Análise de tendências de mercado baseada nos dados' },
        },
        required: ["summary", "topPerformerAdvice", "lowPerformerAdvice", "trendAnalysis"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erro ao processar resposta da IA:", error);
    return {
      summary: "Não foi possível gerar o resumo.",
      topPerformerAdvice: "Continue o bom trabalho.",
      lowPerformerAdvice: "Tente novas abordagens.",
      trendAnalysis: "Dados insuficientes para análise de tendência."
    };
  }
};
