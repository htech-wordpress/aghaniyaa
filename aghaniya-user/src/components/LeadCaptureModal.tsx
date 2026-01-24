import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    loanId: string;
    loanTitle: string;
}

export function LeadCaptureModal({ isOpen, onClose, loanId, loanTitle }: LeadCaptureModalProps) {
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!/^\d{10}$/.test(mobile)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        // Navigate to loan detail with mobile number in state
        navigate(loanId.startsWith('/') ? loanId : `/loans/${loanId}`, { state: { mobile } });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Apply for {loanTitle}</DialogTitle>
                    <DialogDescription>
                        Please enter your mobile number to proceed with the application.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="mobile-capture">Mobile Number</Label>
                        <Input
                            id="mobile-capture"
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            className="bg-white text-black border-slate-300 placeholder:text-slate-400 focus-visible:ring-rose-900"
                            value={mobile}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setMobile(value);
                                if (error) setError('');
                            }}
                            maxLength={10}
                        />
                        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                    </div>
                    <DialogFooter className="flex-col sm:justify-between sm:flex-row gap-2">
                        {/* secondary button if needed, but simple is better */}
                        <Button
                            type="button"
                            className="w-full cursor-pointer relative z-50 font-bold tracking-wide"
                            onClick={handleSubmit}
                            disabled={mobile.length !== 10}
                        >
                            Proceed to Application
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
