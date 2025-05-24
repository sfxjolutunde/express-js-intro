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
| **Output**         | User is **authenticated** (logged in) | User is **authorized** to do something         |
| **How it's done**  | Password, OTP, biometrics, token      | Roles, permissions, access control lists       |
| **Typical Tools**  | JWT, sessions, OAuth                  | RBAC (Role-Based Access Control), ACL          |
| **In JWT Auth**    | Token creation (login)                | Token validation and role check (resource use) |
| **Error Examples** | ❌ "Invalid password"                 | ❌ "You don't have permission to view this"    |
