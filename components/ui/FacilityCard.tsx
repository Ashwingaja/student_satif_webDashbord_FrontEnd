'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn, getRatingColor } from '@/lib/utils';

interface FacilityCardProps {
    name: string;
    icon: LucideIcon;
    rating: number;
    totalResponses: number;
    satisfactionLevels: {
        high: number;
        medium: number;
        low: number;
    };
    href: string;
    color: string;
}

export default function FacilityCard({
    name,
    icon: Icon,
    rating,
    totalResponses,
    satisfactionLevels,
    href,
    color,
}: FacilityCardProps) {
    const highPercentage = (satisfactionLevels.high / totalResponses) * 100;
    const mediumPercentage = (satisfactionLevels.medium / totalResponses) * 100;
    const lowPercentage = (satisfactionLevels.low / totalResponses) * 100;

    return (
        <Link href={href}>
            <div className="glass glass-hover rounded-xl p-6 group cursor-pointer animate-in">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center",
                            `bg-${color}-500/20`
                        )}>
                            <Icon className={cn("w-6 h-6", `text-${color}-400`)} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {name}
                            </h3>
                            <p className="text-sm text-gray-400">{totalResponses} responses</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className={cn("text-2xl font-bold", getRatingColor(rating))}>
                            {rating}
                        </div>
                        <div className="text-xs text-gray-400">/ 5.0</div>
                    </div>
                </div>

                {/* Satisfaction Distribution */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Satisfaction Distribution</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex">
                        <div
                            className="bg-green-500 transition-all duration-500"
                            style={{ width: `${highPercentage}%` }}
                        />
                        <div
                            className="bg-yellow-500 transition-all duration-500"
                            style={{ width: `${mediumPercentage}%` }}
                        />
                        <div
                            className="bg-red-500 transition-all duration-500"
                            style={{ width: `${lowPercentage}%` }}
                        />
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-gray-400">{satisfactionLevels.high} High</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            <span className="text-gray-400">{satisfactionLevels.medium} Med</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-gray-400">{satisfactionLevels.low} Low</span>
                        </div>
                    </div>
                </div>

                {/* View Details Arrow */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm text-gray-400">View Details</span>
                    <svg
                        className="w-4 h-4 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
