import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';

export function AdminSupport() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) { alert('Please enter a message'); return; }
    // For now just show an alert. Could persist messages if needed.
    alert('Support request sent. We will get back to you via email.');
    setMessage('');
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Support</h2>
        <p className="mb-4 text-sm text-gray-600">Send a message to the admin/support team. This is a local demo — messages are not persisted.</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="w-full border rounded p-3" />
        </div>

        <div className="mt-4">
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
