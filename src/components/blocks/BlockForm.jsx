import { useState } from 'react';
import { createBlock, updateBlock } from '../../api/blocks';
import { getApiError } from '../../api/errors';
import { useToast } from '../../context/ToastContext';
import { BLOCK_TYPE, WEEKDAYS_FROM_MONDAY } from '../../utils/blocks';
import {
  clinicDateTime,
  clinicDayKey,
  clinicTimeKey,
  endOfClinicDayInclusive,
  startOfClinicDay,
  toISO,
} from '../../utils/dates';
import Field from '../form/Field';
import Button from '../ui/Button';

const toForm = (block) => ({
  type: block?.type ?? BLOCK_TYPE.SINGLE,
  professional: block?.professional ?? '',
  reason: block?.reason ?? '',
  startDay: block?.startDateTime ? clinicDayKey(block.startDateTime) : '',
  startClock: block?.startDateTime ? clinicTimeKey(block.startDateTime) : '',
  endDay: block?.endDateTime ? clinicDayKey(block.endDateTime) : '',
  endClock: block?.endDateTime ? clinicTimeKey(block.endDateTime) : '',
  daysOfWeek: block?.daysOfWeek ?? [],
  startTime: block?.startTime ?? '',
  endTime: block?.endTime ?? '',
  validFrom: block?.validFrom ? clinicDayKey(block.validFrom) : '',
  validUntil: block?.validUntil ? clinicDayKey(block.validUntil) : '',
});

// Mesmas regras do backend, para o erro aparecer no campo antes do envio.
const validate = (form) => {
  const errors = {};
  if (form.type === BLOCK_TYPE.SINGLE) {
    if (!form.startDay || !form.startClock) errors.start = 'Informe o dia e a hora de início.';
    if (!form.endDay || !form.endClock) errors.end = 'Informe o dia e a hora de fim.';
    if (!errors.start && !errors.end) {
      const start = clinicDateTime(form.startDay, form.startClock);
      const end = clinicDateTime(form.endDay, form.endClock);
      if (end <= start) errors.end = 'O fim precisa ser depois do início.';
    }
  } else {
    if (form.daysOfWeek.length === 0) errors.daysOfWeek = 'Escolha ao menos um dia da semana.';
    if (!form.startTime) errors.startTime = 'Informe a hora de início.';
    if (!form.endTime) errors.endTime = 'Informe a hora de fim.';
    else if (form.startTime && form.endTime <= form.startTime)
      errors.endTime = 'O fim precisa ser depois do início (no mesmo dia).';
    if (form.validFrom && form.validUntil && form.validUntil < form.validFrom)
      errors.validUntil = 'O fim da vigência não pode ser antes do início.';
  }
  return errors;
};

// O PATCH é `.strict()` e não aceita `type`, `""` nem `null` (exceto `professional`): campos vazios são omitidos.
const toPayload = (form, { isAdmin, isEdit }) => {
  const payload = isEdit ? {} : { type: form.type };

  if (form.type === BLOCK_TYPE.SINGLE) {
    payload.startDateTime = toISO(clinicDateTime(form.startDay, form.startClock));
    payload.endDateTime = toISO(clinicDateTime(form.endDay, form.endClock));
  } else {
    payload.daysOfWeek = [...form.daysOfWeek].sort();
    payload.startTime = form.startTime;
    payload.endTime = form.endTime;
    if (form.validFrom) payload.validFrom = toISO(startOfClinicDay(form.validFrom));
    // O backend compara `validUntil` com o início do horário: "até o dia X" vale até o fim de X.
    if (form.validUntil) payload.validUntil = toISO(endOfClinicDayInclusive(form.validUntil));
  }

  if (form.reason.trim()) payload.reason = form.reason.trim();

  if (isAdmin) {
    if (isEdit) payload.professional = form.professional || null;
    else if (form.professional) payload.professional = form.professional;
  }

  return payload;
};

// Cria (sem `block`) ou edita um bloqueio. O tipo não muda na edição (o backend não permite).
// `professionals` só é usado pelo admin, para escolher a quem o bloqueio se aplica.
const BlockForm = ({ block, isAdmin, professionals = [], onSaved, onCancel }) => {
  const toast = useToast();
  const isEdit = Boolean(block);
  const [form, setForm] = useState(() => toForm(block));
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const single = form.type === BLOCK_TYPE.SINGLE;

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const toggleDay = (value) =>
    setForm((current) => ({
      ...current,
      daysOfWeek: current.daysOfWeek.includes(value)
        ? current.daysOfWeek.filter((d) => d !== value)
        : [...current.daysOfWeek, value],
    }));

  const submit = async (event) => {
    event.preventDefault();
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const payload = toPayload(form, { isAdmin, isEdit });
      const saved = isEdit ? await updateBlock(block._id, payload) : await createBlock(payload);
      toast.success(isEdit ? 'Bloqueio atualizado.' : 'Bloqueio criado.');
      onSaved(saved);
    } catch (err) {
      const apiError = getApiError(err, 'Não foi possível salvar o bloqueio.');
      setFieldErrors(apiError.fieldErrors);
      toast.error(apiError.message);
      setSubmitting(false);
    }
  };

  const clearHint = isEdit ? 'Numa edição, deixar em branco mantém o valor atual.' : undefined;

  return (
    <form onSubmit={submit} noValidate className="rounded-xl border border-pine-400/40 bg-surface p-5 space-y-4">
      <h2 className="text-xl">{isEdit ? 'Editar bloqueio' : 'Novo bloqueio'}</h2>

      {!isEdit && (
        <fieldset>
          <legend className="block text-sm font-medium mb-2">Tipo</legend>
          <div className="flex flex-wrap gap-2">
            {[
              { value: BLOCK_TYPE.SINGLE, label: 'Único', hint: 'um período específico' },
              { value: BLOCK_TYPE.RECURRING, label: 'Recorrente', hint: 'toda semana' },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  form.type === option.value ? 'border-pine-600 bg-pine-50' : 'border-ink/10'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={option.value}
                  className="accent-pine-600"
                  checked={form.type === option.value}
                  onChange={handleChange}
                />
                <span>
                  {option.label} <span className="text-ink/50">— {option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {isAdmin && (
        <Field
          as="select"
          label="Aplica-se a"
          name="professional"
          value={form.professional}
          onChange={handleChange}
          error={fieldErrors.professional}
        >
          <option value="">Clínica inteira</option>
          {professionals.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </Field>
      )}

      {single ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium mb-1">Início</legend>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Dia" name="startDay" type="date" value={form.startDay} onChange={handleChange} />
              <Field label="Hora" name="startClock" type="time" value={form.startClock} onChange={handleChange} />
            </div>
            {(fieldErrors.start || fieldErrors.startDateTime) && (
              <p className="text-xs text-danger">{fieldErrors.start || fieldErrors.startDateTime}</p>
            )}
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium mb-1">Fim</legend>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Dia" name="endDay" type="date" value={form.endDay} onChange={handleChange} />
              <Field label="Hora" name="endClock" type="time" value={form.endClock} onChange={handleChange} />
            </div>
            {(fieldErrors.end || fieldErrors.endDateTime) && (
              <p className="text-xs text-danger">{fieldErrors.end || fieldErrors.endDateTime}</p>
            )}
          </fieldset>
        </div>
      ) : (
        <>
          <fieldset>
            <legend className="block text-sm font-medium mb-2">Dias da semana</legend>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS_FROM_MONDAY.map((day) => {
                const checked = form.daysOfWeek.includes(day.value);
                return (
                  <label
                    key={day.value}
                    title={day.long}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-sm ${
                      checked ? 'border-pine-600 bg-pine-50' : 'border-ink/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-pine-600"
                      checked={checked}
                      onChange={() => toggleDay(day.value)}
                    />
                    {day.short}
                  </label>
                );
              })}
            </div>
            {fieldErrors.daysOfWeek && <p className="text-xs mt-1 text-danger">{fieldErrors.daysOfWeek}</p>}
          </fieldset>
          <div className="grid gap-4 grid-cols-2">
            <Field
              label="Das"
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
              error={fieldErrors.startTime}
            />
            <Field
              label="Até"
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={handleChange}
              error={fieldErrors.endTime}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Vale a partir de (opcional)"
              name="validFrom"
              type="date"
              value={form.validFrom}
              onChange={handleChange}
              error={fieldErrors.validFrom}
              hint={clearHint}
            />
            <Field
              label="Vale até (opcional)"
              name="validUntil"
              type="date"
              value={form.validUntil}
              onChange={handleChange}
              error={fieldErrors.validUntil}
              hint={clearHint}
            />
          </div>
        </>
      )}

      <Field
        label="Motivo (opcional)"
        name="reason"
        value={form.reason}
        onChange={handleChange}
        maxLength={200}
        placeholder={single ? 'Ex.: congresso, férias' : 'Ex.: almoço'}
        error={fieldErrors.reason}
        hint={clearHint}
      />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={submitting}>
          {isEdit ? 'Salvar alterações' : 'Criar bloqueio'}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default BlockForm;
