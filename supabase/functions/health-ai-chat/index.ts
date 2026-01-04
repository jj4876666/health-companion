import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting for demo protection
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientId);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT) {
    return false;
  }
  
  entry.count++;
  return true;
}

const SYSTEM_PROMPT = `You are an AI Health Consultant for EMEC (Electronic Medical & Education Companion), a health education app.

IMPORTANT DISCLAIMER: You are NOT a doctor and cannot diagnose conditions or prescribe treatments. Always recommend users consult a healthcare professional for medical concerns.

Your role:
1. Provide general health information and education
2. Explain symptoms in simple terms
3. Recommend when to seek medical attention
4. Suggest nearby health facilities when appropriate
5. Answer questions about medications, nutrition, and wellness
6. Provide first aid guidance
7. Support mental health awareness

Guidelines:
- Be empathetic and supportive
- Use simple, clear language appropriate for all ages
- Include relevant emojis to make responses friendly
- Always emphasize consulting a healthcare professional for serious concerns
- For emergencies, always recommend calling emergency services immediately
- Be culturally sensitive to East African context
- Encourage visiting local health facilities for any health concerns
- Promote preventive care: nutrition, hydration, exercise, and regular checkups

Start each response with a friendly greeting if it's a new conversation.
End important health advice with: "⚠️ Remember: This information is for educational purposes only. Please consult a healthcare professional for personalized medical advice."`;

const CHILD_CONTENT_FILTER = `
CRITICAL CHILD SAFETY RULES:
- NEVER discuss sexual health, reproduction, or related topics
- NEVER provide information about drugs, alcohol, or substances
- Keep all content age-appropriate and educational
- Focus on basic hygiene, nutrition, safety, and fun health facts
- Use simple words and lots of friendly emojis
- Make learning about health fun and engaging
`;

const TEEN_CONTENT_GUIDANCE = `
TEEN-APPROPRIATE CONTENT:
- You may discuss puberty in an educational, factual manner
- Mental health topics like stress, anxiety, and self-esteem are okay
- Avoid explicit sexual content but can discuss body changes during puberty
- Discuss healthy relationships in age-appropriate terms
- Be supportive about body image and self-care
`;
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting based on IP or a unique identifier
    const clientId = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'anonymous';
    
    if (!checkRateLimit(clientId)) {
      console.log(`Rate limit exceeded for client: ${clientId}`);
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { messages, userAge, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }
    
    console.log(`Health AI request - Age: ${userAge}, Language: ${language}, Client: ${clientId}`);

    // Adjust system prompt based on user age with content filtering
    let ageContext = '';
    let contentFilter = '';
    if (userAge !== undefined) {
      if (userAge < 6) {
        ageContext = '\n\nThis user is a young child (under 6). Use very simple language, lots of emojis, and make explanations fun and visual. Focus on basic hygiene, eating healthy, staying active, and being safe.';
        contentFilter = CHILD_CONTENT_FILTER;
      } else if (userAge < 13) {
        ageContext = '\n\nThis user is a child (6-12 years). Use kid-friendly language, fun examples, and educational tone. Explain health topics in ways they can understand.';
        contentFilter = CHILD_CONTENT_FILTER;
      } else if (userAge < 18) {
        ageContext = '\n\nThis user is a teenager (13-17 years). Be relatable, discuss topics like puberty and mental health appropriately. Be supportive and non-judgmental.';
        contentFilter = TEEN_CONTENT_GUIDANCE;
      } else {
        ageContext = '\n\nThis user is an adult. You can discuss all health topics including chronic diseases, preventive care, and complex medical information.';
      }
    }

    // Language context
    const langContext = language === 'sw' 
      ? '\n\nRespond in Swahili (Kiswahili).' 
      : language === 'fr' 
      ? '\n\nRespond in French (Français).'
      : '';

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contentFilter + ageContext + langContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable. Please try again." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Health AI chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
