
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  MapPin, Briefcase, FileSpreadsheet, Check, 
  Edit, Plus, X, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

interface ProfilePreferencesProps {
  desiredLocations?: string[];
  workTypes?: string[];
  evaluationTypes?: string[];
  openToRelocation?: boolean;
  onUpdatePreferences?: (type: 'locations' | 'workTypes' | 'evaluationTypes' | 'relocation', data: any) => Promise<void>;
}

const ProfilePreferences = ({
  desiredLocations = [],
  workTypes = [],
  evaluationTypes = [],
  openToRelocation = false,
  onUpdatePreferences
}: ProfilePreferencesProps) => {
  const [editingPreference, setEditingPreference] = useState<'locations' | 'workTypes' | 'evaluationTypes' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [editedLocations, setEditedLocations] = useState<string[]>([...desiredLocations]);
  const [editedWorkTypes, setEditedWorkTypes] = useState<string[]>([...workTypes]);
  const [editedEvaluationTypes, setEditedEvaluationTypes] = useState<string[]>([...evaluationTypes]);
  const [editedRelocation, setEditedRelocation] = useState(openToRelocation);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenEditDialog = (type: 'locations' | 'workTypes' | 'evaluationTypes') => {
    setEditingPreference(type);
    if (type === 'locations') {
      setEditedLocations([...desiredLocations]);
    } else if (type === 'workTypes') {
      setEditedWorkTypes([...workTypes]);
    } else if (type === 'evaluationTypes') {
      setEditedEvaluationTypes([...evaluationTypes]);
    }
  };

  const handleCloseEditDialog = () => {
    setEditingPreference(null);
    setInputValue('');
  };

  const handleAddItem = () => {
    if (!inputValue.trim()) return;
    
    if (editingPreference === 'locations') {
      if (!editedLocations.includes(inputValue.trim())) {
        setEditedLocations([...editedLocations, inputValue.trim()]);
      }
    } else if (editingPreference === 'workTypes') {
      if (!editedWorkTypes.includes(inputValue.trim())) {
        setEditedWorkTypes([...editedWorkTypes, inputValue.trim()]);
      }
    } else if (editingPreference === 'evaluationTypes') {
      if (!editedEvaluationTypes.includes(inputValue.trim())) {
        setEditedEvaluationTypes([...editedEvaluationTypes, inputValue.trim()]);
      }
    }
    
    setInputValue('');
  };

  const handleRemoveItem = (type: 'locations' | 'workTypes' | 'evaluationTypes', item: string) => {
    if (type === 'locations') {
      setEditedLocations(editedLocations.filter(loc => loc !== item));
    } else if (type === 'workTypes') {
      setEditedWorkTypes(editedWorkTypes.filter(wt => wt !== item));
    } else if (type === 'evaluationTypes') {
      setEditedEvaluationTypes(editedEvaluationTypes.filter(et => et !== item));
    }
  };

  const handleSavePreferences = async () => {
    if (!onUpdatePreferences) return;
    
    setIsSubmitting(true);
    try {
      if (editingPreference === 'locations') {
        await onUpdatePreferences('locations', editedLocations);
      } else if (editingPreference === 'workTypes') {
        await onUpdatePreferences('workTypes', editedWorkTypes);
      } else if (editingPreference === 'evaluationTypes') {
        await onUpdatePreferences('evaluationTypes', editedEvaluationTypes);
      }
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleRelocation = async () => {
    if (!onUpdatePreferences) return;
    
    setIsSubmitting(true);
    try {
      const newValue = !editedRelocation;
      setEditedRelocation(newValue);
      await onUpdatePreferences('relocation', newValue);
    } catch (error) {
      console.error('Error updating relocation preference:', error);
      setEditedRelocation(openToRelocation); // Revert on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDialogTitle = () => {
    switch (editingPreference) {
      case 'locations': return 'Edit Desired Locations';
      case 'workTypes': return 'Edit Work Types';
      case 'evaluationTypes': return 'Edit Evaluation Types';
      default: return '';
    }
  };

  const getPlaceholder = () => {
    switch (editingPreference) {
      case 'locations': return 'New location (e.g. California)';
      case 'workTypes': return 'New work type (e.g. Full-time)';
      case 'evaluationTypes': return 'New evaluation type (e.g. Psychoeducational)';
      default: return '';
    }
  };

  const getCurrentItems = () => {
    switch (editingPreference) {
      case 'locations': return editedLocations;
      case 'workTypes': return editedWorkTypes;
      case 'evaluationTypes': return editedEvaluationTypes;
      default: return [];
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-psyched-darkBlue" />
            Desired Locations
          </CardTitle>
          {onUpdatePreferences && (
            <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog('locations')}>
              <Edit className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {desiredLocations.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {desiredLocations.map((location, index) => (
                <Badge key={index} variant="outline" className="bg-psyched-cream/50">
                  {location}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No locations specified</p>
          )}
          
          <div className="mt-2 flex items-center text-sm text-psyched-darkBlue">
            {openToRelocation ? (
              <motion.div 
                className="flex items-center" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Check className="h-4 w-4 mr-1" />
                <span>Open to Relocation</span>
              </motion.div>
            ) : (
              <span className="text-gray-500 text-sm">Not open to relocation</span>
            )}

            {onUpdatePreferences && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2" 
                onClick={handleToggleRelocation}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Toggle'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-psyched-darkBlue" />
            Work Types
          </CardTitle>
          {onUpdatePreferences && (
            <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog('workTypes')}>
              <Edit className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {workTypes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {workTypes.map((type, index) => (
                <Badge key={index} variant="outline" className="bg-psyched-cream/50">
                  {type}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No work types specified</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-psyched-darkBlue" />
            Evaluation Types
          </CardTitle>
          {onUpdatePreferences && (
            <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog('evaluationTypes')}>
              <Edit className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {evaluationTypes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {evaluationTypes.map((type, index) => (
                <Badge key={index} variant="outline" className="bg-psyched-cream/50">
                  {type}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No evaluation types specified</p>
          )}
        </CardContent>
      </Card>

      {/* Edit Preferences Dialog */}
      <Dialog open={editingPreference !== null} onOpenChange={open => !open && handleCloseEditDialog()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              Add or remove items from your preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={getPlaceholder()}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <Button type="button" size="icon" onClick={handleAddItem}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-lg p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
              {getCurrentItems().length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {getCurrentItems().map((item, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1 flex items-center">
                      {item}
                      <Button 
                        variant="ghost" 
                        size="icon"  
                        className="h-4 w-4 ml-1 hover:bg-red-100 rounded-full"
                        onClick={() => handleRemoveItem(editingPreference!, item)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center pt-8">No items added</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleSavePreferences} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePreferences;
