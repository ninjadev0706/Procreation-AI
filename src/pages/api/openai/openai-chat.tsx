// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { decode } from 'string-encode-decode';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  // organization: process.env.Organization_ID,
});
const openAi = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await openAi.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: req.body }],
    // temperature: 0.9,
    // top_p: 1,
    // n: 1,
    // frequency_penalty: 0.0,
    // presence_penalty: 0.6,
    stop: [' Human:', ' AI:'],
  });

  res.status(200).json(response.data.choices[0].message?.content);
}
