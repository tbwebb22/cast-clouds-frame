/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog';
import { devtools } from 'frog/dev';
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';
import { abi } from '@/app/abi';
import { baseSepolia } from 'viem/chains'; 

const app = new Frog({
  // assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  return c.res({
    action: '/finish',
    image: "https://i.imgur.com/0VNw4fC.png",
    imageAspectRatio: '1:1',
    intents: [
      <Button.Link href="https://i.imgur.com/0VNw4fC.png">Hi-res Image</Button.Link>,
      <Button.Transaction target="/mint/0">Mint</Button.Transaction>,
    ],
  })
});

// app.frame('/', (c) => {
//   return c.res({
//     action: '/mintbutton',
//     image: "https://i.imgur.com/0VNw4fC.png",
//     imageAspectRatio: '1:1',
//     intents: [
//       <Button>Mint2</Button>,
//     ],
//   })
// });

app.frame('/mintbutton', (c) => {
  const { buttonValue } = c;
  console.log("mintbutton");
  return c.res({
    // image: `${process.env.NEXT_PUBLIC_SITE_URL}/cast-cloud-daos.png`,
    image: "https://i.imgur.com/0VNw4fC.png",
    imageAspectRatio: '1:1',
    intents: [
      <Button.Mint target="eip155:84532:0xc33D61f88f207D2c1E3E2e90cF389F9bfCb25C2a:0">Mint</Button.Mint>,
    ]
  })
})

app.frame('/finish', (c) => {
  console.log("inside finish");
  const { transactionId } = c;
  console.log("transactionID: ", transactionId);
  console.log("finish c: ", c);
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Transaction ID: {transactionId}
        Minted!
      </div>
    )
  });
});

app.transaction('/mint/:id', (c) => {
  const id = c.req.param('id');

  console.log("minting token ", id);

  // return new Response({ status: 400 });

  // Contract transaction response.
  return c.contract({
    abi,
    chainId: `eip155:${baseSepolia.id}`,
    functionName: 'mint',
    args: [BigInt(id)],
    to: '0xc33D61f88f207D2c1E3E2e90cF389F9bfCb25C2a',
  });
});

// app.frame('/finish', (c) => {
//   console.log("finish: ", c);
//   const { transactionId } = c;
//   console.log("transactionID: ", transactionId);

//   return c.res({
//     image: (
//       <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
//         Transaction ID: {transactionId}
//       </div>
//     )
//   });
// });

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
