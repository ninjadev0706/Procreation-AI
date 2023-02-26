import type { NextApiRequest, NextApiResponse } from 'next';
import { prepareHeaders } from '@/lib/crossmint';

async function checkStatus(mintingID: string) {
  const reqHeader = new Headers();
  reqHeader.append(
    'x-client-secret',
    `${process.env.NEXT_PUBLIC_CROSSMINT_API_KEY}`
  );
  reqHeader.append(
    'x-project-id',
    `${process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID}`
  );

  const requestOptions = {
    method: 'GET',
    headers: reqHeader,
  };

  const url = `${process.env.NEXT_PUBLIC_CROSSMINT_API}/` + mintingID;

  let check_result;
  await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => (check_result = result))
    .catch((error) => console.log('error', error));
  return check_result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json('Use Post');
    return;
  }

  const { nftId } = req.body;

  if (!nftId) {
    return res.status(400).json({ message: 'nft not minted' });
  }

  let result = await checkStatus(nftId);

  function delay(x: any) {
    return new Promise((done, fail) => setTimeout(done, x));
  }

  while (true) {
    await delay(1000);

    result = await checkStatus(nftId);

    let exist = 0;

    Object.keys(result as any).map((key) => {
      if (key === 'metadata') {
        exist = 1;
      }
    });

    if (exist === 1) {
      break;
    }
  }

  return res.status(200).json(result);
}
