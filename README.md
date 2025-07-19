
### State management with React Context and Reducer
This project is a simple full-stack web application built with Next.js and MongoDB Atlas. It is based upon a couple of earlier projects on how to connect to a database and do CRUD operations. 

Here I demonstrate state management by combining React Context and the `useReducer` hook. 
All word-related state (including fetching, adding, editing, and deleting words) is managed globally using a reducer, and actions are dispatched to update the state. The context provider (`WordProvider`) wraps the entire app, allowing any component to access and update the shared state using the custom `useWordContext` hook. 
This approach eliminates prop drilling and makes the state logic scalable and maintainable.

Styling is minimal and functional, focusing on demonstrating core concepts rather than design.

<img src="./public/Screenshot3.png" alt="Screenshot of website" width="400"/>



-----

### In other news
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
