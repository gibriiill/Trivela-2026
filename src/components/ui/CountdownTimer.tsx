"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [time, setTime] = useState<TimeUnits>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTime({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="card-dark w-16 h-16 flex items-center justify-center border-2 border-blue-border">
        <span className="font-display text-3xl text-gold">{String(value).padStart(2, "0")}</span>
      </div>
      <span className="text-sm font-heading text-blue-border uppercase">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-4 justify-center flex-wrap">
      <TimeUnit value={time.days} label="Days" />
      <TimeUnit value={time.hours} label="Hours" />
      <TimeUnit value={time.minutes} label="Mins" />
      <TimeUnit value={time.seconds} label="Secs" />
    </div>
  );
}
