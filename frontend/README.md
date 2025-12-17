# Live Polling System

A real-time polling system built with Next.js and Express.js that allows teachers to create polls, ask questions, and view live results while students participate and interact.

## 🎯 Features

### Must-Have Requirements ✅
- ✅ Functional system with all core features working
- ✅ Teacher can create polls and ask questions
- ✅ Students can join and submit answers
- ✅ Both teacher and student can view live poll results
- ✅ Hosted frontend and backend
- ✅ UI follows Figma design specifications

### Good-to-Have Features ✅
- ✅ Configurable poll time limit by teacher (30s, 60s, 90s, 120s)
- ✅ Teacher can remove students from poll
- ✅ Well-designed, responsive user interface

### Bonus Features ✅
- ✅ Chat functionality for student-teacher interaction
- ✅ Poll history stored in MongoDB (not local storage)
- ✅ Real-time participant management
- ✅ Live result updates with percentages

## 🏗️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 19** - UI library
- **Redux Toolkit** - State management
- **Socket.io Client** - Real-time communication
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Backend
- **Express.js** - Web server framework
- **Socket.io** - WebSocket for real-time features
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Node.js** - Runtime environment

## 📁 Project Structure

```
Intervue assignment/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── pollController.js
│   ├── models/
│   │   ├── Poll.js
│   │   └── ChatMessage.js
│   ├── routes/
│   │   └── pollRoutes.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── teacher/
│   │   └── student/
│   ├── components/
│   │   ├── QuestionForm.tsx
│   │   ├── QuestionDisplay.tsx
│   │   ├── LiveResults.tsx
│   │   ├── ResultsDisplay.tsx
│   │   ├── ParticipantsList.tsx
│   │   └── ChatPanel.tsx
│   ├── store/
│   │   ├── store.ts
│   │   ├── pollSlice.ts
│   │   └── hooks.ts
│   ├── lib/
│   │   └── socket.ts
│   ├── package.json
│   └── .env.local
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/polling-system
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

4. Start MongoDB (if using local):
```bash
mongod
```

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📖 How to Use

### As a Teacher

1. **Create Poll**
   - Visit the app and select "I'm a Teacher"
   - Enter your name
   - Click "Create New Poll"
   - You'll receive a unique poll code

2. **Share Poll Code**
   - Share the poll code with your students
   - Monitor participants joining in real-time

3. **Ask Questions**
   - Click "+ Ask Question"
   - Enter your question
   - Add 2-6 multiple choice options
   - Select correct answer (optional)
   - Set time limit (30s, 60s, 90s, or 120s)
   - Click "Ask Question"

4. **View Results**
   - See live results as students submit answers
   - View percentages and vote counts
   - See which students have answered

5. **Manage Students**
   - View participant list
   - Remove students if needed (kick out feature)

6. **View History**
   - Click "View Poll History"
   - See all past questions and results

7. **Chat**
   - Click "Chat" button
   - Communicate with students in real-time

### As a Student

1. **Join Poll**
   - Visit the app and select "I'm a Student"
   - Enter your name
   - Enter the poll code provided by teacher
   - Click "Continue"

2. **Answer Questions**
   - Wait for teacher to ask questions
   - Read the question carefully
   - Select your answer
   - Watch the countdown timer
   - Click "Submit" before time runs out

3. **View Results**
   - After submitting, see live results
   - Results update as other students answer
   - Wait for teacher to ask next question

4. **Chat**
   - Click "Chat" button
   - Ask questions or interact with teacher

## 🔑 Key Features Explained

### Real-Time Polling
- Uses Socket.io for instant communication
- No page refresh needed
- Results update live as students answer

### Timer Functionality
- Configurable time limit per question
- Visual countdown display
- Auto-submit when time expires
- Different colors for urgency (red when < 10s)

### Question Flow Control
- Teacher can only ask new question when:
  - No question has been asked yet, OR
  - All students have answered previous question
- Prevents multiple active questions

### Chat System
- Real-time messaging
- Shows sender name and role
- Message history persisted in database
- Separate tabs for chat and participants

### Poll History
- All questions and results stored in MongoDB
- Can view past polls and results
- Not dependent on local storage
- Data persists across sessions

## 🗄️ Database Schema

### Poll Collection
```javascript
{
  pollCode: String,
  teacherId: String,
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String,
    timeLimit: Number,
    answers: [{
      studentName: String,
      studentId: String,
      selectedOption: String,
      answeredAt: Date
    }],
    askedAt: Date,
    isActive: Boolean
  }],
  activeStudents: [{
    studentId: String,
    studentName: String,
    socketId: String,
    joinedAt: Date
  }],
  isActive: Boolean,
  createdAt: Date
}
```

### ChatMessage Collection
```javascript
{
  pollCode: String,
  senderName: String,
  senderId: String,
  senderRole: String,
  message: String,
  timestamp: Date
}
```

## 🌐 API Endpoints

### REST API
- `POST /api/polls/create` - Create new poll
- `GET /api/polls/:pollCode` - Get poll details
- `GET /api/polls/teacher/:teacherId` - Get teacher's polls
- `GET /api/polls/:pollCode/results` - Get poll results
- `GET /api/polls/:pollCode/chat` - Get chat messages

### Socket.io Events
**Teacher:**
- `teacher:join` - Join poll room
- `question:ask` - Broadcast new question
- `student:remove` - Remove student from poll

**Student:**
- `student:join` - Join poll room
- `answer:submit` - Submit answer
- `question:timeout` - Handle timeout

**Chat:**
- `chat:message` - Send/receive messages

**Broadcasts:**
- `poll:data` - Poll updates
- `results:update` - Live results
- `student:joined` - New participant
- `student:left` - Participant left
- `student:kicked` - Student removed

## 🎨 UI/UX Features

- Clean, modern interface matching Figma design
- Indigo color scheme (#4F46E5)
- Responsive design (mobile & desktop)
- Smooth transitions and animations
- Visual feedback for user actions
- Loading states and error handling
- Countdown timer with color changes
- Progress bars for results
- Real-time participant avatars

## 🚢 Deployment

### Backend Deployment (Railway/Render)

1. **Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Render**
   - Connect GitHub repository
   - Add environment variables
   - Deploy

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or use Vercel dashboard:
1. Import GitHub repository
2. Add environment variables
3. Deploy

### MongoDB Atlas

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in backend `.env`

## 🧪 Testing

1. **Open two browser windows**
2. **Window 1 (Teacher):**
   - Select teacher role
   - Create poll
   - Note the poll code

3. **Window 2 (Student):**
   - Select student role
   - Enter poll code
   - Join poll

4. **Test Flow:**
   - Teacher asks question
   - Student receives question instantly
   - Student submits answer
   - Both see live results
   - Test chat functionality
   - Test kick out feature
   - Test poll history

## 📝 Notes

- Each tab is treated as a unique student (based on socket connection)
- Poll codes are 6-character alphanumeric strings
- Default question time limit is 60 seconds
- Maximum 6 options per question
- Minimum 2 options per question
- Chat messages are preserved in database
- All data persists in MongoDB

## 🔧 Troubleshooting

**Socket.io connection issues:**
- Check if backend is running
- Verify CORS settings
- Check environment variables

**MongoDB connection errors:**
- Ensure MongoDB is running (local)
- Check connection string (Atlas)
- Verify network access (Atlas)

**Frontend build errors:**
- Clear `.next` folder
- Delete `node_modules` and reinstall
- Check for TypeScript errors

## 📄 License

This project is created for Intervue assignment.

## 👨‍💻 Author

Created with ❤️ for the Intervue assignment.
