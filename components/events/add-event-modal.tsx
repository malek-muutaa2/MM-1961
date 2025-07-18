"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type AddEventModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddEventModal({ open, onOpenChange }: Readonly<AddEventModalProps>) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [eventType, setEventType] = useState("internal")

  // Mock products for selection
  const products = [
    { id: "1", name: "Product A" },
    { id: "2", name: "Product B" },
    { id: "3", name: "Product C" },
    { id: "4", name: "Product D" },
    { id: "5", name: "Product E" },
    { id: "6", name: "Product F" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>Create a new event that may impact forecasting and KPI performance.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" placeholder="Enter event title" />
          </div>

          <div className="grid gap-2">
            <Label>Event Type</Label>
            <RadioGroup defaultValue="internal" onValueChange={setEventType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="internal" id="internal" />
                <Label htmlFor="internal">Internal (Manufacturing, Supply Chain)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="facility" id="facility" />
                <Label htmlFor="facility">Facility (Hospital, Clinic)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="seasonal" id="seasonal" />
                <Label htmlFor="seasonal">Seasonal Trend</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Event Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {eventType === "internal" && (
                  <>
                    <SelectItem value="shortage">Shortage</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing Issue</SelectItem>
                    <SelectItem value="logistics">Logistics/Supply Chain</SelectItem>
                    <SelectItem value="quality">Quality Control</SelectItem>
                  </>
                )}
                {eventType === "facility" && (
                  <>
                    <SelectItem value="personnel">Personnel Change</SelectItem>
                    <SelectItem value="expansion">Facility Expansion</SelectItem>
                    <SelectItem value="closure">Temporary Closure</SelectItem>
                    <SelectItem value="policy">Policy Change</SelectItem>
                  </>
                )}
                {eventType === "seasonal" && (
                  <>
                    <SelectItem value="demand">Seasonal Demand</SelectItem>
                    <SelectItem value="weather">Weather Impact</SelectItem>
                    <SelectItem value="holiday">Holiday Period</SelectItem>
                    <SelectItem value="fiscal">Fiscal Period</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    autoFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Impact Level</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select impact level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Impact</SelectItem>
                <SelectItem value="medium">Medium Impact</SelectItem>
                <SelectItem value="low">Low Impact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Affected Products</Label>
            <div className="border rounded-md p-4 max-h-[150px] overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-2 mb-2">
                  <Checkbox id={`product-${product.id}`} />
                  <Label htmlFor={`product-${product.id}`}>{product.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide details about this event and its potential impact"
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Add Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
