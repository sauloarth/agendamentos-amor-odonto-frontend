import { formatCurrency, formatDuration } from '../../utils/currency';
import { formatTimeRange, formatWeekdayDate } from '../../utils/dates';

const Row = ({ label, children }) => (
  <div className="flex justify-between gap-4 py-3">
    <dt className="text-ink/60">{label}</dt>
    <dd className="text-right font-medium">{children}</dd>
  </div>
);

const AppointmentSummary = ({ product, professional, startDateTime, endDateTime }) => (
  <dl className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-surface px-5 text-sm">
    <Row label="Procedimento">
      {product.name} <span className="text-ink/50 font-normal">({formatDuration(product.durationMinutes)})</span>
    </Row>
    <Row label="Profissional">{professional.name}</Row>
    <Row label="Data">
      <span className="capitalize">{formatWeekdayDate(startDateTime)}</span>
    </Row>
    <Row label="Horário">{formatTimeRange(startDateTime, endDateTime)}</Row>
    <Row label="Valor">{formatCurrency(product.price)}</Row>
  </dl>
);

export default AppointmentSummary;
