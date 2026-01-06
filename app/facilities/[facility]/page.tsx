'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';
import { ArrowLeft, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { cn, getRatingColor, capitalizeFirst } from '@/lib/utils';


interface FacilityData {
    facility: string;
    overallAverage: string;
    metricAverages: Record<string, string>;
    satisfactionDistribution: {
        high: number;
        medium: number;
        low: number;
    };
    ratingDistribution: Array<{
        rating: number;
        count: number;
    }>;
    departmentBreakdown: Array<{
        department: string;
        average: string;
        count: number;
    }>;
    totalResponses: number;
}

const metricLabels: Record<string, Record<string, string>> = {
    library: {
        lib_books: 'Book Collection',
        lib_environment: 'Environment',
        lib_digital: 'Digital Resources',
        lib_seating: 'Seating Availability',
        lib_staff: 'Staff Helpfulness',
    },
    cafeteria: {
        caf_food_quality: 'Food Quality',
        caf_cleanliness: 'Cleanliness',
        caf_service_speed: 'Service Speed',
        caf_price_affordability: 'Price Affordability',
        caf_seating: 'Seating Availability',
    },
    classroom: {
        class_seating: 'Seating Comfort',
        class_cleanliness: 'Cleanliness',
        class_av: 'AV Equipment',
        class_ventilation: 'Ventilation',
        class_internet: 'Internet Connectivity',
    },
    sports: {
        sport_equipment: 'Equipment Quality',
        sport_maintenance: 'Maintenance',
        sport_trainer: 'Trainer Availability',
        sport_safety: 'Safety Measures',
        sport_timings: 'Operating Hours',
    },
    hostel: {
        hostel_room_clean: 'Room Cleanliness',
        hostel_food: 'Food Quality',
        hostel_security: 'Security',
        hostel_utilities: 'Utilities',
        hostel_maintenance: 'Maintenance',
    },
};

export default function FacilityPage() {
    const params = useParams();
    const router = useRouter();
    const facility = params.facility as string;

    const [data, setData] = useState<FacilityData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiService.getFacilityAnalytics(facility);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching facility data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [facility]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading facility data...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-400">Failed to load facility data</p>
                </div>
            </div>
        );
    }

    const rating = parseFloat(data.overallAverage);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </button>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {capitalizeFirst(facility)} Analytics
                    </h1>
                    <p className="text-gray-400">
                        Detailed analysis from {data.totalResponses} student responses
                    </p>
                </div>

                <div className="glass rounded-xl p-6 text-center">
                    <div className={cn("text-5xl font-bold mb-2", getRatingColor(rating))}>
                        {data.overallAverage}
                    </div>
                    <div className="text-sm text-gray-400">Overall Rating</div>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <div
                                key={star}
                                className={cn(
                                    "w-3 h-3 rounded-full",
                                    star <= rating ? "bg-yellow-500" : "bg-gray-700"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Satisfaction Distribution */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Satisfaction Distribution</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">
                            {data.satisfactionDistribution.high}
                        </div>
                        <div className="text-sm text-gray-400 mb-3">High Satisfaction</div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${(data.satisfactionDistribution.high / data.totalResponses) * 100}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {((data.satisfactionDistribution.high / data.totalResponses) * 100).toFixed(1)}%
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl font-bold text-yellow-400 mb-2">
                            {data.satisfactionDistribution.medium}
                        </div>
                        <div className="text-sm text-gray-400 mb-3">Medium Satisfaction</div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 transition-all duration-500"
                                style={{ width: `${(data.satisfactionDistribution.medium / data.totalResponses) * 100}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {((data.satisfactionDistribution.medium / data.totalResponses) * 100).toFixed(1)}%
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl font-bold text-red-400 mb-2">
                            {data.satisfactionDistribution.low}
                        </div>
                        <div className="text-sm text-gray-400 mb-3">Low Satisfaction</div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 transition-all duration-500"
                                style={{ width: `${(data.satisfactionDistribution.low / data.totalResponses) * 100}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {((data.satisfactionDistribution.low / data.totalResponses) * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Metric Breakdown */}
            <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Metric Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(data.metricAverages).map(([key, value]) => {
                        const metricRating = parseFloat(value);
                        const label = metricLabels[facility]?.[key] || key;

                        return (
                            <div key={key} className="glass rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-400">{label}</h3>
                                    <div className={cn("text-2xl font-bold", getRatingColor(metricRating))}>
                                        {value}
                                    </div>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-500",
                                            metricRating >= 4 ? "bg-green-500" : metricRating >= 3 ? "bg-yellow-500" : "bg-red-500"
                                        )}
                                        style={{ width: `${(metricRating / 5) * 100}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Department Breakdown */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Department-wise Analysis</h2>
                <div className="space-y-4">
                    {data.departmentBreakdown
                        .sort((a, b) => parseFloat(b.average) - parseFloat(a.average))
                        .map((dept) => {
                            const deptRating = parseFloat(dept.average);
                            return (
                                <div key={dept.department} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-white">{dept.department}</span>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm text-gray-400">{dept.count} students</span>
                                                <span className={cn("text-xl font-bold", getRatingColor(deptRating))}>
                                                    {dept.average}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-500",
                                                    deptRating >= 4 ? "bg-green-500" : deptRating >= 3 ? "bg-yellow-500" : "bg-red-500"
                                                )}
                                                style={{ width: `${(deptRating / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Rating Distribution */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Rating Distribution</h2>
                <div className="space-y-4">
                    {data.ratingDistribution.reverse().map((item) => (
                        <div key={item.rating} className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 w-24">
                                <span className="text-gray-400">{item.rating}</span>
                                <div className="flex items-center space-x-1">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <div key={i} className="w-2 h-2 bg-yellow-500 rounded-full" />
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="h-8 bg-gray-800 rounded-lg overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center px-3 transition-all duration-500"
                                        style={{ width: `${(item.count / data.totalResponses) * 100}%` }}
                                    >
                                        {item.count > 0 && (
                                            <span className="text-xs font-medium text-white">{item.count}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-400 w-16 text-right">
                                {((item.count / data.totalResponses) * 100).toFixed(1)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
