import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Title from "./title";

const COLORS = ["#8884d8", "#82ca9d", "#00c49f", "#ff42c1 "];

const DoughnutChart = ({ dt }) => {
  const data = [
    { name: "Income", value: Number(dt?.income) },
    { name: "Expense", value: Number(dt?.expense) },
  ];

  return (
    <div className='w-full md:w-1/3 flex flex-col items-center bg-transparent dark:bg-transparent'>
      <Title title='Summary' />
      <ResponsiveContainer width={"100%"} height={500}>
        <PieChart width={500} height={400}>
          <Tooltip />
          <Legend />
          <Pie
            data={data}
            innerRadius={110}
            outerRadius={170}
            fill='#8884d8'
            paddingAngle={5}
            dataKey='value'
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;
