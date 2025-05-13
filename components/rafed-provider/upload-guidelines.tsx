import { Check, Info, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function UploadGuidelines() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 font-semibold">
          <Info className="h-4 w-4 text-blue-500" />
          File Format Requirements
        </h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-green-500" />
            <span>Excel (.xlsx, .xls) or CSV format</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-green-500" />
            <span>Maximum file size: 10MB</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-green-500" />
            <span>Must include all required columns (Product SKU, Product Name, Forecast Quantity)</span>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="flex items-center gap-2 font-semibold">
          <Info className="h-4 w-4 text-blue-500" />
          Data Requirements
        </h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-green-500" />
            <span>All product SKUs must match Rafed's catalog</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-green-500" />
            <span>Forecast quantities must be positive integers</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-green-500" />
            <span>Include forecasts for all products, even if quantity is zero</span>
          </li>
        </ul>
      </div>

      <Card className="bg-blue-50 p-4 dark:bg-blue-950">
        <div className="flex flex-col items-center space-y-3">
          <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          <div className="text-center">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300">Download Template</h3>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
              Use our template with sample data to ensure your forecast meets all requirements
            </p>
          </div>
          <Button className="w-full" asChild>
            <a href="#" download>
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </a>
          </Button>
        </div>
      </Card>

      <div>
        <h3 className="flex items-center gap-2 font-semibold">
          <Info className="h-4 w-4 text-blue-500" />
          Validation Process
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          After upload, your file will be validated for format and data quality. Any issues will be reported for
          correction before final submission.
        </p>
      </div>

      <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Need help? Contact your Rafed account manager for assistance.
        </p>
      </div>
    </div>
  )
}
