import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft, FaYoutube } from 'react-icons/fa';
import axios from 'axios';

// Mock data - in a real app, this would come from your API
const mockData = {
  sentimentDistribution: {
    agree: 62.9,
    disagree: 17.1,
    neutral: 20
  },
  commentStatistics: {
    totalComments: 1035,
    agree: 456,
    disagree: 234,
    neutral: 345
  },
  monthlyDistribution: [
    { month: 'Jan', count: 120 },
    { month: 'Feb', count: 150 },
    { month: 'Mar', count: 205 },
    
  ],
  topKeywords: [
    { word: 'awesome', count: 58 },
    { word: 'great', count: 53 },
    { word: 'interesting', count: 47 },
    { word: 'thanks', count: 42 },
    { word: 'helpful', count: 39 },
    { word: 'amazing', count: 37 },
    { word: 'perfect', count: 35 },
    { word: 'good', count: 32 }
  ]
};

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('YouTube Video Analysis');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const result = await axios.post("http://localhost:5000/api/gemini/analyze-comments", { videoUrl });
            console.log(result.data);
        } catch (err) {
            console.error(err);
        }
    };

    location.state && setVideoUrl(location.state.youtubeUrl);

    fetchData();
}, []);

  const handleExportCsv = () => {
    // In a real app, this would trigger a download of the CSV file
    alert('CSV file export would start now');
  };

  // Helper function to render sentiment bar
  const renderSentimentBar = (label: string, percentage: number, color: string) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  const maxMonthlyCount = Math.max(...mockData.monthlyDistribution.map(item => item.count));
  
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Search
          </button>
          
          <h2 className="text-white font-medium flex items-center">
            <FaYoutube className="text-red-600 mr-2" />
            {videoTitle}
          </h2>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Analysis Results</h1>
          <button
            onClick={handleExportCsv}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300"
          >
            <FaDownload className="mr-2" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sentiment Distribution */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Sentiment Distribution</h2>
            {renderSentimentBar('Agree', mockData.sentimentDistribution.agree, 'bg-green-500')}
            {renderSentimentBar('Disagree', mockData.sentimentDistribution.disagree, 'bg-red-500')}
            {renderSentimentBar('Neutral', mockData.sentimentDistribution.neutral, 'bg-blue-500')}
          </div>

          {/* Comment Statistics */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Comment Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm font-medium mb-1">Total Comments</h3>
                <p className="text-white text-2xl font-bold">{mockData.commentStatistics.totalComments.toLocaleString()}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-green-500 text-sm font-medium mb-1">Agree</h3>
                <p className="text-green-500 text-2xl font-bold">{mockData.commentStatistics.agree}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-red-500 text-sm font-medium mb-1">Disagree</h3>
                <p className="text-red-500 text-2xl font-bold">{mockData.commentStatistics.disagree}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-blue-500 text-sm font-medium mb-1">Neutral</h3>
                <p className="text-blue-500 text-2xl font-bold">{mockData.commentStatistics.neutral}</p>
              </div>
            </div>
          </div>

          {/* Monthly Distribution */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Monthly Distribution</h2>
            <div className="h-64 flex items-end justify-start gap-2">
              {mockData.monthlyDistribution.map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-end h-full">
                  <div 
                    className="w-12 bg-purple-600 rounded-t-md transition-all duration-500"
                    style={{ 
                      height: `${(item.count / maxMonthlyCount) * 100}%`,
                      minHeight: '10%' 
                    }}
                  ></div>
                  <div className="text-gray-400 mt-2">{item.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Keywords */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Top Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {mockData.topKeywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-2 bg-gray-700 text-gray-300 rounded-full text-sm"
                >
                  {keyword.word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;