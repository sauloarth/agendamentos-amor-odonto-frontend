import { useId, useState } from 'react';
import { cancelAppointment } from '../../api/appointments';
import { getApiError } from '../../api/errors';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Field from '../form/Field';

const MAX_REASON_LENGTH = 300;

// Cancelamento em duas etapas dentro do cartão: abrir o formulário e confirmar.
// `onCancelled` recebe a consulta atualizada devolvida pela API.
const CancelAppointmentForm = ({ appointmentId, onCancelled }) => {
  const toast = useToast();
  const reasonId = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return (
      <Button variant="ghost" className="text-danger hover:text-danger" onClick={() => setOpen(true)}>
        Cancelar consulta
      </Button>
    );
  }

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const updated = await cancelAppointment(appointmentId, reason);
      toast.success('Consulta cancelada.');
      onCancelled(updated);
    } catch (err) {
      toast.error(getApiError(err, 'Não foi possível cancelar. Tente novamente.').message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-danger/20 bg-danger/5 p-4">
      <Field
        as="textarea"
        label="Motivo (opcional)"
        name="cancelReason"
        id={reasonId}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        maxLength={MAX_REASON_LENGTH}
        rows={3}
      />
      <div className="mt-3 flex flex-wrap gap-3">
        <Button type="submit" variant="danger" loading={submitting}>
          Confirmar cancelamento
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
          Voltar
        </Button>
      </div>
    </form>
  );
};

export default CancelAppointmentForm;
