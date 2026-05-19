# Expense Tracker MERN

Full MERN project with backend and frontend.

## Backend setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

## Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## .env values

Backend `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
JWT_SECRET=myverysecretkey
```

Use local MongoDB or replace MONGO_URI with MongoDB Atlas URI.

## Use

1. Start MongoDB
2. Start backend
3. Start frontend
4. Open http://localhost:5173
5. Register user
6. Login
7. Add income and expenses
