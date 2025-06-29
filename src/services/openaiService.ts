import OpenAI from 'openai';

// You'll need to set your OpenAI API key here
const OPENAI_API_KEY = 'your-openai-api-key-here'; // Replace with your actual API key

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side usage
});

export interface ParsedQuoteItem {
  id: string;
  name: string;
  type: 'labour' | 'material';
  quantity: number;
  cost: number;
  price: number;
  markup: number;
  tax: number;
  discount: number;
  total: number;
  isBigTicket?: boolean;
  maxMarkup?: number;
}

export const parseQuoteDataWithAI = async (rawText: string): Promise<ParsedQuoteItem[]> => {
  try {
    const prompt = `
You are a quote data parser. Parse the following pasted quote/invoice data into a structured JSON format.

The data may be in various formats (tab-separated, comma-separated, or space-separated). Extract line items with the following structure:

{
  "lineItems": [
    {
      "id": "1",
      "name": "Item name",
      "type": "labour" or "material",
      "quantity": number,
      "cost": number,
      "price": number,
      "markup": number (percentage),
      "tax": 15,
      "discount": 0,
      "total": number,
      "isBigTicket": boolean (true if cost > 500 or contains "Daikin", "heat pump", etc.),
      "maxMarkup": number (25 if big ticket item, otherwise undefined)
    }
  ]
}

Rules:
1. Determine if each item is "labour" or "material" based on the name
2. Calculate markup percentage as ((price - cost) / cost) * 100
3. Set isBigTicket to true for expensive items (>$500) or heat pumps/major equipment
4. Set maxMarkup to 25 for big ticket items
5. Use sequential IDs starting from "1"
6. Return ONLY the JSON object, no other text

Raw data to parse:
${rawText}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const parsedData = JSON.parse(content);
    return parsedData.lineItems || [];

  } catch (error) {
    console.error('Error parsing quote data with AI:', error);
    throw new Error('Failed to parse quote data. Please check your API key and try again.');
  }
};