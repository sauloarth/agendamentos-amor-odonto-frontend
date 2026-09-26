import { useId, useState } from 'react';
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS } from '../../utils/appointments';
import { formatCurrency, formatDuration } from '../../utils/currency';
import Badge from '../ui/Badge';
import { formatDateTime, formatTimeRange, formatWeekdayDate } from '../../utils/dates';

const STATUS_TONES = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'pine',
  [APPOINTMENT_STATUS.CANCELLED]: 'danger',
};

const Row = ({ label, children }) => (
  <div className="flex justify-between gap-4 py-2.5">
    <dt className="text-ink/60">{label}</dt>
    <dd className="text-right font-medium break-words min-w-0">{children}</dd>
  </div>
);

// `people`: [{ label, person }] — quem aparece no cartão (o profissional, para o paciente; o paciente,
// para o profissional; ambos, para o admin). `actions` entra no fim do detalhe expandido.
const AppointmentCard = ({ appointment, people, actions }) => {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const { product, status, startDateTime, endDateTime, createdAt, cancelReason } = appointment;

  return (
    <article className="rounded-xl border border-ink/10 bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <p className="text-sm text-ink/60">
            <span className="inline-block first-letter:uppercase">{formatWeekdayDate(startDateTime)}</span>
            <span className="mx-1.5">·</span>
            <span className="tabular-nums">{formatTimeRange(startDateTime, endDateTime)}</span>
          </p>
          <h3 className="mt-1 text-lg">{product?.name ?? 'Procedimento removido'}</h3>
          {people.map(({ label, person }) => (
            <p key={label} className="text-sm text-ink/70">
              {label}: {person?.name ?? '—'}
            </p>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={STATUS_TONES[status]}>{APPOINTMENT_STATUS_LABELS[status]}</Badge>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={detailsId}
            className="text-sm font-medium text-pine-600 hover:text-pine-700 underline-offset-2 hover:underline"
          >
            {open ? 'Ocultar' : 'Detalhes'}
          </button>
        </div>
      </div>

      {open && (
        <div id={detailsId} className="border-t border-ink/10 px-5 pb-4">
          <dl className="divide-y divide-ink/10 text-sm">
            {product && (
              <>
                <Row label="Duração">{formatDuration(product.durationMinutes)}</Row>
                <Row label="Valor">{formatCurrency(product.price)}</Row>
              </>
            )}
            {people.map(({ label, person }) => (
              <Row key={label} label={label}>
                {[person?.email, person?.phone].filter(Boolean).join(' · ') || '—'}
              </Row>
            ))}
            <Row label="Agendada em">{formatDateTime(createdAt)}</Row>
            {status === APPOINTMENT_STATUS.CANCELLED && (
              <Row label="Motivo do cancelamento">{cancelReason || 'Não informado'}</Row>
            )}
          </dl>
          {actions && <div className="mt-4">{actions}</div>}
        </div>
      )}
    </article>
  );
};

export default AppointmentCard;
