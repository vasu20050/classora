'use client';

import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Video,
  FileText
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

// Dummy events for demonstration
const EVENTS = [
  {
    id: 1,
    title: 'Advanced Mathematics Lecture',
    date: new Date(),
    time: '10:00 AM',
    type: 'class',
    color: 'violet'
  },
  {
    id: 2,
    title: 'Physics Assignment Due',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    time: '11:59 PM',
    type: 'assignment',
    color: 'rose'
  },
  {
    id: 3,
    title: 'Computer Science Lab',
    date: new Date(new Date().setDate(new Date().getDate() + 4)),
    time: '02:00 PM',
    type: 'class',
    color: 'emerald'
  },
  {
    id: 4,
    title: 'Mid-term Project Submission',
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    time: '11:59 PM',
    type: 'assignment',
    color: 'indigo'
  }
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get days from previous month to fill the first row
  const startDay = monthStart.getDay();
  const prevMonthDays = Array.from({ length: startDay }).map((_, i) => {
    const d = new Date(monthStart);
    d.setDate(d.getDate() - (startDay - i));
    return d;
  });

  const allDays = [...prevMonthDays, ...daysInMonth];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-white/50 text-sm mt-1">Manage your classes, assignments, and deadlines.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
            <button 
              onClick={prevMonth} 
              title="Previous month"
              aria-label="Previous month"
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white/70" />
            </button>
            <span className="w-32 text-center text-sm font-medium">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button 
              onClick={nextMonth} 
              title="Next month"
              aria-label="Next month"
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white/2 border border-white/10 rounded-2xl p-1 overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-7 border-b border-white/5 bg-[#08081a]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 auto-rows-[100px] sm:auto-rows-[120px] gap-px bg-white/5">
            {allDays.map((day, idx) => {
              const dayEvents = EVENTS.filter(e => isSameDay(e.date, day));
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <div 
                  key={day.toString()} 
                  className={`bg-[#060614] p-1.5 sm:p-2 hover:bg-white/2 transition-colors relative group
                    ${!isCurrentMonth ? 'opacity-40' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`
                      inline-flex items-center justify-center w-7 h-7 text-sm rounded-full
                      ${isToday(day) ? 'bg-violet-600 text-white font-bold shadow-lg shadow-violet-500/30' : 'text-white/70'}
                      ${isCurrentMonth && !isToday(day) ? 'group-hover:bg-white/10' : ''}
                    `}>
                      {format(day, 'd')}
                    </span>
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-[60px] sm:max-h-[80px] no-scrollbar">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id}
                        className={`text-[10px] sm:text-xs px-1.5 py-1 rounded border truncate
                          ${event.color === 'violet' ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' : ''}
                          ${event.color === 'rose' ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : ''}
                          ${event.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : ''}
                          ${event.color === 'indigo' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : ''}
                        `}
                        title={`${event.time} - ${event.title}`}
                      >
                        <span className="font-semibold">{event.time.split(' ')[0]}</span> {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Schedule */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/20 rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <CalendarIcon className="w-4 h-4 text-violet-400" />
              Upcoming Events
            </h3>
            
            <div className="space-y-3">
              {EVENTS.filter(e => e.date >= new Date()).slice(0, 4).map(event => (
                <div key={event.id} className="bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-medium leading-tight">{event.title}</h4>
                    {event.type === 'class' ? (
                      <Video className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Clock className="w-3 h-3" />
                    <span>{format(event.date, 'MMM d')} · {event.time}</span>
                  </div>
                </div>
              ))}
              
              {EVENTS.length === 0 && (
                <div className="text-center py-6 text-white/40 text-sm">
                  No upcoming events
                </div>
              )}
            </div>
            
            <button className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors">
              View all schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
