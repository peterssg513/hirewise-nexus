
import { EvaluationTemplate } from '@/types/evaluation';

// Get evaluation template by ID
export const getEvaluationTemplate = async (templateId: string): Promise<EvaluationTemplate> => {
  // For this implementation, we'll use a static template
  // In a real implementation, you would fetch this from the database
  return getDefaultTemplate();
};

// Get a default evaluation template
export const getDefaultTemplate = (): EvaluationTemplate => {
  return {
    id: 'default-template',
    name: 'Standard Psychological Evaluation',
    description: 'Standard evaluation template for K-12 psychological assessment',
    sections: [
      'Student Information',
      'Assessment Results',
      'Behavioral Observations',
      'Recommendations'
    ],
    fields: [
      {
        id: 'student_name',
        label: 'Student Name',
        type: 'text',
        placeholder: 'Full name of student',
        required: true,
        section: 'Student Information'
      },
      {
        id: 'student_grade',
        label: 'Grade',
        type: 'select',
        options: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        required: true,
        section: 'Student Information'
      },
      {
        id: 'evaluation_date',
        label: 'Evaluation Date',
        type: 'date',
        required: true,
        section: 'Student Information'
      },
      {
        id: 'cognitive_assessment',
        label: 'Cognitive Assessment',
        type: 'textarea',
        placeholder: 'Describe cognitive assessment results',
        required: true,
        section: 'Assessment Results'
      },
      {
        id: 'achievement_tests',
        label: 'Achievement Tests',
        type: 'textarea',
        placeholder: 'Describe achievement test results',
        required: true,
        section: 'Assessment Results'
      },
      {
        id: 'learning_style',
        label: 'Learning Style',
        type: 'multiselect',
        options: ['Visual', 'Auditory', 'Kinesthetic', 'Read/Write'],
        required: false,
        section: 'Assessment Results'
      },
      {
        id: 'classroom_behavior',
        label: 'Classroom Behavior',
        type: 'textarea',
        placeholder: 'Describe observed behavior in classroom settings',
        required: true,
        section: 'Behavioral Observations'
      },
      {
        id: 'social_interactions',
        label: 'Social Interactions',
        type: 'textarea',
        placeholder: 'Describe social interaction patterns',
        required: true,
        section: 'Behavioral Observations'
      },
      {
        id: 'adaptive_skills',
        label: 'Adaptive Skills',
        type: 'radio',
        options: ['Below Average', 'Average', 'Above Average'],
        required: true,
        section: 'Behavioral Observations'
      },
      {
        id: 'eligibility',
        label: 'Eligibility for Services',
        type: 'checkbox',
        options: [
          'Special Education',
          'Speech Therapy',
          'Occupational Therapy',
          'Counseling Services',
          'Behavior Intervention Plan',
          'None'
        ],
        required: true,
        section: 'Recommendations'
      },
      {
        id: 'recommendations',
        label: 'Recommendations',
        type: 'textarea',
        placeholder: 'Provide detailed recommendations for supporting this student',
        required: true,
        section: 'Recommendations'
      }
    ]
  };
};
