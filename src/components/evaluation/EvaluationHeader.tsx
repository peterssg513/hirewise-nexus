
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Save, SendHorizonal, Loader2, CheckCircle } from 'lucide-react';
import { EvaluationTemplate } from '@/types/evaluation';

interface EvaluationHeaderProps {
  template: EvaluationTemplate;
  status: string;
  submittedAt: string | null;
  isSaving: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  onSubmit: () => void;
}

const EvaluationHeader = ({
  template,
  status,
  submittedAt,
  isSaving,
  isSubmitting,
  onSave,
  onSubmit
}: EvaluationHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{template.name}</h1>
          <p className="text-muted-foreground">{template.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/psychologist-dashboard/applications')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button
            variant="outline"
            className="gap-2"
            disabled={isSaving || status === 'submitted'}
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
            disabled={isSubmitting || status === 'submitted'}
            onClick={onSubmit}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
            Submit
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Badge
            variant={status === 'submitted' ? 'default' : 'outline'}
            className={status === 'submitted' ? 'bg-green-100 text-green-800' : ''}
          >
            {status === 'submitted' ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Submitted
              </>
            ) : (
              'Draft'
            )}
          </Badge>
          
          {submittedAt && (
            <span className="text-sm text-muted-foreground">
              Submitted on {new Date(submittedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default EvaluationHeader;
