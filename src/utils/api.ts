
/**
 * API utility for generating Mermaid diagrams using GPT-4o-mini
 */

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export const generateMermaidDiagram = async (prompt: string): Promise<string> => {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error('API key is required. Please add your OpenAI API key.');
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a diagram expert specializing in creating Mermaid syntax diagrams. 
            When given a request, respond ONLY with valid Mermaid syntax code surrounded by backticks like this: \`mermaid code here\`.
            Do not include any explanations, markdown code blocks, or anything else outside the backticks.
            Ensure the diagram is clean, well-organized, and correctly formatted.`
          },
          {
            role: 'user',
            content: `Create a Mermaid diagram based on this description: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content.trim();
    
    // Extract content between backticks using regex
    const backtickPattern = /`(.*?)`/gs;
    const backtickMatch = [...generatedText.matchAll(backtickPattern)];
    
    // If we found content between backticks, use that
    if (backtickMatch.length > 0) {
      // Join all backtick content with newlines if there are multiple matches
      return backtickMatch.map(match => match[1]).join('\n');
    }
    
    // Fallback to the entire response if no backticks found
    return generatedText;
  } catch (error) {
    console.error('Error in API call:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate diagram. Please try again later.');
  }
};
