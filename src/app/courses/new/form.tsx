'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { Course } from "@/app/interfaces/course";
import { LoaderCircle } from "lucide-react";

export const CourseFormSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string({ required_error: "Description is required" }),
  targetAudience: z.string({ required_error: "Target Audience is required" }),
  learningObjectives: z.string({ required_error: "Learning Objectives is required" }),
  level: z.string({ required_error: "Level is required" }),
  duration: z.string({ required_error: "Duration is required" })
})

interface Props {
  loading: boolean,
  course: Course,
  submit(formData: z.infer<typeof CourseFormSchema>): void
}

export default function CourseForm({ loading, course, submit }: Props) {
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

  const form = useForm<z.infer<typeof CourseFormSchema>>({
    resolver: zodResolver(CourseFormSchema),
    defaultValues: course || {},
    disabled: loading
  })

  function onSubmit(formData: z.infer<typeof CourseFormSchema>) {
    submit(formData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-inherit">Title</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-inherit">Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Target Audience */}
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-inherit">Target Audience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {targetAudiences.map((x, i) => (
                            <SelectItem key={i} value={x}>{x}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Learning Objectives */}
                <FormField
                  control={form.control}
                  name="learningObjectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-inherit">Learning Objectives</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Level */}
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-inherit">Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {levels.map((x, i) => (
                            <SelectItem key={i} value={x}>{x}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Duration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-inherit">Duration</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {durations.map((x, i) => (
                            <SelectItem key={i} value={x}>{x}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full flex items-center gap-4" type="submit" disabled={loading}>
                  Generate
                  {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  )
}
