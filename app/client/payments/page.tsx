"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Calendar, DollarSign, Download, Plus } from "lucide-react"
import ClientLayout from "@/components/client-layout"

export default function PaymentsPage() {
  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: "payment_1",
      amount: 120,
      status: "completed",
      counselor: "Dr. Sarah Johnson",
      sessionDate: "2024-01-10",
      transactionId: "txn_abc123",
      timestamp: "2024-01-10T14:00:00Z",
    },
    {
      id: "payment_2",
      amount: 100,
      status: "completed",
      counselor: "Dr. Michael Chen",
      sessionDate: "2024-01-08",
      transactionId: "txn_def456",
      timestamp: "2024-01-08T10:00:00Z",
    },
    {
      id: "payment_3",
      amount: 140,
      status: "pending",
      counselor: "Dr. Emily Davis",
      sessionDate: "2024-01-15",
      transactionId: "txn_ghi789",
      timestamp: "2024-01-15T16:00:00Z",
    },
  ])

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ])

  const totalSpent = paymentHistory
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const pendingPayments = paymentHistory.filter((payment) => payment.status === "pending")

  return (
    <ClientLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments & Billing</h1>
          <p className="text-gray-600 mt-2">Manage your payment methods and view transaction history</p>
        </div>

        {/* Payment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayments.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentMethods.length}</div>
              <p className="text-xs text-muted-foreground">Cards on file</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Payment Methods
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && <Badge variant="secondary">Default</Badge>}
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Payment</CardTitle>
              <CardDescription>Make a payment for upcoming sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="Enter amount" min="0" step="0.01" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="counselor">Counselor</Label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Select counselor</option>
                  <option value="dr-sarah">Dr. Sarah Johnson</option>
                  <option value="dr-michael">Dr. Michael Chen</option>
                  <option value="dr-emily">Dr. Emily Davis</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.brand} •••• {method.last4}
                    </option>
                  ))}
                </select>
              </div>

              <Button className="w-full">Process Payment</Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Payment History
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
            <CardDescription>Your transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.counselor}</p>
                      <p className="text-sm text-gray-600">
                        Session on {new Date(payment.sessionDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">Transaction ID: {payment.transactionId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount}</p>
                    <Badge variant={payment.status === "completed" ? "default" : "secondary"}>{payment.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  )
}
