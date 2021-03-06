import React from 'react';

import { formatPercentage, formatNumber } from 'common/format';
import { calculateAzeriteEffects } from 'common/stats';
import SPELLS from 'common/SPELLS';
import UptimeIcon from 'interface/icons/Uptime';
import MasteryIcon from 'interface/icons/Mastery';
import AzeritePowerStatistic from 'interface/statistics/AzeritePowerStatistic';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import Analyzer from 'parser/core/Analyzer';

/**
 Casting Wild Growth grants you 165 Mastery for 10 sec sec. This cannot occur more than once every 30 sec.
 Example Log: /report/nfVcdAMXFGBgwvzp/2-Heroic+Taloc+-+Kill+(3:55)/21-Palamx
 */
class SynergisticGrowth extends Analyzer {
  masteryBuff = 0;
  procs = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.SYNERGISTIC_GROWTH.id);
    if (this.active) {
      this.masteryBuff = this.selectedCombatant.traitsBySpellId[SPELLS.SYNERGISTIC_GROWTH.id]
        .reduce((sum, rank) => sum + calculateAzeriteEffects(SPELLS.SYNERGISTIC_GROWTH.id, rank)[0], 0);
    }
  }

  get totalBuffUptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.SYNERGISTIC_GROWTH_BUFF.id) / this.owner.fightDuration;
  }

  get totalBuffProcs() {
    return this.selectedCombatant.getBuffTriggerCount(SPELLS.SYNERGISTIC_GROWTH_BUFF.id);
  }

  get averageStatGain() {
    const averageStacks = this.selectedCombatant.getStackWeightedBuffUptime(SPELLS.SYNERGISTIC_GROWTH_BUFF.id) / this.owner.fightDuration;
    return averageStacks * this.masteryBuff;
  }

  statistic() {
    return (
      <AzeritePowerStatistic size="medium">
        <BoringSpellValueText
          spell={SPELLS.SYNERGISTIC_GROWTH}
        >
          <UptimeIcon /> {formatPercentage(this.totalBuffUptime, 0)}% <small>uptime</small><br />
          <MasteryIcon /> {formatNumber(this.averageStatGain)} <small>average Mastery gained</small>
        </BoringSpellValueText>
      </AzeritePowerStatistic>
    );
  }
}

export default SynergisticGrowth;
