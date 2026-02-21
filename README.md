# 🎓 Student Project Marketplace

A full-stack MERN application where students can buy and sell their coding projects. Turn your academic projects into profit!

![Student Project Marketplace](https://via.placeholder.com/800x400?text=Student+Project+Marketplace)

## ✨ Features

- **🔐 User Authentication** - JWT-based secure login/register with role selection (buyer/seller)
- **📦 Project Listings** - Upload projects with images, descriptions, tech stack, and pricing
- **🔍 Search & Filter** - Find projects by category, price range, and keywords
- **🛒 Shopping Cart** - Add projects to cart and checkout
- **💳 Payment Integration** - Ready for Razorpay/Stripe integration
- **⭐ Reviews & Ratings** - Rate and review purchased projects
- **📊 Dashboard** - Track sales, purchases, and earnings
- **📱 Responsive Design** - Beautiful dark theme UI that works on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
student-project-marketplace/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth, Cart)
│   │   ├── services/       # API service layer
│   │   └── assets/         # Static assets
│   └── ...
├── server/                 # Node.js backend
│   ├── config/             # Configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── ...
├── .env.example            # Environment variables template
└── package.json            # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas URI
- Git

### Installation

1. **Clone the repository**
   ```bash
   cd student-project-marketplace
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example server/.env
   
   # Edit server/.env with your values
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:5173`

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Create project (seller) |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my-purchases` | Get user's purchases |
| GET | `/api/orders/my-sales` | Get seller's sales |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Create review |
| GET | `/api/reviews/project/:id` | Get project reviews |

## 🎨 Screenshots

### Home Page
Beautiful landing page with hero section, featured projects, and categories.

### Project Listing
Browse projects with search, category filters, and sorting options.

### Dashboard
Track your sales, purchases, earnings, and manage listings.

## 💰 Commission Structure

- **Sellers receive:** 90% of sale price
- **Platform fee:** 10% commission on each transaction

## 🔧 Configuration

Edit `server/.env` to configure:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-marketplace
JWT_SECRET=your-secret-key
```

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Made with ❤️ for students, by students
