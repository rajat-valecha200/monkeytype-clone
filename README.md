```markdown
# MonkeyType Clone

A full-stack typing speed test application inspired by MonkeyType, featuring user authentication, typing statistics tracking, and performance analysis.

## Features

✨ **Typing Test Interface**
- Real-time WPM (Words Per Minute) calculation
- Accuracy measurement
- Multiple test durations

🔐 **User Authentication**
- Login/Register functionality
- Secure password storage
- Session management

📊 **Statistics Dashboard**
- WPM progress over time
- Accuracy trends
- Error analysis (most common mistakes)
- Performance insights

## Tech Stack

**Frontend:**
- React.js
- Chart.js (for data visualization)
- CSS Modules
- Axios (for API calls)

**Backend:**
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (for authentication)

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB installation
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rajat-valecha200/monkeytype-clone.git
cd monkeytype-clone
```

2. Set up frontend:
```bash
cd frontend
npm install
```

3. Set up backend:
```bash
cd ../backend
npm install
```

4. Environment Setup:
   - Create `.env` files in both `frontend` and `backend` folders
   - See `.env.example` files for required variables

### Running the Application

1. Start backend server:
```bash
cd backend
npm start
```

2. Start frontend development server:
```bash
cd ../frontend
npm start
```

## Configuration

### Frontend `.env`
```
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_GOOGLE_ANALYTICS_ID=your-id-here
```

### Backend `.env`
```
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key-here
PORT=5000
```


## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details
```

### Additional Recommendations:

1. Create `.env.example` files in both frontend and backend folders with template variables (without actual secrets) so others know what to include.

2. For the frontend `.env.example`:
```
REACT_APP_API_BASE_URL=your_api_base_url
REACT_APP_GOOGLE_ANALYTICS_ID=your_id_here
```

3. For the backend `.env.example`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

