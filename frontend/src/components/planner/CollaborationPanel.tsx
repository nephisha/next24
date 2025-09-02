'use client';

import { useState } from 'react';
import { X, Users, Mail, Link, Copy, Check, UserPlus, Crown, Eye, Edit } from 'lucide-react';
import type { Itinerary } from '@/app/planner/page';

interface CollaborationPanelProps {
    itinerary: Itinerary;
    onUpdate: (updates: Partial<Itinerary>) => void;
    onClose: () => void;
}

interface Collaborator {
    id: string;
    email: string;
    name: string;
    role: 'owner' | 'editor' | 'viewer';
    status: 'pending' | 'accepted';
    avatar?: string;
    joinedAt: string;
}

export default function CollaborationPanel({ itinerary, onUpdate, onClose }: CollaborationPanelProps) {
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
    const [isInviting, setIsInviting] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);

    // Mock collaborators data
    const [collaborators, setCollaborators] = useState<Collaborator[]>([
        {
            id: 'owner',
            email: 'you@example.com',
            name: 'You',
            role: 'owner',
            status: 'accepted',
            joinedAt: '2025-08-01'
        },
        {
            id: 'collab1',
            email: 'friend@example.com',
            name: 'Sarah Johnson',
            role: 'editor',
            status: 'accepted',
            joinedAt: '2025-08-15'
        },
        {
            id: 'collab2',
            email: 'travel@example.com',
            name: 'Mike Chen',
            role: 'viewer',
            status: 'pending',
            joinedAt: '2025-08-20'
        }
    ]);

    const handleInvite = async () => {
        if (!inviteEmail) return;

        setIsInviting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newCollaborator: Collaborator = {
                id: `collab-${Date.now()}`,
                email: inviteEmail,
                name: inviteEmail.split('@')[0],
                role: inviteRole,
                status: 'pending',
                joinedAt: new Date().toISOString()
            };

            setCollaborators(prev => [...prev, newCollaborator]);
            setInviteEmail('');

            // Update itinerary collaborators
            onUpdate({
                collaborators: [...(itinerary.collaborators || []), inviteEmail]
            });
        } catch (error) {
            console.error('Failed to send invite:', error);
        } finally {
            setIsInviting(false);
        }
    };

    const handleRoleChange = (collaboratorId: string, newRole: 'editor' | 'viewer') => {
        setCollaborators(prev =>
            prev.map(collab =>
                collab.id === collaboratorId ? { ...collab, role: newRole } : collab
            )
        );
    };

    const handleRemoveCollaborator = (collaboratorId: string) => {
        setCollaborators(prev => prev.filter(collab => collab.id !== collaboratorId));

        const removedCollab = collaborators.find(c => c.id === collaboratorId);
        if (removedCollab) {
            onUpdate({
                collaborators: (itinerary.collaborators || []).filter(email => email !== removedCollab.email)
            });
        }
    };

    const generateShareUrl = () => {
        const shareId = Math.random().toString(36).substring(2, 15);
        const url = `${window.location.origin}/shared/${shareId}`;
        setShareUrl(url);
    };

    const copyShareUrl = async () => {
        if (!shareUrl) {
            generateShareUrl();
            return;
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy URL:', error);
        }
    };

    const togglePublic = () => {
        onUpdate({ isPublic: !itinerary.isPublic });
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'owner': return <Crown className="w-4 h-4 text-yellow-500" />;
            case 'editor': return <Edit className="w-4 h-4 text-blue-500" />;
            case 'viewer': return <Eye className="w-4 h-4 text-gray-500" />;
            default: return null;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'owner': return 'bg-yellow-100 text-yellow-800';
            case 'editor': return 'bg-blue-100 text-blue-800';
            case 'viewer': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Users className="w-6 h-6 text-blue-600" />
                            Collaborate on Trip
                        </h2>
                        <p className="text-gray-600 mt-1">Invite others to plan together</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                    {/* Invite Section */}
                    <div className="bg-blue-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-blue-600" />
                            Invite Collaborators
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Permission Level
                                </label>
                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="editor">Editor - Can add and modify activities</option>
                                    <option value="viewer">Viewer - Can only view the itinerary</option>
                                </select>
                            </div>

                            <button
                                onClick={handleInvite}
                                disabled={!inviteEmail || isInviting}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isInviting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Sending Invite...</span>
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-4 h-4" />
                                        <span>Send Invite</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Share Link Section */}
                    <div className="border border-gray-200 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Link className="w-5 h-5 text-green-600" />
                            Share Link
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="publicToggle"
                                    checked={itinerary.isPublic}
                                    onChange={togglePublic}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="publicToggle" className="text-sm text-gray-700">
                                    Make this itinerary publicly viewable
                                </label>
                            </div>

                            {itinerary.isPublic && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        placeholder="Click generate to create share link"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                                    />
                                    <button
                                        onClick={copyShareUrl}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Current Collaborators */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Current Collaborators ({collaborators.length})
                        </h3>

                        <div className="space-y-3">
                            {collaborators.map(collaborator => (
                                <div key={collaborator.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {collaborator.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{collaborator.name}</p>
                                            <p className="text-sm text-gray-600">{collaborator.email}</p>
                                            {collaborator.status === 'pending' && (
                                                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mt-1">
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {collaborator.role === 'owner' ? (
                                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(collaborator.role)}`}>
                                                {getRoleIcon(collaborator.role)}
                                                Owner
                                            </span>
                                        ) : (
                                            <>
                                                <select
                                                    value={collaborator.role}
                                                    onChange={(e) => handleRoleChange(collaborator.id, e.target.value as 'editor' | 'viewer')}
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                >
                                                    <option value="editor">Editor</option>
                                                    <option value="viewer">Viewer</option>
                                                </select>
                                                <button
                                                    onClick={() => handleRemoveCollaborator(collaborator.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Remove collaborator"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Permissions Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Permission Levels</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Crown className="w-4 h-4 text-yellow-500" />
                                <span><strong>Owner:</strong> Full control, can delete trip and manage collaborators</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Edit className="w-4 h-4 text-blue-500" />
                                <span><strong>Editor:</strong> Can add, edit, and remove activities</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-gray-500" />
                                <span><strong>Viewer:</strong> Can only view the itinerary</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}