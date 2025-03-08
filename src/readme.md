# YouTube Comments Analyzer

## 📌 Project Overview
The **YouTube Comments Analyzer** is a tool that fetches comments from a given YouTube video URL, analyzes the sentiments using the Gemini AI API, and displays insights in a structured dashboard.

## 🚀 Features
- Fetches comments from YouTube videos via the YouTube API
- Stores comments in a MongoDB database
- Uses Gemini API to analyze sentiment (Agree, Disagree, Neutral)
- Displays sentiment analysis and monthly distribution
- Shows keyword statistics and comments insights
- Utilizes Redux for state management

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Redux Toolkit, Recharts, TailwindCSS
- **Backend**: Node.js, Express, MongoDB, YouTube API, Gemini API
- **Deployment**: Vercel (Frontend), Render (Backend)

## 🧩 Project Structure
```
root/
│── backend/               # Node.js Express server
│── frontend/              # React application
│── README.md              # Project documentation
│── .gitignore             # Ignored files for Git
│── package.json           # Dependencies & scripts
```

## 🔄 Backend Logic
1. **Fetch YouTube Comments:** 
   - The backend receives a YouTube video URL.
   - Fetches comments using the **YouTube Data API**.
   - Stores comments in the MongoDB database.

2. **Analyze Comments:** 
   - Calls the **Gemini API** for each comment.
   - Analyzes sentiment (Agree, Disagree, Neutral).
   - Updates the comment data with the sentiment score.

3. **Provide Data to Frontend:** 
   - API routes return processed comments.
   - Includes **monthly distribution, keywords, and statistics**.

## 🎨 Frontend Workflow
1. Fetches processed comment data from the backend.
2. Displays statistics, sentiment analysis, and keyword insights.
3. Uses **Recharts** for data visualization.
4. Implements **Redux Toolkit** for state management.

## 🛠️ Setup & Installation
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/youtube-comments-analyzer.git
cd youtube-comments-analyzer
```

### 2️⃣ Install Dependencies
#### Backend
```bash
cd backend
npm install
```
#### Frontend
```bash
cd frontend
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the `backend/` directory and add:
```
YOUTUBE_API_KEY=your_youtube_api_key
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=your_mongodb_connection_string
```

### 4️⃣ Run the Application
#### Backend
```bash
cd backend
npm start
```
#### Frontend
```bash
cd frontend
npm run dev
```

## 🚀 Deployment
- **Frontend:** Deploy on Vercel with `npm run build`
- **Backend:** Deploy on Render

## 📌 Future Enhancements
- Support for more AI models for analysis
- Advanced filtering options
- User authentication & saved reports

## 👨‍💻 Author
**Ansh** - Developer & Creator 🚀

## 📜 License
This project is open-source under the MIT License.
