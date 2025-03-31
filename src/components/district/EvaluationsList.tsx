
import React, { useState, useEffect } from 'react';
import { EvaluationsPage } from './evaluations/EvaluationsPage';

interface EvaluationsListProps {
  districtId: string;
}

export const EvaluationsList: React.FC<EvaluationsListProps> = ({ districtId }) => {
  return <EvaluationsPage districtId={districtId} />;
};
