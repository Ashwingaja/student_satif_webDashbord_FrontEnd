'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';
import { GraduationCap, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { cn, getRatingColor } from '@/lib/utils';

interface DepartmentSummary {
    department: string;
    studentCount: number;
    avgSatisfaction: number;
    riskLevel: string;
}

export default function DepartmentsPage() {
    const router = useRouter();
    const [departments, setDepartments] = useState<string[]>([]);
    const [departmentData, setDepartmentData] = useState<DepartmentSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Get list of departments
                const deptResponse = await apiService.getDepartments();
                const deptList = deptResponse.data;
                setDepartments(deptList);

                // Fetch analytics for each department
                const summaries: DepartmentSummary[] = [];
                for (const dept of deptList) {
                    try {
                        const analytics = await apiService.getDepartmentAnalytics(dept);
                        const data = analytics.data;

                        // Calculate average satisfaction from facility ratings
                        const facilities = Object.values(data.facilityRatings);
                        const avgSatisfaction = facilities.reduce((sum: number, rating: any) => sum + parseFloat(rating), 0) / facilities.length;

                        // Determine risk level
                        let riskLevel = 'Low Risk';
                        if (data.riskCounts.high > 0) riskLevel = 'High Risk';
                        else if (data.riskCounts.moderate > data.riskCounts.low) riskLevel = 'Moderate Risk';

                        summaries.push({
                            department: dept,
                            studentCount: data.totalStudents,
                            avgSatisfaction: parseFloat(avgSatisfaction.toFixed(2)),
                            riskLevel
                        });
                    } catch (error) {
                        console.error(`Error fetching data for ${dept}:`, error);
                    }
                }

                setDepartmentData(summaries.sort((a, b) => b.avgSatisfaction - a.avgSatisfaction));
            } catch (error) {
                console.error('Error fetching departments:', error);
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
                    <p className="text-gray-400">Loading departments...</p>
                </div>
            </div>
        );
    }

    const getRiskColor = (risk: string) => {
        if (risk === 'High Risk') return 'text-red-400';
        if (risk === 'Moderate Risk') return 'text-yellow-400';
        return 'text-green-400';
    };

    const getRiskBgColor = (risk: string) => {
        if (risk === 'High Risk') return 'bg-red-500/10 border-red-500/20';
        if (risk === 'Moderate Risk') return 'bg-yellow-500/10 border-yellow-500/20';
        return 'bg-green-500/10 border-green-500/20';
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Department Analytics
                </h1>
                <p className="text-gray-400">
                    Comparative analysis across {departments.length} departments
                </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <GraduationCap className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-gray-400">Total Departments</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{departments.length}</div>
                </div>

                <div className="glass rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-gray-400">Avg Satisfaction</span>
                    </div>
                    <div className="text-3xl font-bold text-green-400">
                        {departmentData.length > 0
                            ? (departmentData.reduce((sum, d) => sum + d.avgSatisfaction, 0) / departmentData.length).toFixed(2)
                            : '0.00'}
                    </div>
                </div>

                <div className="glass rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        <span className="text-sm text-gray-400">Total Students</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-400">
                        {departmentData.reduce((sum, d) => sum + d.studentCount, 0)}
                    </div>
                </div>
            </div>

            {/* Department Cards */}
            <div>
                <h2 className="text-2xl font-semibold text-white mb-6">All Departments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departmentData.map((dept) => (
                        <div
                            key={dept.department}
                            onClick={() => router.push(`/departments/${dept.department}`)}
                            className="glass rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{dept.department}</h3>
                                    <p className="text-sm text-gray-400">{dept.studentCount} students</p>
                                </div>
                                <GraduationCap className="w-8 h-8 text-blue-400" />
                            </div>

                            <div className="space-y-3">
                                {/* Satisfaction Rating */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-400">Avg Satisfaction</span>
                                        <span className={cn("text-2xl font-bold", getRatingColor(dept.avgSatisfaction))}>
                                            {dept.avgSatisfaction}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-500",
                                                dept.avgSatisfaction >= 4 ? "bg-green-500" :
                                                    dept.avgSatisfaction >= 3 ? "bg-yellow-500" : "bg-red-500"
                                            )}
                                            style={{ width: `${(dept.avgSatisfaction / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Risk Level */}
                                <div className={cn("rounded-lg p-3 border", getRiskBgColor(dept.riskLevel))}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">Risk Level</span>
                                        <span className={cn("text-sm font-semibold", getRiskColor(dept.riskLevel))}>
                                            {dept.riskLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Ranking */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Performance Ranking</h2>
                <div className="space-y-3">
                    {departmentData.map((dept, index) => (
                        <div
                            key={dept.department}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                                    index === 0 ? "bg-yellow-500 text-gray-900" :
                                        index === 1 ? "bg-gray-400 text-gray-900" :
                                            index === 2 ? "bg-orange-600 text-white" :
                                                "bg-gray-700 text-gray-300"
                                )}>
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="font-medium text-white">{dept.department}</div>
                                    <div className="text-sm text-gray-400">{dept.studentCount} students</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className={cn("text-xs px-2 py-1 rounded", getRiskBgColor(dept.riskLevel), getRiskColor(dept.riskLevel))}>
                                    {dept.riskLevel}
                                </span>
                                <span className={cn("text-2xl font-bold", getRatingColor(dept.avgSatisfaction))}>
                                    {dept.avgSatisfaction}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
