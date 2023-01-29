### OTP-based Signup Server
A backend server for signup that uses One-Time Passwords (OTPs) for authentication.

### Features
- Generates OTPs and sends them to user's mobile number.
- Verifies OTPs received from users during signup.
- Stores the signed up user's information in a database.

### Requirements
- Node.js and npm
- A database (e.g. MongoDB)
- A email sending service (e.g. Gmail)

### Installation
Clone the repository
```bash
$ git clone https://github.com/supernfts/node-backend
```

Install dependencies
```bash
$ yarn
```
Configure the environment variables in .env file.

Start the server
```bash
$ yarn start
```

### API Reference
/v1/auth/register-phone: registers user's phone and sends it otp
/v1/auth/login-phone: send's otp to user's phone
/v1/auth/verify-phone: verifies OTP sent to user's phone and return the access and refresh token for further access

### Contributing
1. Fork the repository
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

### License
This project is licensed under the MIT License.
