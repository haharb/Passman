Stack:

    Next.js web development framework
    React.js for the front end 

    Node.js runtime environment

    Fastify for the web framework due to it having little overhead and powerful plugins

    TypeScript used as the programming language

    algorithms used:
    - aes256 for encrypting and decrypting the manager's data
    - pbkdf2 which is a pseudorandom hash algorithm similar to hmac, that takes in a salt and generates a locker key 
    - argon2 for unpredictable password hashing for the database


Data flow:

- User registers/logs in and the password and username and password are sent over HTTPS to server
if registering:
    The server then hashes the password with argon2, creates the user and salt for the locker, and then creates the locker itself
otherwise
    - The server then retrieves the user from the database with the username and compares the hash values, then retrieves the locker data for that specific user, and sends back the encrypted locker, the locker's salt
- User will then generate their own locker key using their username hashed password and locker salt, and the pbkdf2 function.
- Then will decrypt the locker with its key using AES 
- Make any changes to the manager data, save the data, and then encrypt the manager again with the key and send it back.
- Finally, the access token is checked by the server which then saves the received encrypted manager.



To setup:
1. Make sure you have the dependencies installed using the commands from Packages.md (or running docker for development)
2. Navigate to the server directory within the command line interface
3. Run the yarn dev command to start the server
4. Navigate to the client directory the same way 
5. Run the client side using the yarn dev command as well
6. The default clientside server will be started on localhost port 3000: http://localhost:3000

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
