import { useMemo, useState } from 'react';
import { getAvailability } from '../../api/availability';
import useAsync from '../../hooks/useAsync';
import {
  MAX_AVAILABILITY_RANGE_DAYS,
  addDays,
  availabilityRange,
  clinicDayKey,
  formatDate,
  formatTime,
  formatWeekdayDate,
  groupByClinicDay,
  startOfClinicDay,
} from '../../utils/dates';
import Button from '../ui/Button';
import LoadingState from '../ui/LoadingState';
import ErrorState from '../ui/ErrorState';
import EmptyState from '../ui/EmptyState';

const WEEK_DAYS = 7;

// Janela de 7 dias a partir de `weekStart` (dia da clínica, 'YYYY-MM-DD'); não passa de 90 dias à frente.
const SlotStep = ({ productId, professionalId, weekStart, onWeekChange, selectedStart, onSelect }) => {
  const today = clinicDayKey();
  const lastDay = addDays(today, MAX_AVAILABILITY_RANGE_DAYS); // exclusivo
  const nextWeek = addDays(weekStart, WEEK_DAYS);
  const days = useMemo(
    () =>
      Array.from({ length: WEEK_DAYS }, (_, i) => addDays(weekStart, i)).filter((day) => day < lastDay),
    [weekStart, lastDay]
  );

  const { data, loading, error, reload } = useAsync(
    () =>
      getAvailability({ professionalId, productId, ...availabilityRange(weekStart, days.length) }),
    [professionalId, productId, weekStart, days.length]
  );

  const slotsByDay = useMemo(() => groupByClinicDay(data || []), [data]);
  // Ao voltar da confirmação, reabre no dia do horário já escolhido.
  const [pickedDay, setPickedDay] = useState(() => (selectedStart ? clinicDayKey(selectedStart) : null));
  const firstDayWithSlots = days.find((day) => slotsByDay.has(day));
  const activeDay = pickedDay && slotsByDay.has(pickedDay) ? pickedDay : firstDayWithSlots;

  const goToWeek = (day) => {
    setPickedDay(null);
    onWeekChange(day);
  };

  const weekNav = (
    <div className="mb-5 flex items-center justify-between gap-3">
      <Button
        variant="secondary"
        onClick={() => goToWeek(addDays(weekStart, -WEEK_DAYS) < today ? today : addDays(weekStart, -WEEK_DAYS))}
        disabled={weekStart <= today}
      >
        ← Anterior
      </Button>
      <p className="text-sm text-ink/60 text-center">
        {formatDate(startOfClinicDay(days[0]))} a {formatDate(startOfClinicDay(days[days.length - 1]))}
      </p>
      <Button variant="secondary" onClick={() => goToWeek(nextWeek)} disabled={nextWeek >= lastDay}>
        Próxima →
      </Button>
    </div>
  );

  let content;
  if (loading) {
    content = <LoadingState label="Buscando horários..." />;
  } else if (error) {
    content = <ErrorState message={error.message} onRetry={reload} />;
  } else if (!activeDay) {
    content = (
      <EmptyState
        title="Sem horários nesta semana"
        description="Tente a semana seguinte ou escolha outro profissional."
        action={
          nextWeek < lastDay && (
            <Button variant="secondary" onClick={() => goToWeek(nextWeek)}>
              Próxima semana
            </Button>
          )
        }
      />
    );
  } else {
    content = (
      <>
        <div role="tablist" aria-label="Dias" className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {days.map((day) => {
            const count = slotsByDay.get(day)?.length || 0;
            const active = day === activeDay;
            return (
              <button
                key={day}
                role="tab"
                aria-selected={active}
                disabled={!count}
                onClick={() => setPickedDay(day)}
                className={`shrink-0 rounded-lg border px-3 py-2 text-sm capitalize transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  active
                    ? 'border-pine-600 bg-pine-600 text-canvas'
                    : 'border-ink/10 bg-surface hover:border-pine-400'
                }`}
              >
                {formatWeekdayDate(startOfClinicDay(day))}
              </button>
            );
          })}
        </div>
        <div role="tabpanel" className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
          {slotsByDay.get(activeDay).map((slot) => {
            const selected = slot.startDateTime === selectedStart;
            return (
              <button
                key={slot.startDateTime}
                onClick={() => onSelect(slot)}
                aria-pressed={selected}
                className={`rounded-lg border py-2 text-sm tabular-nums transition-colors ${
                  selected
                    ? 'border-ochre-500 bg-ochre-500 text-canvas'
                    : 'border-ink/10 bg-surface hover:border-pine-400'
                }`}
              >
                {formatTime(slot.startDateTime)}
              </button>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      {weekNav}
      {content}
    </>
  );
};

export default SlotStep;
