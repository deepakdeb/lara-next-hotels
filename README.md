# Next.js + Laravel Hotel Management

This project demonstrates how to implement JWT authentication in a Next.js frontend with a Laravel backend. It supports both email/password login and Google OAuth login.

## Features
- Email/Password login using JWT.
- Google OAuth login.
- Token refresh functionality.
- Protected routes in Next.js.

## Prerequisites
- Node.js (v16 or higher)
- PHP (v8.0 or higher)
- Composer
- MySQL or any other database supported by Laravel
- Google OAuth credentials (for Google login)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/nextjs-laravel-jwt-auth.git
cd nextjs-laravel-jwt-auth
```
### 2. Backend (Laravel) Setup
  #### Navigate to the backend folder:
  ```
  cd backend
  composer install
  php artisan migrate
  php artisan serve
  ```
### 3\. Frontend (Next.js) Setup
  #### Navigate to the frontend folder:
  ```
  cd ../frontend
  npm install
  npm run dev
  ```
### 4\. Google OAuth Setup

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
    
2.  Create a new project and enable the Google OAuth API.
    
3.  Configure the OAuth consent screen.
    
4.  Create credentials for a "Web application" and add the following authorized redirect URIs:
    
    *   http://localhost:3000/api/auth/callback/google
        
5.  Copy the Client ID and Client Secret into your .env.local file.
    

### 5\. Testing

*   Visit http://localhost:3000/login to test the email/password login.
    
*   Use the "Login with Google" button to test Google OAuth.