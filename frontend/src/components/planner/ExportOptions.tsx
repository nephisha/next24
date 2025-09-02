'use client';

import { useState } from 'react';
import { X, Download, FileText, Calendar, Smartphone, Mail, Link, Check } from 'lucide-react';
import type { Itinerary } from '@/app/planner/page';

interface ExportOptionsProps {
    itinerary: Itinerary;
    onClose: () => void;
}

export default function ExportOptions({ itinerary, onClose }: ExportOptionsProps) {
    const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
    const [isExporting, setIsExporting] = useState(false);
    const [exportComplete, setExportComplete] = useState(false);
    const [email, setEmail] = useState('');

    const exportFormats = [
        {
            id: 'pdf',
            name: 'PDF Document',
            description: 'Printable itinerary with maps and details',
            icon: FileText,
            color: 'text-red-600 bg-red-100'
        },
        {
            id: 'calendar',
            name: 'Google Calendar',
            description: 'Add all activities to your calendar',
            icon: Calendar,
            color: 'text-blue-600 bg-blue-100'
        },
        {
            id: 'mobile',
            name: 'Mobile App',
            description: 'Export to travel apps like TripIt',
            icon: Smartphone,
            color: 'text-green-600 bg-green-100'
        },
        {
            id: 'email',
            name: 'Email Summary',
            description: 'Send detailed itinerary via email',
            icon: Mail,
            color: 'text-purple-600 bg-purple-100'
        },
        {
            id: 'link',
            name: 'Shareable Link',
            description: 'Create a public link to share',
            icon: Link,
            color: 'text-orange-600 bg-orange-100'
        }
    ];

    const handleExport = async () => {
        setIsExporting(true);

        try {
            switch (selectedFormat) {
                case 'pdf':
                    await exportToPDF();
                    break;
                case 'calendar':
                    await exportToCalendar();
                    break;
                case 'mobile':
                    await exportToMobile();
                    break;
                case 'email':
                    await sendEmail();
                    break;
                case 'link':
                    await createShareableLink();
                    break;
            }

            setExportComplete(true);
            setTimeout(() => {
                setExportComplete(false);
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const exportToPDF = async () => {
        // Simulate PDF generation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real implementation, you would use a library like jsPDF or Puppeteer
        const pdfContent = generatePDFContent();
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${itinerary.title.replace(/\s+/g, '-')}-itinerary.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const exportToCalendar = async () => {
        // Generate ICS file for calendar import
        await new Promise(resolve => setTimeout(resolve, 1500));

        const icsContent = generateICSContent();
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${itinerary.title.replace(/\s+/g, '-')}-calendar.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const exportToMobile = async () => {
        // Generate mobile-friendly format
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mobileData = {
            title: itinerary.title,
            destination: itinerary.destination,
            startDate: itinerary.startDate,
            endDate: itinerary.endDate,
            activities: itinerary.days.flatMap(day =>
                day.activities.map(activity => ({
                    date: day.date,
                    name: activity.name,
                    location: activity.location,
                    duration: activity.duration,
                    category: activity.category
                }))
            )
        };

        const jsonBlob = new Blob([JSON.stringify(mobileData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(jsonBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${itinerary.title.replace(/\s+/g, '-')}-mobile.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const sendEmail = async () => {
        if (!email) return;

        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real implementation, you would send this to your backend
        const emailContent = generateEmailContent();
        console.log('Sending email to:', email, 'Content:', emailContent);
    };

    const createShareableLink = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate a shareable link (in real implementation, save to database)
        const shareId = Math.random().toString(36).substring(2, 15);
        const shareUrl = `${window.location.origin}/shared/${shareId}`;

        // Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
    };

    const generatePDFContent = () => {
        let content = `${itinerary.title}\n`;
        content += `Destination: ${itinerary.destination}\n`;
        content += `Dates: ${itinerary.startDate} to ${itinerary.endDate}\n\n`;

        itinerary.days.forEach((day, index) => {
            content += `Day ${index + 1} - ${day.date}\n`;
            content += '='.repeat(30) + '\n';

            if (day.activities.length === 0) {
                content += 'No activities planned\n\n';
            } else {
                day.activities.forEach((activity, actIndex) => {
                    content += `${actIndex + 1}. ${activity.name}\n`;
                    content += `   ${activity.description}\n`;
                    content += `   Location: ${activity.location.address}\n`;
                    content += `   Duration: ${Math.floor(activity.duration / 60)}h ${activity.duration % 60}m\n`;
                    if (activity.price) content += `   Price: ${activity.price}\n`;
                    content += '\n';
                });
            }
            content += '\n';
        });

        return content;
    };

    const generateICSContent = () => {
        let ics = 'BEGIN:VCALENDAR\n';
        ics += 'VERSION:2.0\n';
        ics += 'PRODID:-//Next24//Itinerary Planner//EN\n';

        itinerary.days.forEach(day => {
            day.activities.forEach(activity => {
                const startDate = new Date(day.date);
                const endDate = new Date(startDate.getTime() + activity.duration * 60000);

                ics += 'BEGIN:VEVENT\n';
                ics += `UID:${activity.id}@next24.xyz\n`;
                ics += `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
                ics += `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
                ics += `SUMMARY:${activity.name}\n`;
                ics += `DESCRIPTION:${activity.description}\n`;
                ics += `LOCATION:${activity.location.address}\n`;
                ics += 'END:VEVENT\n';
            });
        });

        ics += 'END:VCALENDAR\n';
        return ics;
    };

    const generateEmailContent = () => {
        return {
            subject: `Your ${itinerary.title} Itinerary`,
            body: generatePDFContent()
        };
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Export Itinerary</h2>
                        <p className="text-gray-600 mt-1">Choose how you'd like to export your trip</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {/* Export Formats */}
                    <div className="space-y-3 mb-6">
                        {exportFormats.map(format => {
                            const Icon = format.icon;
                            return (
                                <label
                                    key={format.id}
                                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedFormat === format.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="exportFormat"
                                        value={format.id}
                                        checked={selectedFormat === format.id}
                                        onChange={(e) => setSelectedFormat(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`p-3 rounded-lg ${format.color} mr-4`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{format.name}</h3>
                                        <p className="text-sm text-gray-600">{format.description}</p>
                                    </div>
                                    {selectedFormat === format.id && (
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </label>
                            );
                        })}
                    </div>

                    {/* Email Input */}
                    {selectedFormat === 'email' && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Preview */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Export Preview</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Title:</strong> {itinerary.title}</p>
                            <p><strong>Destination:</strong> {itinerary.destination}</p>
                            <p><strong>Duration:</strong> {itinerary.days.length} days</p>
                            <p><strong>Activities:</strong> {itinerary.days.reduce((total, day) => total + day.activities.length, 0)} total</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={isExporting || (selectedFormat === 'email' && !email)}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isExporting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Exporting...</span>
                            </>
                        ) : exportComplete ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Complete!</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                <span>Export</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}