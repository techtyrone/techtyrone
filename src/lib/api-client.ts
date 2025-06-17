// src/lib/api-client.ts
// Alternative API client with CORS handling

interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class APIClient {
  private static async makeRequest(
    url: string, 
    options: RequestInit,
    useCorsProxy = false
  ): Promise<APIResponse> {
    try {
      const targetUrl = useCorsProxy ? `https://cors-anywhere.herokuapp.com/${url}` : url;
      
      const response = await fetch(targetUrl, {
        ...options,
        headers: {
          ...options.headers,
          ...(useCorsProxy && { 'X-Requested-With': 'XMLHttpRequest' })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async callGroqAPI(prompt: string, model: string): Promise<APIResponse> {
    const payload = {
      model: model || 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are an expert web developer and content creator.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    };

    return this.makeRequest(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify(payload)
      }
    );
  }
}

// Usage in ai-services.ts:
// const result = await APIClient.callGroqAPI(prompt, model);
// if (result.success) {
//   return result.data.choices[0].message.content;
// } else {
//   throw new Error(result.error);
// }