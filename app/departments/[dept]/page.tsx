'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';
import { ArrowLeft, Users, AlertTriangle, BookOpen, Coffee, GraduationCap, Dumbbell, Home as HomeIcon } from 'lucide-react';
import { cn, getRatingColor } from '@/lib/utils';

interface DepartmentData {
    department: string;
    totalStudents: number;
    facilityRatings: {
        library: string;
        cafeteria: string;
        classroom: string;
        sports: string;
        hostel: string;
    };
    yearDistribution: Record<string, {
        count: number;
        avgSatisfaction: string;
    }>;
    riskCounts: {
        low: number;
        moderate: number;
        high: number;
    };
    needsImprovement: number;
}

const facilityIcons = {
    library: BookOpen,
    cafeteria: Coffee,
    classroom: GraduationCap,
    sports: Dumbbell,
    hostel: HomeIcon,
};

const facilityColors = {
    library: 'blue',
    cafeteria: 'orange',
    classroom: 'purple',
    sports: 'green',
    hostel: 'pink',
};

export default function DepartmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dept = params.dept as string;

    const [data, setData] = useState<DepartmentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiService.getDepartmentAnalytics(dept);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching department data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [dept]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading department data...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-400">Failed to load department data</p>
                </div>
            </div>
        );
    }

    const avgFacilityRating = Object.values(data.facilityRatings).reduce((sum, rating) => sum + parseFloat(rating), 0) / 5;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Departments</span>
                </button>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {dept} Department
                </h1>
                <p className="text-gray-400 mt-2">
                    Detailed analytics from {data.totalStudents} student responses
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-gray-400">Students</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{data.totalStudents}</div>
                </div>

                <div className="glass rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <GraduationCap className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-gray-400">Avg Rating</span>
                    </div>
                    <div className={cn("text-3xl font-bold", getRatingColor(avgFacilityRating))}>
                        {avgFacilityRating.toFixed(2)}
                    </div>
                </div>

                <div className="glass rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-400">Needs Improvement</span>
                    </div>
                    <div className="text-3xl font-bold text-yellow-400">{data.needsImprovement}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {((data.needsImprovement / data.totalStudents) * 100).toFixed(1)}%
                    </div>
                </div>

                <div className="glass rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span className="text-sm text-gray-400">High Risk</span>
                    </div>
                    <div className="text-3xl font-bold text-red-400">{data.riskCounts.high}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {((data.riskCounts.high / data.totalStudents) * 100).toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* Facility Ratings */}
            <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Facility Ratings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(data.facilityRatings).map(([facility, rating]) => {
                        const Icon = facilityIcons[facility as keyof typeof facilityIcons];
                        const color = facilityColors[facility as keyof typeof facilityColors];
                        const ratingNum = parseFloat(rating);

                        return (
                            <div key={facility} className="glass rounded-xl p-6 hover:scale-105 transition-transform">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <Icon className={`w-6 h-6 text-${color}-400`} />
                                        <h3 className="text-lg font-semibold text-white capitalize">{facility}</h3>
                                    </div>
                                    <span className={cn("text-2xl font-bold", getRatingColor(ratingNum))}>
                                        {rating}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-500",
                                            ratingNum >= 4 ? "bg-green-500" : ratingNum >= 3 ? "bg-yellow-500" : "bg-red-500"
                                        )}
                                        style={{ width: `${(ratingNum / 5) * 100}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Year Distribution */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Year-wise Distribution</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(data.yearDistribution)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([year, stats]) => {
                            const avgRating = parseFloat(stats.avgSatisfaction);
                            return (
                                <div key={year} className="bg-white/5 rounded-lg p-4">
                                    <div className="text-sm text-gray-400 mb-2">{year}</div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl font-bold text-white">{stats.count}</span>
                                        <span className={cn("text-lg font-semibold", getRatingColor(avgRating))}>
                                            {stats.avgSatisfaction}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-500",
                                                avgRating >= 4 ? "bg-green-500" : avgRating >= 3 ? "bg-yellow-500" : "bg-red-500"
                                            )}
                                            style={{ width: `${(avgRating / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Risk Assessment */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Risk Assessment</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/20">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400">Low Risk</span>
                            <span className="text-3xl font-bold text-green-400">{data.riskCounts.low}</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${(data.riskCounts.low / data.totalStudents) * 100}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            {((data.riskCounts.low / data.totalStudents) * 100).toFixed(1)}% of students
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 rounded-lg p-6 border border-yellow-500/20">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400">Moderate Risk</span>
                            <span className="text-3xl font-bold text-yellow-400">{data.riskCounts.moderate}</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 transition-all duration-500"
                                style={{ width: `${(data.riskCounts.moderate / data.totalStudents) * 100}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            {((data.riskCounts.moderate / data.totalStudents) * 100).toFixed(1)}% of students
                        </div>
                    </div>

                    <div className="bg-red-500/10 rounded-lg p-6 border border-red-500/20">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400">High Risk</span>
                            <span className="text-3xl font-bold text-red-400">{data.riskCounts.high}</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 transition-all duration-500"
                                style={{ width: `${(data.riskCounts.high / data.totalStudents) * 100}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            {((data.riskCounts.high / data.totalStudents) * 100).toFixed(1)}% of students
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
