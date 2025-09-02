'use client';

import { useState } from 'react';
import { Upload, Camera, MapPin, Calendar, Users, DollarSign, Instagram, X, Check } from 'lucide-react';

interface ContentSubmissionFormProps {
    contestId?: string;
    onSuccess?: (contentId: string) => void;
    onCancel?: () => void;
}

export default function ContentSubmissionForm({
    contestId,
    onSuccess,
    onCancel
}: ContentSubmissionFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        user_name: '',
        user_email: '',
        user_instagram: '',
        destination_name: '',
        travel_date: '',
        trip_duration: '',
        travel_budget: 'mid-range',
        travel_companions: 'solo',
        campaign_hashtag: ''
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                setError('Please select an image or video file');
                return;
            }

            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }

            setSelectedFile(file);
            setError(null);

            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setError('Please select a file to upload');
            return;
        }

        if (!formData.title.trim()) {
            setError('Please enter a title');
            return;
        }

        if (!formData.user_name.trim() || !formData.user_email.trim()) {
            setError('Please enter your name and email');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const submitFormData = new FormData();
            submitFormData.append('file', selectedFile);

            // Add all form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value) {
                    submitFormData.append(key, value);
                }
            });

            // Add contest ID if provided
            if (contestId) {
                submitFormData.append('contest_id', contestId);
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/social/submit-content`,
                {
                    method: 'POST',
                    body: submitFormData
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to submit content');
            }

            const result = await response.json();

            setSuccess(true);

            // Call success callback
            if (onSuccess) {
                onSuccess(result.content_id);
            }

            // Reset form after delay
            setTimeout(() => {
                setSuccess(false);
                setFormData({
                    title: '',
                    description: '',
                    user_name: '',
                    user_email: '',
                    user_instagram: '',
                    destination_name: '',
                    travel_date: '',
                    trip_duration: '',
                    travel_budget: 'mid-range',
                    travel_companions: 'solo',
                    campaign_hashtag: ''
                });
                setSelectedFile(null);
                setPreviewUrl(null);
            }, 3000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit content');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Content Submitted!</h3>
                <p className="text-gray-600 mb-4">
                    Thank you for sharing your travel experience. Your content is being reviewed and will appear on our feed soon.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Submit Another
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Camera className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Share Your Travel Story</h2>
                    </div>
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <p className="mt-2 text-blue-100">
                    Upload your travel photos and inspire others to explore the world
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Photo/Video *
                    </label>

                    {!selectedFile ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-medium text-gray-700 mb-2">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-gray-500">
                                    PNG, JPG, GIF, MP4 up to 10MB
                                </p>
                            </label>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="border rounded-lg overflow-hidden">
                                {selectedFile.type.startsWith('image/') ? (
                                    <img
                                        src={previewUrl!}
                                        alt="Preview"
                                        className="w-full h-64 object-cover"
                                    />
                                ) : (
                                    <video
                                        src={previewUrl!}
                                        className="w-full h-64 object-cover"
                                        controls
                                    />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreviewUrl(null);
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Give your photo a catchy title..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Tell us about your travel experience..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* User Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name *
                        </label>
                        <input
                            type="text"
                            id="user_name"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="user_email"
                            name="user_email"
                            value={formData.user_email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                {/* Instagram Handle */}
                <div>
                    <label htmlFor="user_instagram" className="block text-sm font-medium text-gray-700 mb-2">
                        <Instagram className="w-4 h-4 inline mr-1" />
                        Instagram Handle (Optional)
                    </label>
                    <input
                        type="text"
                        id="user_instagram"
                        name="user_instagram"
                        value={formData.user_instagram}
                        onChange={handleInputChange}
                        placeholder="@yourusername"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Travel Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="destination_name" className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Destination
                        </label>
                        <input
                            type="text"
                            id="destination_name"
                            name="destination_name"
                            value={formData.destination_name}
                            onChange={handleInputChange}
                            placeholder="Paris, France"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="travel_date" className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Travel Date
                        </label>
                        <input
                            type="date"
                            id="travel_date"
                            name="travel_date"
                            value={formData.travel_date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="trip_duration" className="block text-sm font-medium text-gray-700 mb-2">
                            Trip Duration (Days)
                        </label>
                        <input
                            type="number"
                            id="trip_duration"
                            name="trip_duration"
                            value={formData.trip_duration}
                            onChange={handleInputChange}
                            placeholder="7"
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="travel_budget" className="block text-sm font-medium text-gray-700 mb-2">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            Budget Range
                        </label>
                        <select
                            id="travel_budget"
                            name="travel_budget"
                            value={formData.travel_budget}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="budget">Budget</option>
                            <option value="mid-range">Mid-range</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="travel_companions" className="block text-sm font-medium text-gray-700 mb-2">
                            <Users className="w-4 h-4 inline mr-1" />
                            Travel Style
                        </label>
                        <select
                            id="travel_companions"
                            name="travel_companions"
                            value={formData.travel_companions}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="solo">Solo Travel</option>
                            <option value="couple">Couple</option>
                            <option value="family">Family</option>
                            <option value="friends">Friends</option>
                        </select>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={submitting || !selectedFile}
                        className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        {submitting ? 'Submitting...' : 'Share My Story'}
                    </button>
                </div>
            </form>
        </div>
    );
}