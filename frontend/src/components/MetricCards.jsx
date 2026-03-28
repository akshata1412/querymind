import { Database, TableProperties, Key, TrendingUp, TrendingDown } from "lucide-react"
import clsx from "clsx"

export default function MetricCards({ schema }) {
  const tableCount = Object.keys(schema).length
  const columnCount = Object.values(schema).reduce((acc, table) => acc + (table.columns?.length || 0), 0)
  const relationCount = Object.values(schema).reduce((acc, table) => acc + (table.foreign_keys?.length || 0), 0)

  const metrics = [
    {
      title: "Total Tables",
      value: tableCount,
      change: "+2",
      trend: "up",
      icon: Database,
      color: "primary",
    },
    {
      title: "Total Columns",
      value: columnCount,
      change: "+12",
      trend: "up",
      icon: TableProperties,
      color: "secondary",
    },
    {
      title: "Foreign Keys",
      value: relationCount,
      change: "0",
      trend: "neutral",
      icon: Key,
      color: "accent",
    },
    {
      title: "Data Quality",
      value: "94%",
      change: "+3%",
      trend: "up",
      icon: TrendingUp,
      color: "success",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  )
}

function MetricCard({ title, value, change, trend, icon: Icon, color }) {
  const colorClasses = {
    primary: "from-primary/20 to-primary/5 border-primary/20",
    secondary: "from-secondary/20 to-secondary/5 border-secondary/20",
    accent: "from-accent/40 to-accent/10 border-accent/40",
    success: "from-green-500/20 to-green-500/5 border-green-500/20",
  }

  const iconColorClasses = {
    primary: "text-primary bg-primary/20",
    secondary: "text-secondary bg-secondary/20",
    accent: "text-foreground bg-accent",
    success: "text-green-500 bg-green-500/20",
  }

  return (
    <div
      className={clsx(
        "relative p-5 rounded-xl bg-gradient-to-br border overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        colorClasses[color]
      )}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
        <Icon className="w-full h-full" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={clsx("p-2 rounded-lg", iconColorClasses[color])}>
            <Icon className="w-4 h-4" />
          </div>
          {trend !== "neutral" && (
            <div
              className={clsx(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                trend === "up"
                  ? "text-green-500 bg-green-500/10"
                  : "text-destructive bg-destructive/10"
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {change}
            </div>
          )}
        </div>

        <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  )
}
