# H8X App

This project uses Better Auth for authentication. Make sure the following environment variables are set when running the application:

```
GOOGLE_CLIENT_ID=<your google oauth client id>
GOOGLE_CLIENT_SECRET=<your google oauth client secret>
CREDENTIALS_PASSWORD_SECRET=<random string used to hash user passwords>
CREDENTIALS_TOKEN_SECRET=<random string used to sign credential tokens>
```

The sign-up and sign-in pages rely on the email credentials provider via `signUp.email` and `signIn.email`.
