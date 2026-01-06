'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Building2, Users, AlertTriangle, TrendingUp, Home, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/facilities', label: 'Facilities', icon: Building2 },
    { href: '/departments', label: 'Departments', icon: Users },
    { href: '/risk-analysis', label: 'Risk Analysis', icon: AlertTriangle },
    { href: '/trends', label: 'Trends', icon: TrendingUp },
    { href: '/reviews', label: 'Reviews', icon: MessageSquare },
];

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="glass border-b border-white/10 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Campus Pulse
                            </h1>
                            <p className="text-xs text-gray-400">Facility Feedback Dashboard</p>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200',
                                        isActive
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Stats Badge */}
                    <div className="hidden lg:flex items-center space-x-2 glass px-4 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-gray-400">Live Data</span>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center space-x-1 pb-3 overflow-x-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-fit',
                                    isActive
                                        ? 'bg-blue-500/20 text-blue-400'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
