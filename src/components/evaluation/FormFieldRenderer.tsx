
import React from 'react';
import { EvaluationFormField } from '@/types/evaluation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormFieldRendererProps {
  field: EvaluationFormField;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  disabled?: boolean;
}

const FormFieldRenderer = ({ field, value, onChange, disabled = false }: FormFieldRendererProps) => {
  const { id: fieldId, type, label, required, placeholder, options } = field;
  
  switch (type) {
    case 'text':
      return (
        <div className="space-y-2" key={fieldId}>
          <Label htmlFor={fieldId}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id={fieldId}
            value={value || ''}
            onChange={(e) => onChange(fieldId, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
      );
    
    case 'textarea':
      return (
        <div className="space-y-2" key={fieldId}>
          <Label htmlFor={fieldId}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Textarea
            id={fieldId}
            value={value || ''}
            onChange={(e) => onChange(fieldId, e.target.value)}
            placeholder={placeholder}
            rows={5}
            disabled={disabled}
          />
        </div>
      );
    
    case 'select':
      return (
        <div className="space-y-2" key={fieldId}>
          <Label htmlFor={fieldId}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select
            value={value || ''}
            onValueChange={(value) => onChange(fieldId, value)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    
    case 'multiselect':
      return (
        <div className="space-y-2" key={fieldId}>
          <Label>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className="space-y-2">
            {options?.map((option) => {
              const selected = Array.isArray(value)
                ? value.includes(option)
                : false;
              
              return (
                <div className="flex items-center space-x-2" key={option}>
                  <Checkbox
                    id={`${fieldId}-${option}`}
                    checked={selected}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value)
                        ? [...value]
                        : [];
                      
                      const newValues = checked
                        ? [...currentValues, option]
                        : currentValues.filter(val => val !== option);
                      
                      onChange(fieldId, newValues);
                    }}
                    disabled={disabled}
                  />
                  <Label htmlFor={`${fieldId}-${option}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      );
    
    case 'radio':
      return (
        <div className="space-y-2" key={fieldId}>
          <Label>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <RadioGroup
            value={value || ''}
            onValueChange={(value) => onChange(fieldId, value)}
            disabled={disabled}
          >
            {options?.map((option) => (
              <div className="flex items-center space-x-2" key={option}>
                <RadioGroupItem value={option} id={`${fieldId}-${option}`} />
                <Label htmlFor={`${fieldId}-${option}`} className="font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2" key={fieldId}>
          <Checkbox
            id={fieldId}
            checked={value || false}
            onCheckedChange={(checked) => onChange(fieldId, checked)}
            disabled={disabled}
          />
          <Label htmlFor={fieldId} className="font-normal">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
      );
    
    case 'date':
      return (
        <div className="space-y-2" key={fieldId}>
          <Label htmlFor={fieldId}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id={fieldId}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(fieldId, e.target.value)}
            disabled={disabled}
          />
        </div>
      );
    
    default:
      return null;
  }
};

export default FormFieldRenderer;
