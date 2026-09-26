import { BLOCK_TYPE, describeBlock, isBlockEnded } from '../../utils/blocks';
import Badge from '../ui/Badge';

// `scope` (admin): a quem o bloqueio se aplica ("Clínica inteira" ou o nome do profissional).
const BlockCard = ({ block, scope, actions }) => {
  const { title, period } = describeBlock(block);
  const ended = isBlockEnded(block);

  return (
    <article className={`rounded-xl border border-ink/10 bg-surface px-5 py-4 ${block.active ? '' : 'opacity-70'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge tone={block.type === BLOCK_TYPE.RECURRING ? 'ochre' : 'neutral'}>
              {block.type === BLOCK_TYPE.RECURRING ? 'Recorrente' : 'Único'}
            </Badge>
            {scope && <Badge tone="pine">{scope}</Badge>}
            {ended && <Badge>Encerrado</Badge>}
          </div>
          <h3 className="text-lg first-letter:uppercase">{title}</h3>
          {period && <p className="text-sm text-ink/60">{period}</p>}
          <p className="text-sm text-ink/70 mt-0.5">{block.reason || <span className="text-ink/40">Sem motivo</span>}</p>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </article>
  );
};

export default BlockCard;
