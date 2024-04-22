/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog';
import { devtools } from 'frog/dev';
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';
import { abi } from '@/app/abi';
import { baseSepolia } from 'viem/chains'; 

const app = new Frog({
  basePath: '/api',
});

const urlMap: Record<string, string> = {
  0: 'https://i.imgur.com/0VNw4fC.png',
  1: 'https://i.imgur.com/7khQFNx.png',
}

app.frame('/home/:id', (c) => {
  const id = c.req.param('id');

  console.log("start token ", id);

  return c.res({
    action: `/finish/${id}`,
    image: urlMap[id],
    imageAspectRatio: '1:1',
    intents: [
      <Button.Transaction target={`/mint/${id}`}>Mint</Button.Transaction>,
    ],
  })
});

app.transaction('/mint/:id', (c) => {
  const id = c.req.param('id');

  console.log("minting token ", id);

  return c.contract({
    abi,
    chainId: `eip155:${baseSepolia.id}`,
    functionName: 'mint',
    args: [BigInt(id)],
    to: '0xc33D61f88f207D2c1E3E2e90cF389F9bfCb25C2a',
  });
});

app.frame('/finish/:id', (c) => {
  return c.res({
    image: (
      <div style={{
        color: 'white', 
        display: 'flex', 
        justifyContent: 'center', // Centers content horizontally
        alignItems: 'center', // Centers content vertically
        fontSize: '40px', 
        height: '100%', // Make sure the div takes full height of its container
        width: '100%', // Make sure the div takes full width of its container
        backgroundColor: 'black', // Background color for visibility
        flexDirection: 'column', // Stack children vertically
        textAlign: 'center', // Center text lines horizontally
      }}>
        Minted!
        <br />
        Follow the /cast-clouds<br />channel for more free mints
      </div>
    ),
    imageAspectRatio: '1:1',
    intents: [
      <Button.Link href="https://warpcast.com/~/channel/cast-clouds">/cast-clouds</Button.Link>,
    ]
  });
});



// app.frame('/mintbutton', (c) => {
//   const { buttonValue } = c;
//   console.log("mintbutton");
//   return c.res({
//     // image: `${process.env.NEXT_PUBLIC_SITE_URL}/cast-cloud-daos.png`,
//     image: "https://i.imgur.com/0VNw4fC.png",
//     imageAspectRatio: '1:1',
//     intents: [
//       <Button.Mint target="eip155:84532:0xc33D61f88f207D2c1E3E2e90cF389F9bfCb25C2a:0">Mint</Button.Mint>,
//     ]
//   })
// })

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
