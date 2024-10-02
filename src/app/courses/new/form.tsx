'use client'

import { Button } from "@/components/ui/button";
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
import { LoaderCircle, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Language } from "@/app/interfaces/language";

export const CourseFormSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string({ required_error: "Description is required" }),
  targetAudience: z.string({ required_error: "Target Audience is required" }),
  learningObjectives: z.string({ required_error: "Learning Objectives is required" }),
  level: z.string({ required_error: "Level is required" }),
  duration: z.string({ required_error: "Duration is required" }),
  languages: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Language is required",
  }),
})

interface Props {
  loading: boolean,
  languages: Language[],
  course?: Course,
  submit(formData: z.infer<typeof CourseFormSchema>): void
}

export default function CourseForm({ loading, languages, submit }: Props) {
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
    defaultValues: {
      languages: [languages.find((l) => l.code === 'en-IN')?.id],
    },
    disabled: loading
  })

  function onSubmit(formData: z.infer<typeof CourseFormSchema>) {
    submit(formData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="bg-white p-4 border rounded-md flex flex-col gap-4">
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
          {/* Languages */}
          <FormField
            control={form.control}
            name="languages"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Languages</FormLabel>
                </div>
                {languages.map(({ id, code, name }) => (
                  <FormField
                    key={id}
                    control={form.control}
                    name="languages"
                    render={({ field }) => {
                      return (
                        <FormItem key={id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              disabled={loading || code === 'en-IN'}
                              checked={field.value?.includes(id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, id])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== id
                                    )
                                  )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {name}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="flex items-center gap-4" type="submit" disabled={loading}>
            {!loading && <Save className="h-4 w-4" />}
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
