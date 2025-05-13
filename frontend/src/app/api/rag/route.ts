import { NextResponse } from 'next/server';
import OpenAI from "openai";


const openRouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
});


export async function POST(request: Request) {
  try {

    const { message, history } = await request.json();
    
    const model =  "deepseek/deepseek-r1-distill-llama-70b:free";
    
    const prompt = `
    Your model is ${model}
    You are a helpful assistant for the HCT Survival Prediction Tool. 
    Use the following context to answer the user's question:.
    

    Context:
        ${history.map((msg: { role: string; content: string }) => {
            return `${msg.role}: ${msg.content}`;
        }).join("\n")}

    Question: ${message}

    Answer:`
    
    // Get response from OpenRouter 
    const completion = await openRouter.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 1000,
    });
    
    const response = completion.choices[0]?.message?.content || 
      "Sorry, I couldn't generate a response.";
    
    return NextResponse.json({
      response
    });
    
  } catch (error: Error | unknown) {
    console.error("Error in chat API:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process chat request";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

