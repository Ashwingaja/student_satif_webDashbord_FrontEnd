'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';
import { BookOpen, Coffee, GraduationCap, Dumbbell, Home as HomeIcon, AlertCircle } from 'lucide-react';
import { cn, getRatingColor } from '@/lib/utils';

interface OverviewData {
    totalStudents: number;
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
}

const facilityConfig = [
    {
        key: 'library',
        name: 'Library',
        icon: BookOpen,
        color: 'blue',
        description: 'Books, digital resources, seating, and staff services',
        metrics: ['Book Collection', 'Environment', 'Digital Resources', 'Seating', 'Staff']
    },
    {
        key: 'cafeteria',
        name: 'Cafeteria',
        icon: Coffee,
        color: 'orange',
        description: 'Food quality, cleanliness, service, and pricing',
        metrics: ['Food Quality', 'Cleanliness', 'Service Speed', 'Affordability', 'Seating']
    },
    {
        key: 'classroom',
        name: 'Classroom',
        icon: GraduationCap,
        color: 'purple',
        description: 'Seating, cleanliness, AV equipment, and connectivity',
        metrics: ['Seating Comfort', 'Cleanliness', 'AV Equipment', 'Ventilation', 'Internet']
    },
    {
        key: 'sports',
        name: 'Sports',
        icon: Dumbbell,
        color: 'green',
        description: 'Equipment, maintenance, trainers, and safety',
        metrics: ['Equipment', 'Maintenance', 'Trainers', 'Safety', 'Timings']
    },
    {
        key: 'hostel',
        name: 'Hostel',
        icon: HomeIcon,
        color: 'pink',
        description: 'Room cleanliness, food, security, and utilities',
        metrics: ['Room Cleanliness', 'Food', 'Security', 'Utilities', 'Maintenance']
    },
];

const colorClasses = {
    blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        icon: 'text-blue-400',
        hover: 'hover:border-blue-500/40 hover:shadow-blue-500/20'
    },
    orange: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        icon: 'text-orange-400',
        hover: 'hover:border-orange-500/40 hover:shadow-orange-500/20'
    },
    purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        icon: 'text-purple-400',
        hover: 'hover:border-purple-500/40 hover:shadow-purple-500/20'
    },
    green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        icon: 'text-green-400',
        hover: 'hover:border-green-500/40 hover:shadow-green-500/20'
    },
    pink: {
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        icon: 'text-pink-400',
        hover: 'hover:border-pink-500/40 hover:shadow-pink-500/20'
    },
};

export default function FacilitiesPage() {
    const router = useRouter();
    const [data, setData] = useState<OverviewData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiService.getOverview();
                setData(response.data);
            } catch (error) {
                console.error('Error fetching facilities overview:', error);
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
                    <p className="text-gray-400">Loading facilities...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-400">Failed to load facilities data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Campus Facilities
                </h1>
                <p className="text-gray-400">
                    Explore detailed analytics for each campus facility from {data.totalStudents} student responses
                </p>
            </div>

            {/* Overall Satisfaction Summary */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Overall Satisfaction Distribution</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/20">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400">High Satisfaction</span>
                            <span className="text-3xl font-bold text-green-400">{data.satisfactionLevels.high}</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${(data.satisfactionLevels.high / data.totalStudents) * 100}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            {((data.satisfactionLevels.high / data.totalStudents) * 100).toFixed(1)}% of students
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 rounded-lg p-6 border border-yellow-500/20">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400">Medium Satisfaction</span>
                            <span className="text-3xl font-bold text-yellow-400">{data.satisfactionLevels.medium}</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 transition-all duration-500"
                                style={{ width: `${(data.satisfactionLevels.medium / data.totalStudents) * 100}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            {((data.satisfactionLevels.medium / data.totalStudents) * 100).toFixed(1)}% of students
                        </div>
                    </div>

                    <div className="bg-red-500/10 rounded-lg p-6 border border-red-500/20">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400">Low Satisfaction</span>
                            <span className="text-3xl font-bold text-red-400">{data.satisfactionLevels.low}</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 transition-all duration-500"
                                style={{ width: `${(data.satisfactionLevels.low / data.totalStudents) * 100}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            {((data.satisfactionLevels.low / data.totalStudents) * 100).toFixed(1)}% of students
                        </div>
                    </div>
                </div>
            </div>

            {/* Facility Cards */}
            <div>
                <h2 className="text-2xl font-semibold text-white mb-6">All Facilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {facilityConfig.map((facility) => {
                        const Icon = facility.icon;
                        const rating = parseFloat(data.facilityAverages[facility.key as keyof typeof data.facilityAverages]);
                        const colors = colorClasses[facility.color as keyof typeof colorClasses];

                        return (
                            <div
                                key={facility.key}
                                onClick={() => router.push(`/facilities/${facility.key}`)}
                                className={cn(
                                    "glass rounded-xl p-6 border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl",
                                    colors.bg,
                                    colors.border,
                                    colors.hover
                                )}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <Icon className={cn("w-8 h-8", colors.icon)} />
                                        <h3 className="text-xl font-bold text-white">{facility.name}</h3>
                                    </div>
                                    <div className={cn("text-3xl font-bold", getRatingColor(rating))}>
                                        {data.facilityAverages[facility.key as keyof typeof data.facilityAverages]}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-400 mb-4">{facility.description}</p>

                                {/* Rating Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">Overall Rating</span>
                                        <span className="text-xs text-gray-500">{rating.toFixed(1)} / 5.0</span>
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
                                </div>

                                {/* Metrics */}
                                <div className="space-y-2">
                                    <div className="text-xs text-gray-500 mb-2">Key Metrics:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {facility.metrics.map((metric) => (
                                            <span
                                                key={metric}
                                                className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400"
                                            >
                                                {metric}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <div className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-between">
                                        <span>View detailed analytics</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Facility Comparison</h2>
                <div className="space-y-4">
                    {facilityConfig
                        .map(f => ({
                            ...f,
                            rating: parseFloat(data.facilityAverages[f.key as keyof typeof data.facilityAverages])
                        }))
                        .sort((a, b) => b.rating - a.rating)
                        .map((facility, index) => {
                            const Icon = facility.icon;
                            const colors = colorClasses[facility.color as keyof typeof colorClasses];

                            return (
                                <div
                                    key={facility.key}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/facilities/${facility.key}`)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                                            index === 0 ? "bg-yellow-500 text-gray-900" :
                                                index === 1 ? "bg-gray-400 text-gray-900" :
                                                    index === 2 ? "bg-orange-600 text-white" :
                                                        "bg-gray-700 text-gray-300"
                                        )}>
                                            {index + 1}
                                        </div>
                                        <Icon className={cn("w-6 h-6", colors.icon)} />
                                        <div>
                                            <div className="font-medium text-white">{facility.name}</div>
                                            <div className="text-sm text-gray-400">{facility.description}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-500",
                                                    facility.rating >= 4 ? "bg-green-500" :
                                                        facility.rating >= 3 ? "bg-yellow-500" : "bg-red-500"
                                                )}
                                                style={{ width: `${(facility.rating / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className={cn("text-2xl font-bold w-16 text-right", getRatingColor(facility.rating))}>
                                            {facility.rating.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
