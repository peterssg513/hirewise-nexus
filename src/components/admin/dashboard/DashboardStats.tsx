
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Users, Briefcase, FileText, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryCount: number;
  primaryLabel: string;
  secondaryCount?: number;
  secondaryLabel?: string;
  showActionBadge?: boolean;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  description,
  primaryCount,
  primaryLabel,
  secondaryCount,
  secondaryLabel,
  showActionBadge = false,
  className = '',
}) => (
  <Card className={`${primaryCount > 0 ? "border-yellow-400" : ""} ${className}`}>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center">
        {icon}
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className={secondaryCount !== undefined ? "flex justify-between" : ""}>
        <div>
          <div className="text-2xl font-bold">{primaryCount}</div>
          <p className="text-xs text-muted-foreground">{primaryLabel}</p>
          {showActionBadge && primaryCount > 0 && (
            <Badge className="mt-2 bg-yellow-500 hover:bg-yellow-600">
              Action Required
            </Badge>
          )}
        </div>
        {secondaryCount !== undefined && secondaryLabel && (
          <div>
            <div className="text-2xl font-bold">{secondaryCount}</div>
            <p className="text-xs text-muted-foreground">{secondaryLabel}</p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    pendingDistricts: number;
    pendingPsychologists: number;
    pendingJobs: number;
    activeJobs: number;
    completedEvaluations: number;
  };
  pendingEvaluationsCount: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, pendingEvaluationsCount }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, Admin</h1>
          <p className="text-muted-foreground">Platform administration and oversight</p>
        </div>
        <Button 
          variant="default" 
          className="flex items-center" 
          onClick={() => navigate('/admin-dashboard/create-admin')}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Create Admin
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard 
          icon={<ShieldCheck className="mr-2 h-4 w-4" />}
          title="Districts"
          description="Manage district accounts"
          primaryCount={stats.pendingDistricts}
          primaryLabel="Pending Approval"
          showActionBadge={true}
        />
        
        <StatsCard 
          icon={<Users className="mr-2 h-4 w-4" />}
          title="Psychologists"
          description="Manage psychologist accounts"
          primaryCount={stats.pendingPsychologists}
          primaryLabel="Pending Approval"
          showActionBadge={true}
        />
        
        <StatsCard 
          icon={<Briefcase className="mr-2 h-4 w-4" />}
          title="Job Postings"
          description="Review and approve job postings"
          primaryCount={stats.pendingJobs}
          primaryLabel="Pending Approval"
          secondaryCount={stats.activeJobs}
          secondaryLabel="Active"
          showActionBadge={true}
        />
        
        <StatsCard 
          icon={<FileText className="mr-2 h-4 w-4" />}
          title="Evaluations"
          description="Review evaluation requests"
          primaryCount={pendingEvaluationsCount}
          primaryLabel="Pending Approval"
          secondaryCount={stats.completedEvaluations}
          secondaryLabel="Completed"
          showActionBadge={true}
        />
        
        <StatsCard 
          icon={<Activity className="mr-2 h-4 w-4" />}
          title="Platform Activity"
          description="Monitor system activity"
          primaryCount={0}
          primaryLabel="Platform Status"
          className=""
        />
      </div>
    </>
  );
};
