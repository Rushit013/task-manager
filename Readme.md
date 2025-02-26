# **Full Stack Task Manager App**

This repository contains a **Full Stack Task Manager App** with authentication and task management features. The project is split into two parts:

- **Mobile App:** Built with **Expo**, **React Native**, and **Redux Toolkit**.
- **Backend:** Built with **Node.js**, **Express**, and **MongoDB** using **Mongoose**.

---

## **Table of Contents**

- [Features](#features)
- [Project Structure](#project-structure)
  - [Mobile App (Expo)](#mobile-app-expo)
  - [Backend](#backend)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Mobile App Setup](#mobile-app-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## **Features**

✅ **User Authentication:** Signup, Login, and Change Password using JWT-based authentication.  
✅ **Task Management:** Create, Read, Update, and Delete tasks.  
✅ **Redux Store with Persist:** State management using Redux Toolkit with Persist.  
✅ **Global UI Feedback:** Loader and Toast notifications using React Native Paper.  
✅ **Form Validation:** Implemented with React Hook Form and Yup.

---

## **Project Structure**

### **Mobile App (Expo)**

```
expo-app/
└─ src/
   ┣ api/
   ┃ ┣ Services/
   ┃ ┃ ┣ taskService.ts       # Task API calls
   ┃ ┃ ┗ userService.ts       # User-related API calls
   ┃ ┗ axiosInstance.ts       # Centralized Axios instance with authentication
   ┣ assets/
   ┃ ┗ todo_illustration.png  # App illustration or logo
   ┣ components/
   ┃ ┗ SaferAreaContainer.tsx # Custom SafeAreaView component
   ┣ context/
   ┃ ┣ AuthContext.tsx        # Authentication context
   ┃ ┣ LoaderContext.tsx      # Global loader context
   ┃ ┗ ToastContext.tsx       # Global toast (Snackbar) context
   ┣ navigation/
   ┃ ┣ AppTabs.tsx            # Bottom tab navigator for logged-in users
   ┃ ┣ AuthStack.tsx          # Stack navigator for authentication (Login/Signup)
   ┃ ┗ RootNavigator.tsx      # Switch between AuthStack and AppTabs based on auth state
   ┣ reduxStore/
   ┃ ┣ slices/
   ┃ ┃ ┗ authSlice.ts         # Redux slice for authentication
   ┃ ┣ persistConfig.ts       # Redux Persist configuration
   ┃ ┣ rootReducer.ts         # Root reducer combining slices
   ┃ ┗ store.ts               # Redux store configuration
   ┗ screens/
      ┣ Home/
      ┃ ┣ AddTaskScreen.tsx       # Screen to add new tasks
      ┃ ┣ ChangePasswordScreen.tsx  # Screen to change password
      ┃ ┣ HomeScreen.tsx          # Home screen displaying tasks
      ┃ ┣ ProfileScreen.tsx       # User profile screen
      ┃ ┗ TaskDetailsScreen.tsx   # Task details and edit screen
      ┗ Welcome/
         ┣ LoginScreen.tsx        # Login screen
         ┗ SignupScreen.tsx       # Signup screen
```

### **Backend**

```
backend/
└─ src/
   ┣ middleware/
   ┃ ┗ authMiddleware.ts    # JWT authentication middleware
   ┣ models/
   ┃ ┣ Task.ts              # Task Mongoose model
   ┃ ┗ User.ts              # User Mongoose model
   ┣ routes/
   ┃ ┣ authRoutes.ts        # Authentication endpoints (signup, login, change-password)
   ┃ ┗ taskRoutes.ts        # Task CRUD endpoints (protected routes)
   ┗ server.ts              # Main Express server file
```

---

## **Getting Started**

### **Backend Setup**

1. **Clone the repository and navigate to the backend folder:**

   ```bash
   cd task-manager-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**  
   Create a `.env` file in the **backend root** with the following variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongo_db_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the backend server:**
   ```bash
   npm run dev
   ```
   The server should start on **http://localhost:5000**.

---

### **Mobile App Setup**

1. **Navigate to the Expo app folder:**

   ```bash
   cd task-manager-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**  
   Create a `.env` file in the **frontend root** with the following variables:

   ```env
   EXPO_PUBLIC_API_BASE_URL=your_api_base_url
   ```

4. **Start the Expo development server:**

   ```bash
   npx expo start
   ```

5. **Test on your device:**
   - Use [Expo Go](https://expo.dev/client) on your mobile device.
   - Or run on an emulator (iOS Simulator or Android Emulator).

---

## **Environment Variables**

### **Backend (`.env`)**

- **PORT**: The port number for the Express server (e.g., `5000`).
- **MONGO_URI**: Your MongoDB connection string.
- **JWT_SECRET**: Secret key for signing JWT tokens.

### **Mobile App (`.env`)**

- **EXPO_PUBLIC_API_BASE_URL**: The base URL for API requests.

---

## **API Endpoints**

### **Authentication**

- `POST /auth/signup` → Register a new user.
- `POST /auth/login` → Authenticate user & return JWT token.
- `PUT /auth/change-password` → Change user password.

### **Task Management**

- `POST /tasks` → Create a new task.
- `GET /tasks` → Retrieve all user tasks.
- `GET /tasks/:id` → Retrieve a specific task.
- `PUT /tasks/:id` → Update a task.
- `DELETE /tasks/:id` → Delete a task.

---

## **Usage**

- **Authentication:** Login and Signup screens handle authentication.
- **Task Management:** Add, view, update, and delete tasks.
- **State Management:** Redux manages auth state, and tasks are fetched from the API.
- **Persistent Storage:** Redux Persist ensures authentication state is saved across app reloads.
