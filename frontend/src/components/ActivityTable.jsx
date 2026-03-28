import { MoreHorizontal, ArrowUpRight, Clock, User, Database, Edit3, Trash2, Eye } from "lucide-react"
import clsx from "clsx"

const MOCK_ACTIVITIES = [
  {
    id: 1,
    action: "Query Executed",
    description: "SELECT * FROM users WHERE active = true",
    user: "System",
    timestamp: "2 min ago",
    status: "success",
    type: "query",
  },
  {
    id: 2,
    action: "Schema Updated",
    description: "Added column 'last_login' to users table",
    user: "Admin",
    timestamp: "15 min ago",
    status: "success",
    type: "schema",
  },
  {
    id: 3,
    action: "Data Export",
    description: "Exported orders table to CSV",
    user: "Analyst",
    timestamp: "1 hour ago",
    status: "pending",
    type: "export",
  },
  {
    id: 4,
    action: "PII Scan",
    description: "Detected 3 potential PII columns",
    user: "System",
    timestamp: "2 hours ago",
    status: "warning",
    type: "security",
  },
  {
    id: 5,
    action: "Connection Test",
    description: "Database connection verified",
    user: "System",
    timestamp: "3 hours ago",
    status: "success",
    type: "connection",
  },
]

const statusColors = {
  success: "bg-green-500/10 text-green-500",
  pending: "bg-yellow-500/10 text-yellow-500",
  warning: "bg-orange-500/10 text-orange-500",
  error: "bg-destructive/10 text-destructive",
}

const typeIcons = {
  query: Database,
  schema: Edit3,
  export: ArrowUpRight,
  security: Eye,
  connection: Database,
}

export default function ActivityTable() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Track database operations and changes</p>
        </div>
        <button className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Action
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                User
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Time
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MOCK_ACTIVITIES.map((activity) => {
              const TypeIcon = typeIcons[activity.type] || Database
              return (
                <tr
                  key={activity.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <TypeIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {activity.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-muted-foreground max-w-xs truncate font-mono">
                      {activity.description}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-foreground">{activity.user}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={clsx(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                        statusColors[activity.status]
                      )}
                    >
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {activity.timestamp}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
