This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install all dependencies:

```bash
yarn install
```

Second, run the development server:

```bash
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

***

## Deployment on IIS

- Build the NextJS application by running:
```
    npm run build
    or
    yarn build 
```
- Create a NuGet package by running:
```
    dotnet octo pack --id="fsx.lms.Web"
```
- Go to [Octopus Deploy Web App](http://10.0.10.42:8080/)
- Go to Library Tab
- Upload the NuGet Package generated from step 3
- Go to Projects Tab
- Select the designated Project, in this case **FASTrax LMS - ReactJS**
- From the project's overview page, click **CREATE RELEASE**, and then click **Save**
- Click **DEPLOY TO TEST**, then click **DEPLOY**