import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token 066bfd7582fdf0b23bf8baf79774e0001c326ad8`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/stable-diffussion/versions
      version:
        '436b051ebd8f68d23e83d22de5e198e0995357afef113768c20f0b6fcef23c8b',

      // This is the text prompt that will be submitted by a form on the frontend
      input: {
        prompt: req.body.prompt,
        negative_prompt: req.body.negative_prompt,
        width: req.body.width,
        height: req.body.height,
        prompt_strength: req.body.prompt_strength,
        num_outputs: 1,
        num_inference_steps: req.body.num_inference_steps,
        guidance_scale: req.body.guidance_scale,
        scheduler: 'DPMSolverMultistep',
        seed: req.body.seed,
      },
    }),
  });

  console.log('++', response.json);

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}

// prompt: values.prompt,
//           negative_prompt: values.negative_prompt,
//           width: picWidth,
//           height: picHeight,
//           prompt_strength: values.prompt_strength,
//           num_inference_steps: values.num_inference_steps,
//           guidance_scale: values.guidance_scale,
//           scheduler: scheduler,
//           seed: values.seed,
