
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface JobsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  allSkills: string[];
}

export const JobsFilter: React.FC<JobsFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSkills,
  setSelectedSkills,
  allSkills
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(
      selectedSkills.includes(skill)
        ? selectedSkills.filter(s => s !== skill)
        : [...selectedSkills, skill]
    );
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Job Listings</h1>
        <p className="text-muted-foreground">Find and apply for school psychology positions</p>
      </div>
      
      <div className="w-full md:w-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search jobs..."
            className="pl-8 w-full md:w-[250px]"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-4 w-4" />
            <span>Filter Skills</span>
            {selectedSkills.length > 0 && (
              <Badge className="ml-1 bg-primary">{selectedSkills.length}</Badge>
            )}
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter by Skills</DialogTitle>
              <DialogDescription>Select skills to filter job listings</DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap gap-2 mt-4">
              {allSkills.map(skill => (
                <Badge 
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedSkills.includes(skill) 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-secondary/50"
                  }`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              {selectedSkills.length > 0 && (
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedSkills([])}
                >
                  Clear All
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
