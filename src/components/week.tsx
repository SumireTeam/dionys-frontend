import { DateTime } from 'luxon';
import React, { useState, useEffect } from 'react';

import { ConsumedProduct, getTotals } from '~models';
import { getConsumedProducts } from '~services/api';
import { isInRange } from '~utils';

export interface WeekProps {
  readonly date: string;

  readonly onRowClick?: (event: React.MouseEvent, dateTimeISO: string) => void;
}

export function Week(props: WeekProps): React.ReactElement {
  const startDateTime = DateTime.fromISO(props.date).startOf('week');
  const endDateTime = startDateTime.plus({ days: 7 });

  const startDateISO = startDateTime.toISODate();
  const endDateISO = endDateTime.toISODate();

  // TODO: request consumed products only for a week.
  const [consumed, setConsumed] = useState<ConsumedProduct[]>([]);
  useEffect(() => {
    async function fetchData(): Promise<void> {
      const response = await getConsumedProducts();
      const weekConsumed = response.items.filter(consumed => isInRange(startDateISO, endDateISO, consumed.timestamp));

      setConsumed(weekConsumed);
    }

    fetchData();
  }, [startDateISO, endDateISO]);

  function onRowClick(event: React.MouseEvent, dateTimeISO: string): void {
    const { onRowClick } = props;
    if (onRowClick) {
      onRowClick(event, dateTimeISO);
    }
  }

  const rows = [];
  for (let dateTime = startDateTime; dateTime < endDateTime; dateTime = dateTime.plus({ days: 1 })) {
    const classNames = ['table__row', 'table__row--button'];
    const dateTimeISO = dateTime.toISO();
    const dayConsumed = consumed.filter(consumed => isInRange(dateTime, dateTime.plus({ days: 1 }), consumed.timestamp));
    const dayTotals = getTotals(dayConsumed);
    if (dayTotals.calories === 0) {
      classNames.push('table__row--inactive');
    }

    const row = (
      <tr className={classNames.join(' ')} key={dateTimeISO} onClick={(event): void => onRowClick(event, dateTimeISO)}>
        <th scope="row">
          <time dateTime={dateTimeISO}>{dateTime.toFormat('dd MMM')}</time>
        </th>

        <td>{dayTotals.weight.toFixed(2)} kg</td>
        <td>{dayTotals.protein.toFixed()} g</td>
        <td>{dayTotals.fat.toFixed()} g</td>
        <td>{dayTotals.carbohydrates.toFixed()} g</td>
        <td>{dayTotals.calories.toFixed()} kcal</td>
      </tr>
    );

    rows.push(row);
  }

  const weekTotals = getTotals(consumed);

  return (
    <table className="table">
      <thead>
        <tr className="table__row">
          <th className="table__cell">Date</th>
          <th className="table__cell">Weight</th>
          <th className="table__cell">Protein</th>
          <th className="table__cell">Fat</th>
          <th className="table__cell">Carbs</th>
          <th className="table__cell">Calories</th>
        </tr>
      </thead>

      <tbody>
        {rows}
      </tbody>

      <tfoot>
        <tr className="table__row">
          <th className="table__cell" scope="row">Average Daily</th>
          <td className="table__cell">{(weekTotals.weight / 7).toFixed(2)} kg</td>
          <td className="table__cell">{(weekTotals.protein / 7).toFixed()} g</td>
          <td className="table__cell">{(weekTotals.fat / 7).toFixed()} g</td>
          <td className="table__cell">{(weekTotals.carbohydrates / 7).toFixed()} g</td>
          <td className="table__cell">{(weekTotals.calories / 7).toFixed()} kcal</td>
        </tr>

        <tr className="table__row">
          <th className="table__cell" scope="row">Total</th>
          <td className="table__cell">{weekTotals.weight.toFixed(2)} kg</td>
          <td className="table__cell">{weekTotals.protein.toFixed()} g</td>
          <td className="table__cell">{weekTotals.fat.toFixed()} g</td>
          <td className="table__cell">{weekTotals.carbohydrates.toFixed()} g</td>
          <td className="table__cell">{weekTotals.calories.toFixed()} kcal</td>
        </tr>
      </tfoot>
    </table>
  );
}

export default Week;
