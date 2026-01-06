'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import StatCard from '@/components/ui/StatCard';
import FacilityCard from '@/components/ui/FacilityCard';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Coffee,
  GraduationCap,
  Dumbbell,
  Home as HomeIcon
} from 'lucide-react';

interface OverviewData {
  totalStudents: number;
  avgCampusSatisfaction: string;
  facilityAverages: {
    library: string;
    cafeteria: string;
    classroom: string;
    sports: string;
    hostel: string;
  };
  satisfactionLevels: {
    high: number;
    medium: number;
    low: number;
  };
  needsImprovement: number;
  improvementPercentage: string;
  riskDistribution: {
    low: number;
    moderate: number;
    high: number;
  };
}

const facilityConfig = [
  { key: 'library', name: 'Library', icon: BookOpen, color: 'blue', href: '/facilities/library' },
  { key: 'cafeteria', name: 'Cafeteria', icon: Coffee, color: 'orange', href: '/facilities/cafeteria' },
  { key: 'classroom', name: 'Classroom', icon: GraduationCap, color: 'purple', href: '/facilities/classroom' },
  { key: 'sports', name: 'Sports', icon: Dumbbell, color: 'green', href: '/facilities/sports' },
  { key: 'hostel', name: 'Hostel', icon: HomeIcon, color: 'pink', href: '/facilities/hostel' },
];

export default function Home() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiService.getOverview();
        setData(response.data);
      } catch (error) {
        console.error('Error fetching overview:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">Failed to load data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Campus Facility Dashboard
        </h1>
        <p className="text-gray-400">
          Comprehensive analytics and insights from {data.totalStudents} student responses
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={data.totalStudents}
          subtitle="Survey responses"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Campus Satisfaction"
          value={data.avgCampusSatisfaction}
          subtitle="Average rating"
          icon={TrendingUp}
          color="green"
          rating={parseFloat(data.avgCampusSatisfaction)}
        />
        <StatCard
          title="High Satisfaction"
          value={data.satisfactionLevels.high}
          subtitle={`${((data.satisfactionLevels.high / data.totalStudents) * 100).toFixed(1)}% of students`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Needs Improvement"
          value={data.needsImprovement}
          subtitle={`${data.improvementPercentage}% of students`}
          icon={AlertTriangle}
          color="yellow"
        />
      </div>

      {/* Risk Distribution */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Risk Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Low Risk</span>
              <span className="text-2xl font-bold text-green-400">{data.riskDistribution.low}</span>
            </div>
            <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(data.riskDistribution.low / data.totalStudents) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Moderate Risk</span>
              <span className="text-2xl font-bold text-yellow-400">{data.riskDistribution.moderate}</span>
            </div>
            <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 transition-all duration-500"
                style={{ width: `${(data.riskDistribution.moderate / data.totalStudents) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">High Risk</span>
              <span className="text-2xl font-bold text-red-400">{data.riskDistribution.high}</span>
            </div>
            <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-500"
                style={{ width: `${(data.riskDistribution.high / data.totalStudents) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Overview */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">Facilities Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilityConfig.map((facility) => (
            <FacilityCard
              key={facility.key}
              name={facility.name}
              icon={facility.icon}
              rating={parseFloat(data.facilityAverages[facility.key as keyof typeof data.facilityAverages])}
              totalResponses={data.totalStudents}
              satisfactionLevels={data.satisfactionLevels}
              href={facility.href}
              color={facility.color}
            />
          ))}
        </div>
      </div>

      {/* Satisfaction Breakdown */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Overall Satisfaction Breakdown</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span className="text-gray-300">High Satisfaction</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-green-400">{data.satisfactionLevels.high}</span>
              <span className="text-sm text-gray-400">
                {((data.satisfactionLevels.high / data.totalStudents) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <span className="text-gray-300">Medium Satisfaction</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-yellow-400">{data.satisfactionLevels.medium}</span>
              <span className="text-sm text-gray-400">
                {((data.satisfactionLevels.medium / data.totalStudents) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span className="text-gray-300">Low Satisfaction</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-red-400">{data.satisfactionLevels.low}</span>
              <span className="text-sm text-gray-400">
                {((data.satisfactionLevels.low / data.totalStudents) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
