
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardContent } from '@/components/ui/card';
import { EvaluationTemplate, EvaluationFormField } from '@/types/evaluation';
import FormFieldRenderer from './FormFieldRenderer';

interface EvaluationTabsProps {
  template: EvaluationTemplate;
  formData: Record<string, any>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleFieldChange: (fieldId: string, value: any) => void;
  isSubmitted: boolean;
}

const EvaluationTabs = ({
  template,
  formData,
  activeTab,
  setActiveTab,
  handleFieldChange,
  isSubmitted
}: EvaluationTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <ScrollArea className="w-full">
        <TabsList className="flex w-full justify-start p-0 h-auto mb-0 bg-transparent border-b rounded-none">
          {template.sections.map((section) => (
            <TabsTrigger
              key={section}
              value={section}
              className="py-2 px-4 border-b-2 border-transparent data-[state=active]:border-psyched-darkBlue rounded-none"
            >
              {section}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>
      
      <CardContent className="pt-6">
        {template.sections.map((section) => (
          <TabsContent key={section} value={section} className="m-0">
            <div className="space-y-6">
              {template.fields
                .filter(field => field.section === section)
                .map(field => (
                  <FormFieldRenderer 
                    key={field.id}
                    field={field}
                    value={formData[field.id]}
                    onChange={handleFieldChange}
                    disabled={isSubmitted}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </CardContent>
    </Tabs>
  );
};

export default EvaluationTabs;
