import type { NextApiRequest, NextApiResponse } from 'next';

// // == Mints an NFT with given parameters using CrossMint API ==
// async function mint(body: any) {
//   const reqHeader = new Headers();
//   reqHeader.append(
//     'x-client-secret',
//     `${process.env.NEXT_PUBLIC_CROSSMINT_API_KEY}`
//   );
//   reqHeader.append(
//     'x-project-id',
//     `${process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID}`
//   );
//   reqHeader.append('Content-Type', 'application/json');

//   const requestOptions = {
//     method: 'POST',
//     headers: reqHeader,
//     body: JSON.stringify(body),
//   };
//   let mint_result;
//   await fetch(`${process.env.NEXT_PUBLIC_CROSSMINT_API}`, requestOptions)
//     .then((response) => response.json())
//     .then((result) => (mint_result = result))
//     .catch((error) => console.log('error', error));
//   return mint_result;
// }

// const prepareRecipientString = (data: any) => {
//   // handle email vs web3 wallet.
//   // should make a function to *cleanly* handle parsing this on both mint command and here - due to time issues this was not done.
//   let recipient;
//   if (data.nft_deliveryMethod == 'email') {
//     recipient =
//       data.nft_deliveryMethod +
//       ':' +
//       data.nft_recipient +
//       ':' +
//       data.nft_network;
//   } else {
//     recipient = data.nft_network + ':' + data.nft_recipient;
//   }
//   return recipient;
// };

// const prepareRequestBody = (data: any) => ({
//   // "mainnet": false,
//   metadata: {
//     name: data.nft_name,
//     image: data.nft_image,
//     description: data.nft_description,
//     external_link: data.external_link,
//     // would love to add optional traits here...
//   },
//   recipient: prepareRecipientString(data),
// });

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     res.status(200).json('Use Post');
//     return;
//     // Process a POST request
//   }
//   const { imgUrl, recipientAddress, name, description, external_link, price } =
//     req.body;

//   const metadata = prepareRequestBody({
//     nft_name: name,
//     nft_image: imgUrl,
//     nft_description: description,
//     external_link: external_link,
//     nft_recipient: 'ninjadeveloper0706@gmail.com',
//     nft_deliveryMethod: 'email',
//     nft_network: 'solana',
//   });
//   const mintResult = await mint(metadata);
//   return res.status(200).json(mintResult);
// }

// async function mint(body: any) {
//   const reqHeader = new Headers();
//   reqHeader.append(
//     'x-client-secret',
//     `${process.env.NEXT_PUBLIC_CROSSMINT_API_KEY}`
//   );
//   reqHeader.append(
//     'x-project-id',
//     `${process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID}`
//   );
//   reqHeader.append('Content-Type', 'application/json');

//   const requestOptions = {
//     method: 'POST',
//     headers: reqHeader,
//     body: JSON.stringify(body),
//   };
//   let mint_result;
//   await fetch(`${process.env.NEXT_PUBLIC_CROSSMINT_API}`, requestOptions)
//     .then((response) => response.json())
//     .then((result) => (mint_result = result))
//     .catch((error) => console.log('error', error));
//   return mint_result;
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(200).json('Use Post');
    return;
    // Process a POST request
  }
  const { imgUrl, name, symbol, description, royalty_fee, walletAddr } =
    req.body;

  // const metadata = prepareRequestBody({
  //   nft_name: name,
  //   nft_image: imgUrl,
  //   nft_description: description,
  //   external_link: external_link,
  //   nft_recipient: 'ninjadeveloper0706@gmail.com',
  //   nft_deliveryMethod: 'email',
  //   nft_network: 'solana',
  // });

  const reqHeader = new Headers();
  reqHeader.append('Content-Type', 'application/json');
  reqHeader.append('api-key', 'c8f7733b-ff0b-4c4b-a5ea-12beaf90e22b');

  const requestOptions = {
    method: 'POST',
    headers: reqHeader,
    body: JSON.stringify({
      name: name,
      symbol: symbol,
      description: description,
      fees: royalty_fee * 100,
      img: imgUrl,
      recipient: walletAddr,
      collectionPubkey: 'string',
    }),
  };

  let mint_result;

  const data = await fetch('https://api.niftybot.art/mint/mint', requestOptions)
    .then((response) => response.json())
    .then((result) => (mint_result = result))
    .catch((error) => console.log('error', error));

  return res.status(200).json(mint_result);
}
