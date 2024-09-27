import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";


export default function NewCourse() {
  const targetAudiences = [
    'Business Professionals',
    'IT Professionals',
    'Healthcare Professionals',
    'Educators',
    'Artists',
    'Engineers',
    'Scientists',
    'Human Resources',
    'Marketing',
    'Finance',
    'Legal'
  ]

  const levels = [
    'Beginners',
    'Intermediate',
    'Advanced'
  ]

  const durations = [
    '0 - 2 Hours',
    '3 - 6 Hours',
    '7 - 16 Hours',
    '17+ Hours']

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">New Course</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Title</Label>
                <Input
                  id="name"
                  type="text"
                  className="w-full"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="min-h-32"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetAudiences.map((ta, i) => (
                      <SelectItem key={i} value={ta}>{ta}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="learningObjectives">Learning Objectives</Label>
                <Textarea
                  id="learningObjectives"
                  className="min-h-32"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="level">Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((l, i) => (
                      <SelectItem key={i} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="duration">Duration</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((d, i) => (
                      <SelectItem key={i} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
