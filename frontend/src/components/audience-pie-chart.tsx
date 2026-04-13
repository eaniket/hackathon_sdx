import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { formatNumber } from "../lib/utils";
import { Card } from "./ui/card";

type AudiencePiePoint = {
  label: string;
  value: number;
};

type AudiencePieChartProps = {
  data: AudiencePiePoint[];
  title: string;
};

const COLORS = ["#7cc8ff", "#5b8cff", "#8ce99a", "#ffd479", "#f97316", "#ef4444"];

export function AudiencePieChart({
  data,
  title,
}: AudiencePieChartProps): JSX.Element {
  return (
    <Card className="space-y-4">
      <p className="text-sm font-medium text-white">{title}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={52}
              outerRadius={84}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#101624",
                border: "1px solid #232834",
                borderRadius: 12,
              }}
              formatter={(value: number, _name: string, item: { payload?: AudiencePiePoint }) => [
                formatNumber(value),
                item.payload?.label ?? "",
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
