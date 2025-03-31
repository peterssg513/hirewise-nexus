
// Helper function to safely parse JSON strings
export const safeJsonParse = (jsonString: string | null, defaultValue: any[] = []): any[] => {
  if (!jsonString) return defaultValue;
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch (err) {
    console.error('Error parsing JSON data:', err);
    return defaultValue;
  }
};

// Helper function to format education display
export const formatEducation = (educationData: any): string => {
  if (!educationData) return 'Not specified';
  
  try {
    let education = educationData;
    
    // If it's a string, try to parse it as JSON
    if (typeof educationData === 'string') {
      education = safeJsonParse(educationData);
    }
    
    // If education is an array, format it
    if (Array.isArray(education) && education.length > 0) {
      return education.map(edu => {
        const institution = edu.institution || edu.schoolName || '';
        const degree = edu.degree || '';
        const field = edu.field || edu.major || '';
        
        if (institution && (degree || field)) {
          return `${institution} - ${degree} ${field}`.trim();
        } else if (institution) {
          return institution;
        } else {
          return 'Unspecified education';
        }
      }).join(', ');
    }
    
    return 'Not specified';
  } catch (err) {
    console.error('Error formatting education:', err, educationData);
    return 'Not specified';
  }
};

// Helper function to format experience display
export const formatExperience = (experienceData: any): Array<{ key: string; content: any }> => {
  if (!experienceData) return [{ key: 'no-exp', content: 'Not specified' }];
  
  try {
    let experiences = experienceData;
    
    // If it's a string, try to parse it as JSON
    if (typeof experienceData === 'string') {
      experiences = safeJsonParse(experienceData);
    }
    
    // If experiences is an array, format it
    if (Array.isArray(experiences) && experiences.length > 0) {
      return experiences.map((exp, index) => {
        const organization = exp.organization || exp.company || '';
        const position = exp.position || exp.title || '';
        const startDate = exp.startDate || '';
        const endDate = exp.current ? 'Present' : (exp.endDate || '');
        
        return {
          key: `exp-${index}`,
          content: {
            organization,
            position,
            startDate,
            endDate,
            description: exp.description || ''
          }
        };
      });
    }
    
    return [{ key: 'no-exp', content: 'Not specified' }];
  } catch (err) {
    console.error('Error formatting experience:', err, experienceData);
    return [{ key: 'error-exp', content: 'Not specified' }];
  }
};
