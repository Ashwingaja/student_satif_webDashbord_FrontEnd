'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import StarRating from '@/components/ui/StarRating';

export default function SubmitFeedbackPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        rating: 0,
        feedback: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return;
        }
        if (formData.rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!formData.feedback.trim()) {
            setError('Please enter your feedback');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/reviews');
                }, 2000);
            } else {
                setError(data.error || 'Failed to submit feedback');
            }
        } catch (err) {
            setError('Failed to connect to server');
            console.error('Error submitting feedback:', err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass p-8 rounded-xl text-center max-w-md">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
                    <p className="text-gray-400 mb-4">Your feedback has been submitted successfully.</p>
                    <p className="text-sm text-gray-500">Redirecting to reviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/reviews"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Reviews
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Submit Your Feedback</h1>
                    <p className="text-gray-400">We{"'"}d love to hear your thoughts about our campus facilities</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="glass p-8 rounded-xl space-y-6">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Rating
                        </label>
                        <div className="flex items-center gap-4">
                            <StarRating
                                rating={formData.rating}
                                onRatingChange={(rating) => setFormData({ ...formData, rating })}
                                interactive
                                size="lg"
                            />
                            {formData.rating > 0 && (
                                <span className="text-gray-400">
                                    {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Feedback Textarea */}
                    <div>
                        <label htmlFor="feedback" className="block text-sm font-medium text-gray-300 mb-2">
                            Your Feedback
                        </label>
                        <textarea
                            id="feedback"
                            value={formData.feedback}
                            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Share your thoughts, suggestions, or experiences..."
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 gradient-primary rounded-lg text-white font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit Feedback
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
