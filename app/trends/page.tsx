'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { TrendingUp, BookOpen, Coffee, GraduationCap, Dumbbell, Home as HomeIcon, AlertCircle } from 'lucide-react';
import { cn, getRatingColor } from '@/lib/utils';

interface TrendData {
    yearTrends: Array<{
        year: string;
        count: number;
        library: string;
        cafeteria: string;
        classroom: string;
        sports: string;
        hostel: string;
    }>;
    facilities: string[];
}

const facilityConfig = {
    library: { icon: BookOpen, color: 'blue', name: 'Library' },
    cafeteria: { icon: Coffee, color: 'orange', name: 'Cafeteria' },
    classroom: { icon: GraduationCap, color: 'purple', name: 'Classroom' },
    sports: { icon: Dumbbell, color: 'green', name: 'Sports' },
    hostel: { icon: HomeIcon, color: 'pink', name: 'Hostel' },
};

export default function TrendsPage() {
    const [data, setData] = useState<TrendData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiService.getTrends();
                setData(response.data);
            } catch (error) {
                console.error('Error fetching trends:', error);
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
                    <p className="text-gray-400">Loading trends...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-400">Failed to load trends</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Satisfaction Trends
                </h1>
                <p className="text-gray-400">
                    Year-wise satisfaction trends across all campus facilities
                </p>
            </div>

            {/* Year Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.yearTrends.map((yearData) => {
                    const avgRating = data.facilities.reduce((sum, facility) => {
                        return sum + parseFloat(yearData[facility as keyof typeof yearData] as string);
                    }, 0) / data.facilities.length;

                    return (
                        <div key={yearData.year} className="glass rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{yearData.year}</h3>
                                    <p className="text-sm text-gray-400">{yearData.count} students</p>
                                </div>
                                <TrendingUp className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className={cn("text-3xl font-bold mb-2", getRatingColor(avgRating))}>
                                {avgRating.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">Average Satisfaction</div>
                        </div>
                    );
                })}
            </div>

            {/* Facility-wise Trends */}
            <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Facility-wise Trends</h2>
                <div className="space-y-6">
                    {data.facilities.map((facility) => {
                        const config = facilityConfig[facility as keyof typeof facilityConfig];
                        const Icon = config.icon;

                        return (
                            <div key={facility} className="glass rounded-xl p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <Icon className={`w-6 h-6 text-${config.color}-400`} />
                                    <h3 className="text-xl font-semibold text-white">{config.name}</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {data.yearTrends.map((yearData) => {
                                        const rating = parseFloat(yearData[facility as keyof typeof yearData] as string);

                                        return (
                                            <div key={yearData.year} className="bg-white/5 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-400">{yearData.year}</span>
                                                    <span className={cn("text-xl font-bold", getRatingColor(rating))}>
                                                        {yearData[facility as keyof typeof yearData]}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full transition-all duration-500",
                                                            rating >= 4 ? "bg-green-500" : rating >= 3 ? "bg-yellow-500" : "bg-red-500"
                                                        )}
                                                        style={{ width: `${(rating / 5) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {yearData.count} responses
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Comparison Table */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Comparative Analysis</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Year</th>
                                <th className="text-center py-3 px-4 text-gray-400 font-medium">Students</th>
                                {data.facilities.map((facility) => (
                                    <th key={facility} className="text-center py-3 px-4 text-gray-400 font-medium capitalize">
                                        {facility}
                                    </th>
                                ))}
                                <th className="text-center py-3 px-4 text-gray-400 font-medium">Average</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.yearTrends.map((yearData) => {
                                const avgRating = data.facilities.reduce((sum, facility) => {
                                    return sum + parseFloat(yearData[facility as keyof typeof yearData] as string);
                                }, 0) / data.facilities.length;

                                return (
                                    <tr key={yearData.year} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4 text-white font-medium">{yearData.year}</td>
                                        <td className="py-3 px-4 text-center text-gray-400">{yearData.count}</td>
                                        {data.facilities.map((facility) => {
                                            const rating = parseFloat(yearData[facility as keyof typeof yearData] as string);
                                            return (
                                                <td key={facility} className="py-3 px-4 text-center">
                                                    <span className={cn("font-semibold", getRatingColor(rating))}>
                                                        {yearData[facility as keyof typeof yearData]}
                                                    </span>
                                                </td>
                                            );
                                        })}
                                        <td className="py-3 px-4 text-center">
                                            <span className={cn("font-bold text-lg", getRatingColor(avgRating))}>
                                                {avgRating.toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
