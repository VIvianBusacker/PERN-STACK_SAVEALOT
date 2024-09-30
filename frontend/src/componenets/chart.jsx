import React from "react"; // Removed unnecessary imports

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Title from "./title";

export const Chart = ({ data = [] }) => {
  // Optional: Render a fallback message if there's no data
  if (data.length === 0) {
    return <p>No data available to display.</p>;
  }
  console.log(data);

  return (
    <div className="flex-1 w-full">
      <Title title="Transaction Activity" />

      <ResponsiveContainer width={"100%"} height={500} className="mt-5">
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" padding={{ left: 30, right: 30 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
