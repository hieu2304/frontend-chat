import React from 'react';
import { SessionStats } from '@/types/chat';
import { Card, CardHeader, CardContent, Badge } from '@/components/ui';
import {
  MessageSquare,
  Hash,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Activity
} from 'lucide-react';

interface StatsPanelProps {
  stats: SessionStats;
  className?: string;
}

export default function StatsPanel({ stats, className }: StatsPanelProps) {
  const questionPercentage = stats.totalMessages > 0
    ? Math.round((stats.questionsAsked / stats.totalMessages) * 100)
    : 0;

  const dominantSentiment = Object.entries(stats.sentimentBreakdown).reduce(
    (a, b) => stats.sentimentBreakdown[a[0] as keyof typeof stats.sentimentBreakdown] >
      stats.sentimentBreakdown[b[0] as keyof typeof stats.sentimentBreakdown] ? a : b
  )[0];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className={`h-full bg-gray-50 dark:bg-gray-900 p-6 ${className || ''}`}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Session Analytics
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Real-time statistics for your chat session
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Stats */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Total Messages</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalMessages}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Total Words</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalWords}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Questions Asked</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {stats.questionsAsked}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Averages */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Averages
            </h3>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Avg Message Length</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {stats.avgMessageLength.toFixed(1)} words
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Question Rate</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {questionPercentage}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sentiment Breakdown
            </h3>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Positive</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stats.sentimentBreakdown.positive}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Negative</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stats.sentimentBreakdown.negative}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Minus className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Neutral</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stats.sentimentBreakdown.neutral}
                </span>
              </div>
            </div>

            {stats.totalMessages > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Dominant Sentiment:</span>
                  <Badge
                    variant={getSentimentColor(dominantSentiment)}
                    size="sm"
                  >
                    {dominantSentiment}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


