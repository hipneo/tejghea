const Anthropic = require('@anthropic-ai/sdk').default || require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = "Ești asistentul virtual al Tejghea, o platformă românească de management pentru baruri și restaurante. Răspunzi DOAR la întrebări despre oferta și serviciile Tejghea prezentate pe această pagină. Dacă cineva te întreabă altceva, redirecționează politicos conversația înapoi la oferta Tejghea. Fii concis, prietenos și profesional. Răspunde în română.";

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!process.env.ANT_API_KEY) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'ANT_API_KEY not configured' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const message = (payload.message || '').toString().trim();
  if (!message) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing "message" field' }),
    };
  }

  if (message.length > 2000) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Message too long (max 2000 chars)' }),
    };
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANT_API_KEY });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }],
    });

    const reply = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error('Anthropic API error:', err);
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Upstream model error' }),
    };
  }
};
