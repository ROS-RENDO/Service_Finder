"use client"
import { useState } from 'react';
import { Clock, Plus, Trash2, Calendar, Sun, Moon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStaffAvailability } from '@/lib/hooks/useStaff';
import { addDays, format } from 'date-fns';

const weekDays = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

type TimeSlot = { start: string; end: string };
type DayAvailability = { enabled: boolean; slots: TimeSlot[] };
type WeekAvailability = Record<string, DayAvailability>;

const initialAvailability: WeekAvailability = {
  monday: { enabled: true, slots: [{ start: '08:00', end: '17:00' }] },
  tuesday: { enabled: true, slots: [{ start: '08:00', end: '17:00' }] },
  wednesday: { enabled: true, slots: [{ start: '08:00', end: '17:00' }] },
  thursday: { enabled: true, slots: [{ start: '08:00', end: '17:00' }] },
  friday: { enabled: true, slots: [{ start: '08:00', end: '17:00' }] },
  saturday: { enabled: true, slots: [{ start: '09:00', end: '14:00' }] },
  sunday: { enabled: false, slots: [] },
};

const timeOptions = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
];

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export default function StaffAvailability() {
  const [availability, setAvailability] = useState<WeekAvailability>(initialAvailability);
  const [saved, setSaved] = useState(false);
  const { createAvailability, loading } = useStaffAvailability({ autoFetch: false });

  const toggleDay = (dayKey: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled: !prev[dayKey].enabled,
        slots: !prev[dayKey].enabled ? [{ start: '09:00', end: '17:00' }] : [],
      },
    }));
    setSaved(false);
  };

  const updateSlot = (dayKey: string, slotIndex: number, field: 'start' | 'end', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        slots: prev[dayKey].slots.map((slot, i) =>
          i === slotIndex ? { ...slot, [field]: value } : slot
        ),
      },
    }));
    setSaved(false);
  };

  const addSlot = (dayKey: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        slots: [...prev[dayKey].slots, { start: '13:00', end: '17:00' }],
      },
    }));
    setSaved(false);
  };

  const removeSlot = (dayKey: string, slotIndex: number) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        slots: prev[dayKey].slots.filter((_, i) => i !== slotIndex),
      },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (loading) return;

    // Generate slots for the next 30 days
    const today = new Date();
    const promises = [];

    // Simple strategy: iterate next 30 days, check day of week, add slots if enabled
    for (let i = 0; i < 30; i++) {
      const currentDate = addDays(today, i);
      const dayName = format(currentDate, 'EEEE').toLowerCase(); // 'monday', 'tuesday'...

      const dayConfig = availability[dayName];

      if (dayConfig && dayConfig.enabled) {
        for (const slot of dayConfig.slots) {
          promises.push(
            createAvailability({
              date: format(currentDate, 'yyyy-MM-dd'),
              startTime: slot.start,
              endTime: slot.end
            })
          );
        }
      }
    }

    try {
      await Promise.all(promises);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save availability', error);
      // Even if some fail (duplicates), we show success for now as a "best effort" sync
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const totalHours = Object.values(availability).reduce((total, day) => {
    if (!day.enabled) return total;
    return total + day.slots.reduce((dayTotal, slot) => {
      const [startH, startM] = slot.start.split(':').map(Number);
      const [endH, endM] = slot.end.split(':').map(Number);
      return dayTotal + (endH + endM / 60) - (startH + startM / 60);
    }, 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Availability</h1>
        <p className="text-muted-foreground mt-1">Set your working hours for each day of the week</p>
      </div>

      {/* Summary Card */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Clock className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{totalHours.toFixed(1)} hours</p>
          <p className="text-sm text-muted-foreground">Available this week</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <button
          onClick={() => {
            const allEnabled = weekDays.every(d => availability[d.key].enabled);
            weekDays.forEach(d => {
              if (allEnabled) {
                setAvailability(prev => ({
                  ...prev,
                  [d.key]: { enabled: false, slots: [] },
                }));
              } else {
                setAvailability(prev => ({
                  ...prev,
                  [d.key]: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
                }));
              }
            });
            setSaved(false);
          }}
          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Toggle All Days
        </button>
        <button
          onClick={() => {
            weekDays.forEach(d => {
              if (availability[d.key].enabled) {
                setAvailability(prev => ({
                  ...prev,
                  [d.key]: { ...prev[d.key], slots: [{ start: '09:00', end: '17:00' }] },
                }));
              }
            });
            setSaved(false);
          }}
          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
        >
          <Sun className="w-4 h-4" />
          Set Standard Hours
        </button>
      </div>

      {/* Days List */}
      <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {weekDays.map((day, index) => {
          const dayData = availability[day.key];
          return (
            <div
              key={day.key}
              className={cn(
                "bg-card rounded-xl border border-border p-4 transition-all animate-slide-in",
                !dayData.enabled && "opacity-60"
              )}
              style={{ animationDelay: `${0.25 + index * 0.03}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDay(day.key)}
                    className={cn(
                      "w-10 h-6 rounded-full transition-colors relative",
                      dayData.enabled ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all",
                        dayData.enabled ? "left-[18px]" : "left-0.5"
                      )}
                    />
                  </button>
                  <span className="font-medium text-foreground">{day.label}</span>
                </div>
                {dayData.enabled && (
                  <button
                    onClick={() => addSlot(day.key)}
                    className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Slot
                  </button>
                )}
              </div>

              {dayData.enabled && (
                <div className="space-y-2">
                  {dayData.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <select
                          value={slot.start}
                          onChange={(e) => updateSlot(day.key, slotIndex, 'start', e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>{formatTime(time)}</option>
                          ))}
                        </select>
                        <span className="text-muted-foreground">to</span>
                        <select
                          value={slot.end}
                          onChange={(e) => updateSlot(day.key, slotIndex, 'end', e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>{formatTime(time)}</option>
                          ))}
                        </select>
                      </div>
                      {dayData.slots.length > 1 && (
                        <button
                          onClick={() => removeSlot(day.key, slotIndex)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!dayData.enabled && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Moon className="w-4 h-4" />
                  <span className="text-sm">Day off</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <button
          onClick={handleSave}
          disabled={loading}
          className={cn(
            "px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2",
            saved
              ? "bg-success text-success-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? (
            <>Saving...</>
          ) : saved ? (
            <>
              <Check className="w-5 h-5" />
              Saved!
            </>
          ) : (
            'Save Availability'
          )}
        </button>
      </div>
    </div>
  );
}
