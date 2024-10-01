import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDateSevenDaysAgo } from "../libs";

const DateRange = () => {
  const sevenDaysAgo = getDateSevenDaysAgo();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize dateFrom and dateTo based on search params or defaults
  const [dateFrom, setDateFrom] = useState(() => {
    const df = searchParams.get("df");
    return df && new Date(df).getTime() <= new Date().getTime()
      ? df
      : sevenDaysAgo || new Date().toISOString().split("T")[0];
  });

  const [dateTo, setDateTo] = useState(() => {
    const dt = searchParams.get("dt");
    return dt && new Date(dt).getTime() >= new Date(dateFrom).getTime()
      ? dt
      : new Date().toISOString().split("T")[0];
  });

  // Update the search params only if they are different from the state values
  useEffect(() => {
    const currentParams = {
      df: searchParams.get("df"),
      dt: searchParams.get("dt"),
    };

    if (currentParams.df !== dateFrom || currentParams.dt !== dateTo) {
      setSearchParams({ df: dateFrom, dt: dateTo });
    }
  }, [dateFrom, dateTo, searchParams, setSearchParams]);

  // Handle dateFrom change
  const handleDateFromChange = (e) => {
    const df = e.target.value;
    setDateFrom(df);
    if (new Date(df).getTime() > new Date(dateTo).getTime()) {
      setDateTo(df);
    }
  };

  // Handle dateTo change
  const handleDateToChange = (e) => {
    const dt = e.target.value;
    setDateTo(dt);
    if (new Date(dt).getTime() < new Date(dateFrom).getTime()) {
      setDateFrom(dt);
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <div className='flex items-center gap-1'>
        <label className='block text-gray-700 dark:text-gray-400 text-sm mb-2' htmlFor='dateFrom'>
          Filter
        </label>
        <input
          className='inputStyles'
          name='dateFrom'
          type='date'
          max={dateTo}
          value={dateFrom}
          onChange={handleDateFromChange}
        />
      </div>
      <div className='flex items-center gap-1'>
        <label className='block text-gray-700 dark:text-gray-400 text-sm mb-2' htmlFor='dateTo'>
          To
        </label>
        <input
          className='inputStyles'
          name='dateTo'
          type={"date"}
          value={dateTo}
          min={dateFrom}
          onChange={handleDateToChange}
        />
      </div>
    </div>
  );
};

export default DateRange;
