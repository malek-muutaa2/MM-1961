import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Hospital, Mail, CheckCircle, Copy, Send } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InviteHospitalsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invite Hospitals</h2>
          <p className="text-muted-foreground">Expand your network by inviting healthcare facilities to collaborate</p>
        </div>
      </div>

      <Tabs defaultValue="invite" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invite">Send Invitations</TabsTrigger>
          <TabsTrigger value="pending">Pending Invitations (5)</TabsTrigger>
          <TabsTrigger value="templates">Invitation Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="invite" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <div className="md:col-span-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>New Invitation</CardTitle>
                  <CardDescription>Send an invitation to a healthcare facility to join your network</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospital-name">Hospital Name</Label>
                    <Input id="hospital-name" placeholder="Enter hospital name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" type="email" placeholder="supply.chain@hospital.org" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital-type">Hospital Type</Label>
                    <Select>
                      <SelectTrigger id="hospital-type">
                        <SelectValue placeholder="Select hospital type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teaching">Teaching Hospital</SelectItem>
                        <SelectItem value="community">Community Hospital</SelectItem>
                        <SelectItem value="specialty">Specialty Hospital</SelectItem>
                        <SelectItem value="rural">Rural Hospital</SelectItem>
                        <SelectItem value="clinic">Outpatient Clinic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invitation-template">Invitation Template</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger id="invitation-template">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Invitation</SelectItem>
                        <SelectItem value="detailed">Detailed Benefits</SelectItem>
                        <SelectItem value="urgent">Supply Chain Optimization</SelectItem>
                        <SelectItem value="followup">Follow-up Invitation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-message">Custom Message</Label>
                    <Textarea
                      id="custom-message"
                      placeholder="Add a personalized message to your invitation..."
                      rows={4}
                      defaultValue="We'd like to invite your hospital to join our collaborative supply chain network. By sharing data securely with us, we can help optimize your inventory levels and ensure you never run out of critical supplies."
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Preview</Button>
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    Send Invitation
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="md:col-span-3 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invitation Preview</CardTitle>
                </CardHeader>
                <CardContent className="bg-slate-50 rounded-md p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">MUUTAA Healthcare Network</h3>
                      <p className="text-xs text-muted-foreground">Invitation to Collaborate</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Join Our Healthcare Supply Network</h4>
                    <p className="text-sm">
                      We'd like to invite your hospital to join our collaborative supply chain network. By sharing data
                      securely with us, we can help optimize your inventory levels and ensure you never run out of
                      critical supplies.
                    </p>
                  </div>

                  <div className="space-y-2 border-t pt-2">
                    <h4 className="text-sm font-medium">Benefits of Joining:</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span>Reduce stockouts by up to 35%</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span>Decrease expired product waste</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span>Improve forecast accuracy</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span>Full control over shared data</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <Button className="w-full">Accept Invitation</Button>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  This is a preview of how your invitation will appear to recipients.
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Invite</CardTitle>
                  <CardDescription>Generate a shareable invitation link</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input value="https://muutaa.ml/invite/hc29x7b3" readOnly />
                    <Button variant="outline" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    This link expires in 7 days. Anyone with this link can request to join your network.
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Generate New Link
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>Track the status of sent invitations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Hospital className="h-4 w-4 text-muted-foreground" />
                        <span>Mercy Medical Center</span>
                      </div>
                    </TableCell>
                    <TableCell>sarah.johnson@mercy.org</TableCell>
                    <TableCell>May 15, 2023</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Sent</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Resend
                        </Button>
                        <Button variant="ghost" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Hospital className="h-4 w-4 text-muted-foreground" />
                        <span>St. Luke's Hospital</span>
                      </div>
                    </TableCell>
                    <TableCell>procurement@stlukes.org</TableCell>
                    <TableCell>May 12, 2023</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Viewed</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Resend
                        </Button>
                        <Button variant="ghost" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Hospital className="h-4 w-4 text-muted-foreground" />
                        <span>County General</span>
                      </div>
                    </TableCell>
                    <TableCell>supply.chain@countygeneral.org</TableCell>
                    <TableCell>May 10, 2023</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Sent</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Resend
                        </Button>
                        <Button variant="ghost" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Hospital className="h-4 w-4 text-muted-foreground" />
                        <span>Riverside Medical</span>
                      </div>
                    </TableCell>
                    <TableCell>operations@riverside.com</TableCell>
                    <TableCell>May 8, 2023</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Resend
                        </Button>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Hospital className="h-4 w-4 text-muted-foreground" />
                        <span>Valley Health System</span>
                      </div>
                    </TableCell>
                    <TableCell>inventory@valleyhealth.org</TableCell>
                    <TableCell>May 5, 2023</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Viewed</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Resend
                        </Button>
                        <Button variant="ghost" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invitation Templates</CardTitle>
              <CardDescription>Manage your invitation message templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Standard Invitation</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm bg-slate-50 p-4 rounded-md">
                  We'd like to invite your hospital to join our collaborative supply chain network. By sharing data
                  securely with us, we can help optimize your inventory levels and ensure you never run out of critical
                  supplies.
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Detailed Benefits</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm bg-slate-50 p-4 rounded-md">
                  Join our healthcare supply network to transform your inventory management. Our collaborative platform
                  has helped hospitals reduce stockouts by 35%, decrease waste from expired products by 24%, and save an
                  average of $125,000 annually in inventory costs. Your data remains under your control with our
                  HIPAA-compliant sharing settings.
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Supply Chain Optimization</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm bg-slate-50 p-4 rounded-md">
                  In today's challenging healthcare environment, supply chain resilience is critical. By joining our
                  network, you'll gain access to advanced forecasting tools that predict potential shortages before they
                  occur. Our collaborative approach ensures that critical medical supplies are available when and where
                  they're needed most.
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Follow-up Invitation</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm bg-slate-50 p-4 rounded-md">
                  We recently invited you to join our healthcare supply network and wanted to follow up. Many hospitals
                  in your region have already joined and are seeing significant improvements in their supply chain
                  efficiency. We'd be happy to schedule a brief demonstration to show how our platform can benefit your
                  facility.
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Create New Template</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
