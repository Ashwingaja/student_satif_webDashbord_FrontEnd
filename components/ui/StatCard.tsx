'use client';

import { LucideIcon } from 'lucide-react';
import { cn, getRatingColor, getRatingBgColor } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
    rating?: number;
}

const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-pink-500',
    purple: 'from-purple-500 to-pink-500',
};

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = 'blue',
    rating,
}: StatCardProps) {
    return (
        <div className="glass glass-hover rounded-xl p-6 group animate-in">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">{title}</p>
                    <div className="flex items-baseline space-x-2">
                        <h3 className={cn(
                            "text-3xl font-bold",
                            rating ? getRatingColor(rating) : "text-white"
                        )}>
                            {value}
                        </h3>
                        {trend && (
                            <span className={cn(
                                "text-sm font-medium",
                                trend.isPositive ? "text-green-400" : "text-red-400"
                            )}>
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>

                <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br group-hover:scale-110 transition-transform",
                    rating ? getRatingBgColor(rating) : `bg-gradient-to-br ${colorClasses[color]}/20`
                )}>
                    <Icon className={cn(
                        "w-6 h-6",
                        rating ? getRatingColor(rating) : `text-${color}-400`
                    )} />
                </div>
            </div>

            {rating !== undefined && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Rating</span>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                    key={star}
                                    className={cn(
                                        "w-2 h-2 rounded-full",
                                        star <= rating ? getRatingBgColor(rating) : "bg-gray-700"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
