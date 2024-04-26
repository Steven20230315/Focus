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
  const [selectedDay, setSelectedDay] = useState(today);
  // State to control the open status of the menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle menu function
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Function to handle menu item clicks without closing the menu

  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
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
    <div className="min-h-400 flex justify-center ">
      <Menu as="div" className="relative">
        {({ open }) => (
          <>
            <Menu.Button onClick={toggleMenu} className={'flex items-center gap-4'}>
              {open ? (
                <>
                  <LuCalendar />
                  <div>{format(selectedDay, 'P')}</div>
                </>
              ) : (
                <LuCalendarPlus className="h-5 w-5 text-white" />
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
              <Menu.Items className="rounded-md bg-sky-600 px-4 py-2">
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

                  <div className="mt-2 grid grid-cols-7 text-sm">
                    {newDays.map((day, index) => (
                      <Menu.Item
                        as="div"
                        onClick={(e) => e.preventDefault()}
                        key={day.toString()}
                        className={classNames(index > 6 && 'border-t border-gray-200', 'py-1.5')}
                      >
                        {({ active }) => (
                          <button
                            type="button"
                            onClick={() => setSelectedDay(day)}
                            // onClick={(e) => console.log(e)}
                            className={`${classNames(
                              isSameDay(day, selectedDay) && 'text-white',
                              !isSameDay(day, selectedDay) &&
                                isToday(day) &&
                                'bg-red-600  text-base font-semibold text-white',
                              !isSameDay(day, selectedDay) &&
                                !isToday(day) &&
                                isSameMonth(day, today) &&
                                'text-gray-900',
                              !isSameDay(day, selectedDay) &&
                                !isToday(day) &&
                                !isSameMonth(day, today) &&
                                'text-gray-400',
                              isSameDay(day, selectedDay) && isToday(day) && 'bg-sky-900',
                              isSameDay(day, selectedDay) && !isToday(day) && 'bg-gray-900',
                              !isSameDay(day, selectedDay) && active ? 'bg-sky-100 text-sky-900' : 'text-gray-900',
                              (isSameDay(day, selectedDay) || isToday(day)) && 'font-light',
                              'mx-auto flex h-8 w-8 items-center justify-center rounded-full ',
                            )}`}
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
    </div>
  );
}
