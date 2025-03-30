
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, Save, SendHorizonal } from 'lucide-react';

interface EvaluationFormActionsProps {
  isSubmitted: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  onSubmit: () => void;
}

const EvaluationFormActions = ({
  isSubmitted,
  isSaving,
  isSubmitting,
  onSave,
  onSubmit
}: EvaluationFormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={() => navigate('/psychologist-dashboard/applications')}
      >
        Cancel
      </Button>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="gap-2"
          disabled={isSaving || isSubmitted}
          onClick={onSave}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </Button>
        
        <Button
          className="gap-2 bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
          disabled={isSubmitting || isSubmitted}
          onClick={onSubmit}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal className="h-4 w-4" />
          )}
          Submit Evaluation
        </Button>
      </div>
    </div>
  );
};

export default EvaluationFormActions;
