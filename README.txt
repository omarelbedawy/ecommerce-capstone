E-Commerce Platform - Capstone Project
=========================================

Hey, this is my final capstone project for the Full-Stack track. I built a
complete e-commerce platform from scratch - customers can browse products,
search/filter/sort them, add stuff to a cart and check out, and admins can
manage products (with image upload) and see/update order statuses. I did
the whole thing end to end: environment setup, backend, frontend, database,
auth, and testing.

What I used
------------
Frontend:
- React (built with Vite)
- React Router for the pages
- Zustand for stuff like auth state and filters
- TanStack React Query to handle fetching/caching data from the API
- Axios with interceptors so the JWT token gets attached automatically and
  refreshes itself when it expires
- Plain CSS

Backend:
- Node.js + Express
- PostgreSQL (hosted on Neon)
- Prisma as the ORM - schema, migrations, filtering, pagination, and I used
  a transaction for checkout so the order/stock/cart stuff all happens
  together or not at all
- JWT auth (access + refresh tokens), passwords hashed with bcrypt
- Multer for product image uploads
- Nodemailer + Ethereal (fake test inbox) for order confirmation emails

Testing:
- Jest for backend unit tests
- Supertest for backend integration tests (hits the real API + real DB)
- Vitest + React Testing Library for frontend component tests
- MSW to mock the API in frontend tests

Folder structure
------------------
/backend    -> Express API + Prisma schema + tests
/frontend   -> React app + tests
docker-compose.yml -> spins up Postgres + backend + frontend together
vercel.json -> config for deploying frontend + backend together on Vercel

How to run it locally
------------------------
1. Backend:
     cd backend
     npm install
     copy .env.example to .env and fill in real values (DB url, JWT
     secrets, Ethereal email creds)
     npx prisma migrate dev --name init
     npx prisma db seed
     npm run dev

2. Frontend (separate terminal):
     cd frontend
     npm install
     npm run dev

3. Go to http://localhost:5173

Running with Docker
---------------------
From the project root:
    docker-compose up --build

First time only, run these in another terminal:
    docker-compose exec backend npx prisma migrate dev --name init
    docker-compose exec backend npx prisma db seed

Heads up - this spins up its own local Postgres container, separate from
whatever DB you're using locally otherwise, so it'll seed fresh sample data
and won't show anything you added through your regular local setup.

Running tests
---------------
Backend (uses a real DB connection, so don't point it at anything you care
about):
    cd backend
    npm test

Frontend:
    cd frontend
    npm test

How I deployed it
--------------------
I originally wanted to deploy backend + frontend separately (like Vercel
for frontend, Render for the API) so I could actually use CORS properly
since we covered it in class. Render kept asking me for a credit card even
though their free tier is supposed to not require one, and then Railway's
trial credit ran out on me, and Koyeb had closed their free tier to new
signups. Basically every "free" backend host I tried either wanted a card
or wasn't actually available anymore.

So in the end I deployed everything - frontend and backend - together on
Vercel using their newer "Services" feature, which lets you run a frontend
and backend as separate services inside one project on one domain. The
backend runs off the same Express code, Prisma handles migrations
automatically as part of the build step, and it's all connected to a free
Neon Postgres database.

Known issue - product image uploads on the live site
--------------------------------------------------------
I want to be upfront about this: I tested the image upload feature
properly while building this - I added a product (a jacket) with an image
through the admin panel, and it worked completely fine locally and also
when I tested it through Docker. But on the actual live Vercel deployment,
the uploaded image doesn't show up/persist.

The reason is that Vercel runs the backend as a "Fluid Compute" function
instead of a normal always-on server with its own disk, so files saved
through multer's local disk storage don't stick around between requests
once it's deployed there. It's not something I didn't test or missed -
it's a real limitation of this specific hosting setup. The actual fix
would be to switch image storage over to something like Cloudinary or S3
instead of saving to local disk, which I didn't get to, but I understand
why it happens and what the fix would look like.

Everything else - login/register, JWT auth, browsing/searching/filtering
products, cart, checkout (including the stock/order transaction), order
history, admin product and order management, and the confirmation email -
all works correctly, including on the live deployed version.

Project URLs
--------------
Live app: https://ecommerce-capstone-kq6o.vercel.app
GitHub repo: https://github.com/omarelbedawy/ecommerce-capstone

Test accounts
---------------
Admin:
  admin@shop.com / Admin123!

Customer:
  customer@shop.com / Customer123!

(both get created automatically by the seed script)

Other notes
-------------
- Order confirmation emails go through Ethereal, which is a fake SMTP
  inbox made for testing - it doesn't actually deliver anywhere real.
  After checkout, the backend logs a preview link you can open to see what
  the email would've looked like.
- Access tokens expire after 15 minutes but get silently refreshed using
  the refresh token, so you shouldn't get randomly logged out mid-session.