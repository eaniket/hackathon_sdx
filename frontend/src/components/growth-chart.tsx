import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { GrowthPoint } from "../types/api";
import { Card } from "./ui/card";

type GrowthChartProps = {
  title: string;
  data: GrowthPoint[];
  suffix?: string;
};

export function GrowthChart({ title, data, suffix = "%" }: GrowthChartProps): JSX.Element {
  return (
    <Card className="space-y-4">
      <p className="text-sm font-medium text-white">{title}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#1c2433" vertical={false} />
            <XAxis dataKey="label" stroke="#8b93a7" />
            <YAxis stroke="#8b93a7" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#101624",
                border: "1px solid #232834",
                borderRadius: 12,
              }}
              formatter={(value: number) => [`${value}${suffix}`, title]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#7cc8ff"
              strokeWidth={2}
              dot={{ fill: "#7cc8ff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
