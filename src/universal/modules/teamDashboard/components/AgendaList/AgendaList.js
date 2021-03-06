import React, {PropTypes} from 'react';
import withStyles from 'universal/styles/withStyles';
import {css} from 'aphrodite-local-styles/no-important';
import {overflowTouch} from 'universal/styles/helpers';
import {cashay} from 'cashay';
import AgendaItem from 'universal/modules/teamDashboard/components/AgendaItem/AgendaItem';
import {AGENDA_ITEM, phaseArray} from 'universal/utils/constants';
import handleAgendaHover from 'universal/dnd/handleAgendaHover';
import {DropTarget as dropTarget} from 'react-dnd';
import withDragState from 'universal/dnd/withDragState';
import handleDrop from 'universal/dnd/handleDrop';

const columnTarget = {
  drop: handleDrop,
  hover: handleAgendaHover
};

const removeItemFactory = (itemId) => () => {
  const options = {variables: {id: itemId}};
  cashay.mutate('removeAgendaItem', options);
};

const AgendaList = (props) => {
  const {
    agenda,
    agendaPhaseItem,
    connectDropTarget,
    context,
    disabled,
    dragState,
    facilitatorPhase,
    facilitatorPhaseItem,
    gotoAgendaItem,
    localPhase,
    localPhaseItem,
    styles
  } = props;

  const canNavigate = context === 'meeting' && !disabled;
  dragState.clear();
  return connectDropTarget(
    <div className={css(styles.root)}>
      <div className={css(styles.inner)}>
        {agenda.map((item, idx) =>
          <AgendaItem
            key={`agendaItem${item.id}`}
            agendaItem={item}
            agendaPhaseItem={agendaPhaseItem}
            canNavigate={canNavigate}
            disabled={disabled}
            facilitatorPhase={facilitatorPhase}
            facilitatorPhaseItem={facilitatorPhaseItem}
            gotoAgendaItem={gotoAgendaItem && gotoAgendaItem(idx)}
            handleRemove={removeItemFactory(item.id)}
            idx={idx}
            localPhase={localPhase}
            localPhaseItem={localPhaseItem}
            ref={(c) => {
              if (c) {
                dragState.components.push(c);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

AgendaList.propTypes = {
  agenda: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string
  })),
  agendaPhaseItem: PropTypes.number,
  connectDropTarget: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  facilitatorPhase: PropTypes.oneOf(phaseArray),
  facilitatorPhaseItem: PropTypes.number,
  gotoAgendaItem: PropTypes.func,
  localPhase: PropTypes.oneOf(phaseArray),
  localPhaseItem: PropTypes.number,
  router: PropTypes.object,
  styles: PropTypes.object,
  teamId: PropTypes.string.isRequired
};

const styleThunk = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'relative',
    width: '100%'
  },

  inner: {
    ...overflowTouch,
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: '100%'
  }
});

const dropTargetCb = (connectTarget) => ({
  connectDropTarget: connectTarget.dropTarget()
});
export default withDragState(
  dropTarget(AGENDA_ITEM, columnTarget, dropTargetCb)(
    withStyles(styleThunk)(AgendaList)
  )
);
