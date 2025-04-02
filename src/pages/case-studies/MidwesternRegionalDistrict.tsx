
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ChevronLeft, School, TrendingUp, Users, Target, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Data for the growth chart
const growthData = [
  { year: '2018-19', staff: 6, contracts: 18 },
  { year: '2019-20', staff: 8, contracts: 21 },
  { year: '2020-21', staff: 9, contracts: 22 },
  { year: '2021-22', staff: 13, contracts: 33 },
  { year: '2022-23', staff: 20, contracts: 59 },
  { year: '2023-24', staff: 29, contracts: 84 },
  { year: '2024-25', staff: 32, contracts: 100, projected: true }
];

// Calculate growth percentages
const calculateGrowth = (current: number, initial: number) => {
  return ((current - initial) / initial * 100).toFixed(0);
};

const staffGrowth = calculateGrowth(growthData[growthData.length - 2].staff, growthData[0].staff);
const contractsGrowth = calculateGrowth(growthData[growthData.length - 2].contracts, growthData[0].contracts);

const chartConfig = {
  staff: {
    label: "Staff",
    color: "#0EA5E9" // psyched-lightBlue
  },
  contracts: {
    label: "Contracts",
    color: "#F97316" // psyched-orange
  },
};

const MidwesternRegionalDistrict = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-16">
        {/* Breadcrumb */}
        <div className="psyched-container mb-6">
          <Link to="/success-stories" className="flex items-center text-psyched-lightBlue hover:text-psyched-darkBlue transition-colors text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Success Stories
          </Link>
        </div>
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-psyched-cream to-white py-12 mb-16">
          <div className="psyched-container">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="md:w-2/3">
                <h1 className="text-3xl md:text-4xl font-bold text-psyched-darkBlue mb-6">
                  How PsychedHire Scaled Psychological Services Across a Multi-District Region by 422%
                </h1>
                
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-psyched-cream flex items-center justify-center mr-4">
                    <p className="font-bold text-xl text-psyched-darkBlue">MRD</p>
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-psyched-darkBlue">Midwestern Regional District</h2>
                    <p className="text-gray-600">Regional Consortium of School Districts</p>
                  </div>
                </div>
                
                <div className="bg-psyched-cream p-6 rounded-lg border border-psyched-yellow/20 mb-6">
                  <p className="italic text-lg text-gray-700">
                    "We went from scattered coverage to a fully scaled, coordinated system in just a few years - thanks to PsychedHire."
                  </p>
                  <p className="text-right text-sm text-gray-500 mt-2">— Consortium Leaders, Regional Administration</p>
                </div>
              </div>
              
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 bg-psyched-lightBlue/10 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-psyched-darkBlue">422%</p>
                      <p className="text-lg font-semibold text-psyched-lightBlue">Service Growth</p>
                      <p className="text-sm text-gray-600">2018-2024</p>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-psyched-orange/10 rounded-full h-20 w-20 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-psyched-orange">433%</p>
                      <p className="text-xs text-gray-600">Staff</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-psyched-yellow/10 rounded-full h-20 w-20 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-psyched-yellow">366%</p>
                      <p className="text-xs text-gray-600">Contracts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Challenge & Solution Section */}
        <section className="psyched-container mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-psyched-orange">
                  <Target className="h-5 w-5 mr-2" />
                  The Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-red-600 text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Too few licensed school psychologists for expanding student needs</p>
                      <p className="text-sm text-gray-600 mt-1">Students across the region were waiting months for essential evaluations</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-red-600 text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">No consistent recruitment strategy across districts</p>
                      <p className="text-sm text-gray-600 mt-1">Each district was competing for the same limited talent pool</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-red-600 text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Evaluation backlogs and compliance risks mounting</p>
                      <p className="text-sm text-gray-600 mt-1">Districts faced potential regulatory issues due to incomplete evaluations</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-psyched-lightBlue">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  The Solution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Region-wide implementation strategy</p>
                      <p className="text-sm text-gray-600 mt-1">Comprehensive approach prioritizing quick placement and quality vetting</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Scalable team structures</p>
                      <p className="text-sm text-gray-600 mt-1">Built flexible staffing models that could grow with district needs</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Proactive forecasting and planning</p>
                      <p className="text-sm text-gray-600 mt-1">Regular collaboration with district leaders to prepare for growth</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Growth Visualization Section */}
        <section className="bg-psyched-cream py-16 mb-16">
          <div className="psyched-container">
            <h2 className="text-2xl md:text-3xl font-bold text-psyched-darkBlue mb-2 text-center">
              Exceptional Growth Trajectory
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              From just 6 staff members serving 18 contracts in 2018 to a projected team of 32 professionals 
              covering nearly 100 schools by 2025
            </p>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
              <ChartContainer className="h-80" config={chartConfig}>
                <BarChart data={growthData} margin={{ top: 30, right: 30, left: 20, bottom: 30 }}>
                  <XAxis 
                    dataKey="year" 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="staff" name="Staff" fill="var(--color-staff)" radius={[4, 4, 0, 0]}>
                    {growthData.map((entry, index) => (
                      <Cell key={`staff-${index}`} fillOpacity={entry.projected ? 0.5 : 1} />
                    ))}
                  </Bar>
                  <Bar dataKey="contracts" name="Contracts" fill="var(--color-contracts)" radius={[4, 4, 0, 0]}>
                    {growthData.map((entry, index) => (
                      <Cell key={`contracts-${index}`} fillOpacity={entry.projected ? 0.5 : 1} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <Card className="bg-gradient-to-br from-psyched-lightBlue/10 to-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center bg-white rounded-full h-16 w-16 shadow-md mb-4">
                      <Users className="h-8 w-8 text-psyched-lightBlue" />
                    </div>
                    <h3 className="text-4xl font-bold text-psyched-darkBlue mb-2">{staffGrowth}%</h3>
                    <p className="text-gray-600 font-medium">Staff Growth</p>
                    <p className="text-sm text-gray-500">From 6 to 29 professionals</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-psyched-orange/10 to-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center bg-white rounded-full h-16 w-16 shadow-md mb-4">
                      <School className="h-8 w-8 text-psyched-orange" />
                    </div>
                    <h3 className="text-4xl font-bold text-psyched-darkBlue mb-2">{contractsGrowth}%</h3>
                    <p className="text-gray-600 font-medium">Contract Growth</p>
                    <p className="text-sm text-gray-500">From 18 to 84 schools</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-psyched-yellow/10 to-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center bg-white rounded-full h-16 w-16 shadow-md mb-4">
                      <Calendar className="h-8 w-8 text-psyched-yellow" />
                    </div>
                    <h3 className="text-4xl font-bold text-psyched-darkBlue mb-2">7</h3>
                    <p className="text-gray-600 font-medium">Years of Growth</p>
                    <p className="text-sm text-gray-500">Consistent scaling since 2018</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Staff Count</TableHead>
                    <TableHead>Staff Growth</TableHead>
                    <TableHead>Contracts</TableHead>
                    <TableHead>Contract Growth</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {growthData.map((year, index) => {
                    const prevYear = index > 0 ? growthData[index - 1] : null;
                    const staffGrowthPerc = prevYear ? ((year.staff - prevYear.staff) / prevYear.staff * 100).toFixed(0) : "-";
                    const contractGrowthPerc = prevYear ? ((year.contracts - prevYear.contracts) / prevYear.contracts * 100).toFixed(0) : "-";
                    
                    return (
                      <TableRow key={year.year}>
                        <TableCell className={year.projected ? "text-gray-500" : ""}>
                          {year.year} {year.projected && "(Projected)"}
                        </TableCell>
                        <TableCell className={year.projected ? "text-gray-500" : ""}>{year.staff}</TableCell>
                        <TableCell>
                          {staffGrowthPerc !== "-" && parseInt(staffGrowthPerc) > 0 ? (
                            <span className="text-green-600">+{staffGrowthPerc}%</span>
                          ) : staffGrowthPerc}
                        </TableCell>
                        <TableCell className={year.projected ? "text-gray-500" : ""}>{year.contracts}</TableCell>
                        <TableCell>
                          {contractGrowthPerc !== "-" && parseInt(contractGrowthPerc) > 0 ? (
                            <span className="text-green-600">+{contractGrowthPerc}%</span>
                          ) : contractGrowthPerc}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {index === 0 && "Initial partnership"}
                          {index === 2 && "COVID-19 adaptations"}
                          {index === 3 && "Expanded telepractice"}
                          {index === 4 && "Added specialized roles"}
                          {index === 5 && "Regional model completed"}
                          {index === 6 && "Projected continued growth"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
        
        {/* Impact Section */}
        <section className="psyched-container mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-psyched-darkBlue mb-8 text-center">
            Impact: A National Model for Success
          </h2>
          
          <div className="bg-gradient-to-br from-psyched-cream to-white p-8 rounded-xl mb-10">
            <p className="text-lg text-gray-700 leading-relaxed">
              Thanks to PsychedHire's dedicated matching, compliance support, and deep experience in the K-12 
              ecosystem, this regional partnership is now seen as a national model for psychologist workforce 
              transformation. We continue to deliver consistent, credentialed talent for in-person and virtual roles.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-psyched-darkBlue mb-3">Consistent Coverage</h3>
                <p className="text-gray-600 text-sm">
                  No more staffing gaps or emergency scrambles. Reliable professionals in every school that needs support.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-psyched-darkBlue mb-3">Compliance Confidence</h3>
                <p className="text-gray-600 text-sm">
                  Districts maintain regulatory compliance with timely evaluations and proper documentation.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-psyched-darkBlue mb-3">Regional Coordination</h3>
                <p className="text-gray-600 text-sm">
                  Streamlined approach across districts creates efficiency and consistent quality.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Link to="/register?role=district">
              <Button size="lg" className="bg-psyched-orange text-white">
                Start Your Success Story
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MidwesternRegionalDistrict;
