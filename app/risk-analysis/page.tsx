'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { AlertTriangle, Shield, AlertCircle, BookOpen, Coffee, GraduationCap, Dumbbell, Home as HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskData {
    summary: {
        highRisk: number;
        moderateRisk: number;
        lowRisk: number;
    };
    lowScoreFacilities: {
        library: number;
        cafeteria: number;
        classroom: number;
        sports: number;
        hostel: number;
    };
    departmentRisks: Array<{
        department: string;
        high: number;
        moderate: number;
        low: number;
        total: number;
    }>;
    criticalStudents: Array<{
        id: string;
        major: string;
        year: string;
        lowScoreFacilityCount: number;
    }>;
}

const facilityIcons = {
    library: BookOpen,
    cafeteria: Coffee,
    classroom: GraduationCap,
    sports: Dumbbell,
    hostel: HomeIcon,
};

export default function RiskAnalysisPage() {
    const [data, setData] = useState<RiskData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiService.getRiskAnalysis();
                setData(response.data);
            } catch (error) {
                console.error('Error fetching risk analysis:', error);
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
                    <p className="text-gray-400">Loading risk analysis...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-400">Failed to load risk analysis</p>
                </div>
            </div>
        );
    }

    const totalStudents = data.summary.highRisk + data.summary.moderateRisk + data.summary.lowRisk;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    Risk Analysis Dashboard
                </h1>
                <p className="text-gray-400">
                    Comprehensive risk assessment and critical areas requiring attention
                </p>
            </div>

            {/* Risk Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass rounded-xl p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                            <span className="text-sm text-gray-400">High Risk</span>
                        </div>
                        <span className="text-4xl font-bold text-red-400">{data.summary.highRisk}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-red-500 transition-all duration-500"
                            style={{ width: `${(data.summary.highRisk / totalStudents) * 100}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                        {((data.summary.highRisk / totalStudents) * 100).toFixed(1)}% of total students
                    </div>
                </div>

                <div className="glass rounded-xl p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                            <span className="text-sm text-gray-400">Moderate Risk</span>
                        </div>
                        <span className="text-4xl font-bold text-yellow-400">{data.summary.moderateRisk}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-yellow-500 transition-all duration-500"
                            style={{ width: `${(data.summary.moderateRisk / totalStudents) * 100}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                        {((data.summary.moderateRisk / totalStudents) * 100).toFixed(1)}% of total students
                    </div>
                </div>

                <div className="glass rounded-xl p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <Shield className="w-6 h-6 text-green-400" />
                            <span className="text-sm text-gray-400">Low Risk</span>
                        </div>
                        <span className="text-4xl font-bold text-green-400">{data.summary.lowRisk}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${(data.summary.lowRisk / totalStudents) * 100}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                        {((data.summary.lowRisk / totalStudents) * 100).toFixed(1)}% of total students
                    </div>
                </div>
            </div>

            {/* Facilities with Low Scores */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Facilities with Low Satisfaction</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries(data.lowScoreFacilities)
                        .sort((a, b) => b[1] - a[1])
                        .map(([facility, count]) => {
                            const Icon = facilityIcons[facility as keyof typeof facilityIcons];
                            const percentage = (count / totalStudents) * 100;

                            return (
                                <div key={facility} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <Icon className="w-5 h-5 text-red-400" />
                                        <span className="text-sm text-gray-400 capitalize">{facility}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-red-400 mb-2">{count}</div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-1">
                                        <div
                                            className="h-full bg-red-500 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {percentage.toFixed(1)}% low satisfaction
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Department Risk Breakdown */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Department-wise Risk Distribution</h2>
                <div className="space-y-4">
                    {data.departmentRisks
                        .sort((a, b) => b.high - a.high)
                        .map((dept) => {
                            const highPercentage = (dept.high / dept.total) * 100;
                            const moderatePercentage = (dept.moderate / dept.total) * 100;
                            const lowPercentage = (dept.low / dept.total) * 100;

                            return (
                                <div key={dept.department} className="bg-white/5 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-white">{dept.department}</h3>
                                            <p className="text-sm text-gray-400">{dept.total} students</p>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm">
                                            <div className="text-center">
                                                <div className="text-red-400 font-bold">{dept.high}</div>
                                                <div className="text-gray-500 text-xs">High</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-yellow-400 font-bold">{dept.moderate}</div>
                                                <div className="text-gray-500 text-xs">Moderate</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-green-400 font-bold">{dept.low}</div>
                                                <div className="text-gray-500 text-xs">Low</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden flex">
                                        {dept.high > 0 && (
                                            <div
                                                className="bg-red-500 transition-all duration-500"
                                                style={{ width: `${highPercentage}%` }}
                                                title={`High Risk: ${highPercentage.toFixed(1)}%`}
                                            />
                                        )}
                                        {dept.moderate > 0 && (
                                            <div
                                                className="bg-yellow-500 transition-all duration-500"
                                                style={{ width: `${moderatePercentage}%` }}
                                                title={`Moderate Risk: ${moderatePercentage.toFixed(1)}%`}
                                            />
                                        )}
                                        {dept.low > 0 && (
                                            <div
                                                className="bg-green-500 transition-all duration-500"
                                                style={{ width: `${lowPercentage}%` }}
                                                title={`Low Risk: ${lowPercentage.toFixed(1)}%`}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Critical Students */}
            {data.criticalStudents.length > 0 && (
                <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span>Critical Students (High Risk)</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.criticalStudents.slice(0, 12).map((student) => (
                            <div key={student.id} className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-sm text-gray-400">{student.id}</span>
                                    <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                                        {student.lowScoreFacilityCount} low scores
                                    </span>
                                </div>
                                <div className="text-white font-semibold">{student.major}</div>
                                <div className="text-sm text-gray-400">{student.year}</div>
                            </div>
                        ))}
                    </div>
                    {data.criticalStudents.length > 12 && (
                        <div className="mt-4 text-center text-sm text-gray-400">
                            Showing 12 of {data.criticalStudents.length} critical students
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
