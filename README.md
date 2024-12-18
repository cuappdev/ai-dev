This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)

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

curl -X POST "http://0.0.0.0:11434/api/pull" -d '{"model":"llama3.2:1b"}'
curl -X POST "http://0.0.0.0:11434/api/generate" -d '{"model":"llama3.2:1b", "prompt":"hello"}'

docker exec -it e345672ce6b2 curl -X POST "http://0.0.0.0:11434/api/generate" -d '{"model":"llama3.2:1b", "prompt":"hello"}'

thestack_app-network

Pull Model - ollama
docker run --rm --network thestack_app-network curlimages/curl \
 -X POST "http://ollama:11434/api/pull" \
 -d '{"model":"llama3.2:1b"}'

Get active models - ollama
docker run --rm --network thestack_app-network curlimages/curl \
 -X GET "http://ollama:11434/api/ps"

Get all models - ollama
docker run --rm --network thestack_app-network curlimages/curl \
 -X GET "http://ollama:11434/api/tags"

Generate - ollama
docker run --rm --network thestack_app-network curlimages/curl \
 -X POST "http://ollama:11434/api/generate" \
 -d '{"model":"llama3.2:1b", "prompt":"hello"}'

Chat - ollama
docker run --rm --network thestack_app-network curlimages/curl \
 -X POST "http://ollama:11434/api/chat" \
 -d '{"model":"llama3.2:1b", "messages": [{"role":"user", "content":"Why is the sky blue"}]}'

Get all models - app
docker run --rm --network thestack_app-network curlimages/curl \
 -X GET "http://ai-dev-app:3000/api/models/all"

Get active models - app
docker run --rm --network thestack_app-network curlimages/curl \
 -X GET "http://ai-dev-app:3000/api/models/active"

Chat - app
docker run --rm --network thestack_app-network curlimages/curl \
 -X POST "http://ai-dev-app:3000/api/chat" \
 -d '{"model":"llama3.2:1b", "messages": [{"role":"user", "content":"Hello"}]}'

Chat Models - app
docker run --rm --network thestack_app-network curlimages/curl \
 -X POST "http://ai-dev-app:3000/api/models" \
 -d '{"model":"llama3.2:1b", "messages": [{"role":"user", "content":"Hello"}]}'
