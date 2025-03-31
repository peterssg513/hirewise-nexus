
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Check, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { saveMeetingInfo } from '@/services/districtSignupService';
import { cn } from '@/lib/utils';

interface ScheduleMeetingProps {
  onComplete: () => void;
}

const availableTimeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

const ScheduleMeeting: React.FC<ScheduleMeetingProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to continue',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Incomplete selection',
        description: 'Please select both a date and time for your meeting',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Parse the time string and set it on the selected date
      const [hourStr, minuteStr, period] = selectedTime.match(/(\d+):(\d+)\s+([AP]M)/)?.slice(1) || [];
      const hour = parseInt(hourStr) + (period === 'PM' && parseInt(hourStr) !== 12 ? 12 : 0);
      const minute = parseInt(minuteStr);
      
      const meetingDate = new Date(selectedDate);
      meetingDate.setHours(hour, minute, 0, 0);
      
      await saveMeetingInfo(user.id, meetingDate);
      
      toast({
        title: 'Meeting scheduled',
        description: `Your meeting has been scheduled for ${format(meetingDate, 'PPP')} at ${selectedTime}`,
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error scheduling meeting',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-psyched-darkBlue mb-2">Schedule a Meeting</h2>
      <p className="text-gray-600 mb-6">
        Schedule a brief introduction call with the PsychedHire team to understand how we can best support your district's needs.
      </p>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-4">Select a Date</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                disabled={(date) => {
                  // Disable weekends and past dates
                  const day = date.getDay();
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today || day === 0 || day === 6;
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-4">Select a Time</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableTimeSlots.map((time) => (
              <Button
                key={time}
                type="button"
                variant={selectedTime === time ? "default" : "outline"}
                className={cn(
                  "justify-start",
                  selectedTime === time && "bg-psyched-lightBlue"
                )}
                onClick={() => setSelectedTime(time)}
              >
                <Clock className="mr-2 h-4 w-4" />
                {time}
                {selectedTime === time && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-2">Your Selection</h3>
        <div className="flex items-center text-gray-700">
          {selectedDate && selectedTime ? (
            <>
              <CalendarIcon className="mr-2 h-5 w-5 text-psyched-darkBlue" />
              <span>
                {format(selectedDate, "MMMM d, yyyy")} at {selectedTime}
              </span>
            </>
          ) : (
            <span className="text-gray-400">Please select a date and time</span>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <Button 
          onClick={handleContinue}
          className="w-full bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white" 
          disabled={!selectedDate || !selectedTime || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
              Scheduling...
            </span>
          ) : "Continue to Build Profile"}
        </Button>
      </div>
    </div>
  );
};

export default ScheduleMeeting;
