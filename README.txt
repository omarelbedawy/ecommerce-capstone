E-COMMERCE PLATFORM - CAPSTONE PROJECT
========================================

WHAT THIS IS
------------
A full-stack e-commerce platform built for the final capstone project of my
full-stack track. Customers can browse products, search/filter/sort, add
items to a cart, and check out. Admins can manage products (with image
upload) and view/update order statuses. Built end-to-end - environment setup,
backend API, frontend, database, auth, and testing.


TECH STACK
----------
Frontend:
  - React (Vite)
  - React Router for navigation
  - Zustand for client/UI state (auth info, filters)
  - TanStack React Query for server-state caching (products, cart, orders)
  - Axios with request/response interceptors for JWT + auto token refresh
  - Plain CSS

Backend:
  - Node.js + Express
  - PostgreSQL
  - Prisma ORM (schema, migrations, filtering, pagination, transactions)
  - JWT auth (access + refresh tokens), bcrypt password hashing
  - Multer for product image uploads
  - Nodemailer (Ethereal test inbox) for order confirmation emails

Testing:
  - Jest (backend unit tests)
  - Supertest (backend integration/API tests)
  - Vitest + React Testing Library (frontend component tests)
  - MSW (API mocking for frontend tests)

Delivery:
  - Docker + docker-compose (frontend, backend, PostgreSQL all containerized)


PROJECT STRUCTURE
------------------
/backend    -> Express API, Prisma schema, tests
/frontend   -> React app, tests
docker-compose.yml -> runs everything together


HOW TO RUN IT - OPTION 1: DOCKER (easiest, recommended)
--------------------------------------------------------
1. Make sure Docker Desktop is installed and running.
2. Copy backend/.env.example to backend/.env and fill in:
     - JWT_SECRET / REFRESH_TOKEN_SECRET (any random long string)
     - EMAIL_USER / EMAIL_PASS -> get free ones at https://ethereal.email
       (click "Create Ethereal Account", it gives you a user + pass instantly)
   You do NOT need to touch DATABASE_URL, docker-compose sets that for you.
3. From the project root, run:
     docker-compose up --build
4. First time only, run the Prisma migration + seed inside the backend container:
     docker-compose exec backend npx prisma migrate dev --name init
     docker-compose exec backend npx prisma db seed
5. Open the app:
     Frontend: http://localhost:5173
     Backend API: http://localhost:5000/api


HOW TO RUN IT - OPTION 2: LOCALLY WITHOUT DOCKER
--------------------------------------------------
1. Install PostgreSQL locally and create a database + user matching whatever
   you put in backend/.env's DATABASE_URL (or reuse the docker-compose values
   if you just run `docker-compose up db` for the database only).
2. Backend:
     cd backend
     npm install
     cp .env.example .env   (fill in real values)
     npx prisma migrate dev --name init
     npx prisma db seed
     npm run dev
3. Frontend (separate terminal):
     cd frontend
     npm install
     npm run dev
4. Open http://localhost:5173


RUNNING TESTS
-------------
Backend (make sure DATABASE_URL points to a database you're OK with wiping):
     cd backend
     npm test

Frontend:
     cd frontend
     npm test


DEPLOYING IT (what you need for submission)
---------------------------------------------
Your submission only needs a README with a live link, so here's the actual
path to get one. Three free services, ~20 minutes total:

1) DATABASE - Neon (free Postgres)
   - Go to https://neon.tech, sign up, create a new project.
   - Copy the connection string it gives you (looks like
     postgresql://user:pass@ep-xxxx.neon.tech/dbname?sslmode=require)
   - Save it, you'll paste it into Render in the next step.

2) BACKEND - Render (free web service)
   - Push this project to GitHub first (see "PUSHING TO GITHUB" below).
   - Go to https://render.com, sign up, click "New +" -> "Web Service".
   - Connect your GitHub repo, set Root Directory to "backend".
   - Build Command:  npm install && npx prisma generate
   - Start Command:  npx prisma migrate deploy && npx prisma db seed && node src/server.js
     (remove "&& npx prisma db seed" after the very first successful deploy,
     so it doesn't try to re-seed on every restart)
   - Add these Environment Variables in Render's dashboard:
       DATABASE_URL       = (the Neon connection string from step 1)
       JWT_SECRET         = any random long string
       REFRESH_TOKEN_SECRET = a different random long string
       JWT_EXPIRES_IN     = 15m
       REFRESH_TOKEN_EXPIRES_IN = 7d
       EMAIL_HOST         = smtp.ethereal.email
       EMAIL_PORT         = 587
       EMAIL_USER         = (from ethereal.email - see below)
       EMAIL_PASS         = (from ethereal.email - see below)
       FRONTEND_URL       = (fill in after step 3, then redeploy)
   - Click Deploy. Once it's live, copy the URL Render gives you, something
     like https://ecommerce-backend-xxxx.onrender.com

   Note: Render's free tier does NOT keep uploaded files permanently (disk
   resets on redeploy/restart). Product images uploaded via the admin panel
   may disappear after the service restarts. This is a known limitation of
   the free tier, not a bug - mention it if asked in your defense.

3) FRONTEND - Vercel
   - Go to https://vercel.com, sign up, click "Add New" -> "Project".
   - Import the same GitHub repo, set Root Directory to "frontend".
   - Framework Preset: Vite (should auto-detect).
   - Add Environment Variable:
       VITE_API_URL = https://ecommerce-backend-xxxx.onrender.com/api
     (use your actual Render URL from step 2, keep the /api at the end)
   - Click Deploy. Vercel gives you a URL like:
       https://your-project-name.vercel.app

4) FINAL STEP - go back to Render, set FRONTEND_URL to your Vercel URL
   (e.g. https://your-project-name.vercel.app), and manually redeploy the
   backend so CORS allows requests from your live frontend.

5) Test the live site end to end (register, browse, add to cart, checkout,
   log in as admin and add a product) before submitting.


PUSHING TO GITHUB
-------------------
   cd ecommerce-project
   git init
   git add .
   git commit -m "Initial commit - full-stack e-commerce capstone"
   (create an empty repo on github.com first, then:)
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main


PROJECT URLS
-------------
Live frontend:   [ADD YOUR VERCEL URL HERE AFTER DEPLOYING]
Live backend API: [ADD YOUR RENDER URL HERE AFTER DEPLOYING]
GitHub repo:      [ADD YOUR GITHUB REPO LINK HERE]

Local frontend:  http://localhost:5173
Local backend:   http://localhost:5000/api


TEST ACCOUNT CREDENTIALS
--------------------------
Admin account:
  Email:    admin@shop.com
  Password: Admin123!

Customer account:
  Email:    customer@shop.com
  Password: Customer123!

(both created automatically by the seed script)


NOTES
------
- Order confirmation emails don't actually deliver anywhere - they go through
  Ethereal, a fake SMTP service made for testing. After checkout, check the
  backend terminal/logs for a line starting with "order email preview:" and
  open that link to see the email that would've been sent.
- Uploaded product images are stored locally in backend/uploads and served
  back through /uploads/<filename>.
- Access tokens are short-lived (15 min) and silently refreshed using the
  refresh token via an axios interceptor - you shouldn't get logged out
  mid-session unless the refresh token itself expires (7 days).
