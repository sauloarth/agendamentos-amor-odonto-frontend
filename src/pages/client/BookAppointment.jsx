import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createAppointment } from '../../api/appointments';
import { getApiError } from '../../api/errors';
import { useToast } from '../../context/ToastContext';
import { clinicDayKey } from '../../utils/dates';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import StepIndicator from '../../components/booking/StepIndicator';
import ProductStep from '../../components/booking/ProductStep';
import ProfessionalStep from '../../components/booking/ProfessionalStep';
import SlotStep from '../../components/booking/SlotStep';
import AppointmentSummary from '../../components/booking/AppointmentSummary';

const STEPS = ['Procedimento', 'Profissional', 'Dia e horário', 'Confirmação'];
const [PRODUCT, PROFESSIONAL, SLOT, CONFIRM] = [0, 1, 2, 3];

const STEP_TITLES = {
  [PRODUCT]: 'Qual procedimento você precisa?',
  [PROFESSIONAL]: 'Com quem você quer ser atendido?',
  [SLOT]: 'Escolha o dia e o horário',
  [CONFIRM]: 'Confira e confirme',
};

const initialState = () => ({
  step: PRODUCT,
  product: null,
  professional: null,
  slot: null,
  weekStart: clinicDayKey(),
});

const BookAppointment = () => {
  const toast = useToast();
  const [state, setState] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);
  const { step, product, professional, slot, weekStart } = state;

  const update = (changes) => setState((current) => ({ ...current, ...changes }));

  // Trocar uma escolha anterior invalida as seguintes.
  const selectProduct = (next) => {
    const only = next.professionals.length === 1 ? next.professionals[0] : null;
    update({
      product: next,
      professional: only,
      slot: null,
      weekStart: clinicDayKey(),
      step: only ? SLOT : PROFESSIONAL,
    });
  };

  const selectProfessional = (next) =>
    update({ professional: next, slot: null, weekStart: clinicDayKey(), step: SLOT });

  const confirm = async () => {
    setSubmitting(true);
    try {
      const appointment = await createAppointment({
        productId: product._id,
        professionalId: professional._id,
        startDateTime: slot.startDateTime,
      });
      setCreated(appointment);
      toast.success('Consulta agendada!');
    } catch (err) {
      const apiError = getApiError(err, 'Não foi possível agendar. Tente novamente.');
      if (apiError.status === 409) {
        toast.error('Esse horário acabou de ser ocupado. Escolha outro.');
        // Voltar remonta a etapa de horários, que busca a disponibilidade de novo.
        update({ slot: null, step: SLOT });
      } else {
        toast.error(apiError.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setCreated(null);
    setState(initialState());
  };

  if (created) {
    return (
      <div className="max-w-xl">
        <PageHeader title="Consulta agendada" subtitle="Tudo certo. Até lá!" />
        <AppointmentSummary
          product={product}
          professional={professional}
          startDateTime={created.startDateTime}
          endDateTime={created.endDateTime}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/consultas"
            className="inline-flex items-center rounded-lg bg-pine-600 px-4 py-2.5 font-medium text-canvas hover:bg-pine-700"
          >
            Ver minhas consultas
          </Link>
          <Button variant="secondary" onClick={restart}>
            Agendar outra
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Agendar consulta" subtitle={STEP_TITLES[step]} />
      <StepIndicator steps={STEPS} current={step} onSelect={(index) => update({ step: index })} />

      {step === PRODUCT && <ProductStep selectedId={product?._id} onSelect={selectProduct} />}

      {step === PROFESSIONAL && (
        <ProfessionalStep
          professionals={product.professionals}
          selectedId={professional?._id}
          onSelect={selectProfessional}
        />
      )}

      {step === SLOT && (
        <SlotStep
          productId={product._id}
          professionalId={professional._id}
          weekStart={weekStart}
          onWeekChange={(day) => update({ weekStart: day })}
          selectedStart={slot?.startDateTime}
          onSelect={(next) => update({ slot: next, step: CONFIRM })}
        />
      )}

      {step === CONFIRM && (
        <div className="max-w-xl">
          <AppointmentSummary
            product={product}
            professional={professional}
            startDateTime={slot.startDateTime}
            endDateTime={slot.endDateTime}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={confirm} loading={submitting}>
              Confirmar agendamento
            </Button>
            <Button variant="ghost" onClick={() => update({ step: SLOT })} disabled={submitting}>
              Trocar horário
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookAppointment;
