


import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft, FaYoutube } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from './../hooks';
import { fetchComments, resetComments, setVideoTitle } from './../Slices/CommentSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Helper function to parse ISO date string
const parseDate = (dateString: string): { month: string, year: number } => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return { month, year };
};

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get comments data from Redux store
  const { items: comments, videoTitle, loading, error } = useAppSelector(state => state.comments);

  useEffect(() => {
    if (location.state?.youtubeUrl) {
      // Reset comments when loading a new video
      dispatch(resetComments());
      // Fetch comments for the video URL
      dispatch(fetchComments(location.state.youtubeUrl));
    } else {
      // If someone navigates directly to the dashboard without going through the form
      navigate('/');
    }
    
    // Clean up on unmount
    return () => {
      dispatch(resetComments());
    };
  }, [dispatch, location.state, navigate]);

  // Calculate sentiment distribution
  const sentimentDistribution = useMemo(() => {
    if (!comments.length) return { agree: 0, disagree: 0, neutral: 0 };
    
    const counts = comments.reduce(
      (acc, comment) => {
        if (comment.sentiment === 'Agree') acc.agree++;
        else if (comment.sentiment === 'Disagree') acc.disagree++;
        else if (comment.sentiment === 'Neutral') acc.neutral++;
        return acc;
      },
      { agree: 0, disagree: 0, neutral: 0 }
    );
    
    const total = comments.length;
    return {
      agree: Number(((counts.agree / total) * 100).toFixed(1)),
      disagree: Number(((counts.disagree / total) * 100).toFixed(1)),
      neutral: Number(((counts.neutral / total) * 100).toFixed(1))
    };
  }, [comments]);

  // Calculate comment statistics
  const commentStatistics = useMemo(() => {
    if (!comments.length) return { totalComments: 0, agree: 0, disagree: 0, neutral: 0 };
    
    return comments.reduce(
      (acc, comment) => {
        acc.totalComments++;
        if (comment.sentiment === 'Agree') acc.agree++;
        else if (comment.sentiment === 'Disagree') acc.disagree++;
        else if (comment.sentiment === 'Neutral') acc.neutral++;
        return acc;
      },
      { totalComments: 0, agree: 0, disagree: 0, neutral: 0 }
    );
  }, [comments]);

  // Calculate monthly distribution
  const monthlyDistribution = useMemo(() => {
    if (!comments.length) return [];
    
    const monthCounts: Record<string, number> = {};
    
    comments.forEach(comment => {
      const { month } = parseDate(comment.timestamp);
      if (!monthCounts[month]) monthCounts[month] = 0;
      monthCounts[month]++;
    });
    
    // Convert to array and sort by common month order
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months
      .map(month => ({
        month,
        count: monthCounts[month]
      }));
  }, [comments]);

  // Calculate top keywords
  const topKeywords = useMemo(() => {
    if (!comments.length) return [];
    
    const wordCounts: Record<string, number> = {};
    const stopWords = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'for', 'with', 'on', 'at', 'by', 'this', 'that', 'it', 'i', 'you', 'he', 'she', 'they', 'we', 'just', 'know']);
    
    comments.forEach(comment => {
      const words = comment.text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 5 && !stopWords.has(word));
      
      words.forEach(word => {
        if (!wordCounts[word]) wordCounts[word] = 0;
        wordCounts[word]++;
      });
    });
    
    // Convert to array, sort by count, and take top 8
    return Object.entries(wordCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [comments]);

  const handleExportCsv = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Comment ID,Masked Username,Text,Timestamp,Sentiment\n";
    
    comments.forEach(comment => {
      const escapedText = `"${comment.text.replace(/"/g, '""')}"`;
      csvContent += `${comment.commentId},${comment.maskedUsername},${escapedText},${comment.timestamp},${comment.sentiment}\n`;
    });
    
    // Create download link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `comments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Custom tooltip for the monthly distribution chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-transparent p-3 rounded-md border border-gray-700 shadow-lg">
          <p className="text-gray-300">{`${label}: ${payload[0].value} comments`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Display loading state or error message
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-xl text-white">Analyzing comments...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-400 hover:text-white transition-colors sm:text-sm"
          >
            <FaArrowLeft className="mr-2" />
            Back to Search
          </button>
          
          
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Analysis Results</h1>
          <button
            onClick={handleExportCsv}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300"
            disabled={comments.length === 0}
          >
            <FaDownload className="mr-2" />
            Export CSV
          </button>
        </div>

        {comments.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-gray-400">No comments data available. Try analyzing a different video.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment Distribution */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Sentiment Distribution</h2>
              {renderSentimentBar('Agree', sentimentDistribution.agree, 'bg-green-500')}
              {renderSentimentBar('Disagree', sentimentDistribution.disagree, 'bg-red-500')}
              {renderSentimentBar('Neutral', sentimentDistribution.neutral, 'bg-blue-500')}
            </div>

            {/* Comment Statistics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Comment Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Total Comments</h3>
                  <p className="text-white text-2xl font-bold">{commentStatistics.totalComments.toLocaleString()}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-green-500 text-sm font-medium mb-1">Agree</h3>
                  <p className="text-green-500 text-2xl font-bold">{commentStatistics.agree}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-red-500 text-sm font-medium mb-1">Disagree</h3>
                  <p className="text-red-500 text-2xl font-bold">{commentStatistics.disagree}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-blue-500 text-sm font-medium mb-1">Neutral</h3>
                  <p className="text-blue-500 text-2xl font-bold">{commentStatistics.neutral}</p>
                </div>
              </div>
            </div>

            {/* Monthly Distribution - Using Recharts */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Monthly Distribution</h2>
              {monthlyDistribution.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyDistribution}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      {/* <Tooltip content={<CustomTooltip />} /> */}
                      <Bar dataKey="count" name="Comments" fill="#9333EA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-400 h-64 flex items-center justify-center">
                  No monthly data available
                </p>
              )}
            </div>

            {/* Top Keywords */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Top Keywords</h2>
              {topKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {topKeywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-3 py-2 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {keyword.word}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No keyword data available</p>
              )}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;