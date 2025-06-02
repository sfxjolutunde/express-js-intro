JWT is a token format (a string) used to securely transmit user identity and claims between parties.

It looks like:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

It contains:

Header: algorithm info

Payload: user info (e.g., user ID, roles)

Signature: verifies integrity using a secret key

Typically used for authentication and authorization

2. What is a Cookie?
   Cookie is a browser storage mechanism that lets the server store data (like a JWT) in the browser.

Sent automatically by the browser on every request

Can be:

HttpOnly (unreadable from JS — secure)

Secure (sent only over HTTPS)

SameSite (control cross-site access)

Cookies are often used to store a JWT securely on the client side.

<!-- Authentication: "Prove who you are."
Authorization: "Prove you're allowed to do that." -->

| Feature            | **Authentication**                    | **Authorization**                              |
| ------------------ | ------------------------------------- | ---------------------------------------------- |
| **Meaning**        | Verifying **who you are**             | Verifying **what you can do**                  |
| **Purpose**        | Confirms **identity**                 | Grants or denies **access/permissions**        |
| **Happens when?**  | Always comes **first**                | Happens **after** authentication               |
| **Examples**       | Logging in with email and password    | Checking if a user can access an admin route   |
| **Output**         | User is **authenticated** (logged in) | User is **authorized** to do s      omething         |
| **How it's done**  | Password, OTP, biometrics, token      | Roles, permissions, access control lists       |
| **Typical Tools**  | JWT, sessions, OAuth                  | RBAC (Role-Based Access Control), ACL          |
| **In JWT Auth**    | Token creation (login)                | Token validation and role check (resource use) |
| **Error Examples** | ❌ "Invalid password"                 | ❌ "You don't have permission to view this"    |





**Node.js Blog App - Full Notes (Users, Blogs, JWT Auth, RBAC, Caching, Testing)**

---

### 📄 Basic Models

**User Model**

```js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

module.exports = mongoose.model('User', UserSchema);
```

**Blog Model**

```js
const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  review: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);
```

---

### 🚪 JWT Authentication & Authorization

* **JWT (JSON Web Tokens)**: Used to sign and verify user login credentials.
* **Authentication**: Verifies who the user is.
* **Authorization**: Determines what a user is allowed to do.

**JWT Middleware**

```js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
```

---

### 📂 RBAC (Role-Based Access Control)

**Guard Middleware**

```js
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}
```

**Example Usage**:

```js
app.delete('/api/users/:id', authMiddleware, authorizeRoles('admin'), deleteUser);
```

---

### 🔄 Caching (Local and Redis)

**Local Cache (Node-cache)**

```js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 });

function cacheMiddleware(req, res, next) {
  const key = req.originalUrl;
  const cached = cache.get(key);
  if (cached) return res.json(cached);
  res.sendResponse = res.json;
  res.json = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };
  next();
}
```

**Redis Cache**

```js
const redis = require('redis');
const client = redis.createClient();
await client.connect();

async function redisCache(req, res, next) {
  const key = req.originalUrl;
  const data = await client.get(key);
  if (data) return res.json(JSON.parse(data));
  res.sendResponse = res.json;
  res.json = async (body) => {
    await client.set(key, JSON.stringify(body), { EX: 60 });
    res.sendResponse(body);
  };
  next();
}
```

---

### 🔢 Unit Testing with Jest

**Why Jest?**

* Fast and powerful test runner.
* Built-in assertions and mocking.
* Simple setup for testing functions and endpoints.

**Why Supertest?**

* Makes HTTP requests to your Express routes in test environment.

**Why mongodb-memory-server?**

* Spins up a temporary, in-memory MongoDB server for tests.
* Avoids polluting your dev/production DBs.

**Example User Test**

```js
import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Endpoints', () => {
  it('should create a new user', async () => {
    const res = await request(app).post('/api/users').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: '123456'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('savedUser');
  });

  it('should login a user', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'test@example.com',
      password: '123456'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
  });
});
```

---

### 🖉 Assignments

1. Create endpoints to **delete users** and **blogs**.
2. Ensure **only the blog's author** can delete their own blog.
3. Implement **GET /blogs/my-blogs** to return only blogs by the logged-in user.
4. When getting blog(s), use `.populate('author')` to include user details.

---








