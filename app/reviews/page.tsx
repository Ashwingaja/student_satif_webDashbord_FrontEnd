'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Star, User, Clock, PlusCircle } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';
import axios from 'axios';

interface Review {
    id: number;
    name: string;
    rating: number;
    feedback: string;
    timestamp: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews`);
            console.log(response.data)
            const data =  response.data

            if (data.success) {
                setReviews(data.data);
            } else {
                setError(data.error || 'Failed to fetch reviews');
            }
        } catch (err) {
            setError('Failed to connect to server');
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return parseFloat((sum / reviews.length).toFixed(1));
    };

    return (
        <div className="min-h-screen py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Reviews & Feedback</h1>
                            <p className="text-gray-400">See what others are saying</p>
                        </div>
                    </div>
                    <Link
                        href="/reviews/submit"
                        className="flex items-center gap-2 px-6 py-3 gradient-primary rounded-lg text-white font-medium hover:scale-105 transition-transform"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Submit Feedback
                    </Link>
                </div>

                {/* Stats */}
                {reviews.length > 0 && (
                    <div className="glass p-6 rounded-xl">
                        <div className="flex items-center gap-8">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Average Rating</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-white">{getAverageRating()}</span>
                                    <StarRating rating={Math.round(getAverageRating())} size="md" />
                                </div>
                            </div>
                            <div className="h-12 w-px bg-white/10" />
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Total Reviews</p>
                                <p className="text-3xl font-bold text-white">{reviews.length}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="glass p-6 rounded-xl border border-red-500/20">
                    <p className="text-red-400 text-center">{error}</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && reviews.length === 0 && (
                <div className="glass p-12 rounded-xl text-center">
                    <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No reviews yet</h3>
                    <p className="text-gray-400 mb-6">Be the first to share your feedback!</p>
                    <Link
                        href="/reviews/submit"
                        className="inline-flex items-center gap-2 px-6 py-3 gradient-primary rounded-lg text-white font-medium hover:scale-105 transition-transform"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Submit Feedback
                    </Link>
                </div>
            )}

            {/* Reviews Grid */}
            {!loading && !error && reviews.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="glass p-6 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{review.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(review.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="mb-4">
                                <StarRating rating={review.rating} size="sm" />
                            </div>

                            {/* Feedback */}
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {review.feedback}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
