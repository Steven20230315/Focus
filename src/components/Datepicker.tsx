import { useState, type PointerEvent } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { LuCalendarPlus } from 'react-icons/lu';
import { LuCalendar } from 'react-icons/lu';
import {
  startOfDay,
  format,
  eachDayOfInterval,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isToday,
  isSameMonth,
  isSameDay,
  parse,
  add,
} from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Datepicker() {
  const today = startOfDay(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  // State to control the open status of the menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle menu function
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Function to handle menu item clicks without closing the menu

  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  // A helper function to compute the class name for the day button
  function getDayButtonClass(day: Date, selectedDay: Date | null, today: Date, active: boolean) {
    // The base class for every day button
    const baseClass = 'mx-auto flex h-6 w-6 items-center justify-center rounded-full';
    let classNames = baseClass;

    // If user selected a day, check if the day is the same as the selected day
    if (selectedDay && isSameDay(day, selectedDay)) {
      // Check if the selected day is today
      classNames += isToday(day) ? ' bg-sky-900 text-white' : ' bg-gray-900 text-white';
    } else {
      if (isToday(day)) {
        classNames += ' bg-red-600 text-base font-normal text-white';
      } else if (isSameMonth(day, today)) {
        classNames += ' text-gray-900';
      } else {
        classNames += ' text-gray-600/90';
      }
    }

    if (active && !selectedDay) {
      classNames += ' bg-sky-100 text-sky-900';
    }

    if ((selectedDay && (isSameDay(day, selectedDay) || isToday(day))) || active) {
      classNames += ' font-light';
    }

    return classNames;
  }

  const newDays = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function nextMonth(e: PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function prevMonth(e: PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, 'MMM-yyyy'));
  }

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <input
            type="text"
            hidden
            value={selectedDay ? format(selectedDay, 'yyyy-MM-dd') : undefined}
            name="date"
            readOnly
          />
          <Menu.Button onClick={toggleMenu} className={' flex items-center justify-center  gap-4'}>
            {!open && selectedDay === null ? (
              <LuCalendarPlus className="h-5 w-5 text-white" />
            ) : (
              <>
                <LuCalendar className="h-5 w-5 text-white" />
                <div>{selectedDay ? format(selectedDay, 'P') : 'Pick a date'}</div>
              </>
            )}
          </Menu.Button>
          <Transition
            enter="transform transition duration-100 ease-in"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transform duration-75 ease-out"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items className="absolute -right-28 mt-2 w-60 rounded-md bg-sky-600 px-4 py-2">
              <div className="flex items-center">
                <h2 className="flex-auto text-sm font-semibold text-gray-900">
                  {format(firstDayCurrentMonth, 'MMMM yyyy')}
                </h2>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={prevMonth}
                      className={`-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 ${active ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                      <span className="sr-only">Previous month</span>
                      <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={nextMonth}
                      className={`-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 ${active ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                      <span className="sr-only">Previous month</span>
                      <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className=" grid md:divide-gray-200">
                <div className="mt-3 grid grid-cols-7 text-center text-xs font-medium leading-6 text-gray-900">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={`day ${index}`}>{day}</div>
                  ))}
                </div>

                <div className=" mt-2 grid grid-cols-7 text-sm">
                  {newDays.map((day, index) => (
                    <Menu.Item
                      as="div"
                      onClick={(e) => e.preventDefault()}
                      key={day.toString()}
                      className={index > 6 ? 'border-t border-gray-200 py-1.5' : 'py-1.5'}
                    >
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={getDayButtonClass(day, selectedDay, today, active)}
                        >
                          <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
