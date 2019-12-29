import { DateTime } from 'luxon';
import React, { useState, useEffect } from 'react';

import { ConsumedProduct, getTotals } from '~models';
import { getConsumedProducts } from '~services/api';
import { isInRange } from '~utils';

export interface DayProps {
  readonly date: string;

  readonly onRowClick?: (event: React.MouseEvent, dateTimeISO: string) => void;
}

export function Day(props: DayProps): React.ReactElement {
  const startDateTime = DateTime.fromISO(props.date).startOf('day');
  const endDateTime = startDateTime.plus({ days: 1 });

  const startDateISO = startDateTime.toISODate();
  const endDateISO = endDateTime.toISODate();

  // TODO: request consumed products only for a day.
  const [consumed, setConsumed] = useState<ConsumedProduct[]>([]);
  useEffect(() => {
    async function fetchData(): Promise<void> {
      const response = await getConsumedProducts();
      const dayConsumed = response.items.filter(consumed => isInRange(startDateISO, endDateISO, consumed.timestamp));

      setConsumed(dayConsumed);
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
  for (let dateTime = startDateTime; dateTime < endDateTime; dateTime = dateTime.plus({ hours: 1 })) {
    const classNames = ['table__row', 'table__row--button'];
    const dateTimeISO = dateTime.toISO();
    const hourConsumed = consumed.filter(consumed => isInRange(dateTime, dateTime.plus({ hours: 1 }), consumed.timestamp));
    const hourTotals = getTotals(hourConsumed);
    if (hourTotals.calories === 0) {
      classNames.push('table__row--inactive');
    }

    const row = (
      <tr className={classNames.join(' ')} key={dateTimeISO} onClick={(event): void => onRowClick(event, dateTimeISO)}>
        <th className="table__cell" scope="row">
          <time dateTime={dateTimeISO}>{dateTime.toFormat('HH:mm')}</time>
        </th>

        <td className="table__cell">{(hourTotals.weight * 1000).toFixed()} g</td>
        <td className="table__cell">{hourTotals.protein.toFixed()} g</td>
        <td className="table__cell">{hourTotals.fat.toFixed()} g</td>
        <td className="table__cell">{hourTotals.carbohydrates.toFixed()} g</td>
        <td className="table__cell">{hourTotals.calories.toFixed()} kcal</td>
      </tr>
    );

    rows.push(row);
  }

  const dayTotals = getTotals(consumed);

  return (
    <table className="table">
      <thead>
        <tr className="table__row">
          <th className="table__cell">Time</th>
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
          <th className="table__cell" scope="row">Total</th>
          <td className="table__cell">{dayTotals.weight.toFixed(2)} kg</td>
          <td className="table__cell">{dayTotals.protein.toFixed()} g</td>
          <td className="table__cell">{dayTotals.fat.toFixed()} g</td>
          <td className="table__cell">{dayTotals.carbohydrates.toFixed()} g</td>
          <td className="table__cell">{dayTotals.calories.toFixed()} kcal</td>
        </tr>
      </tfoot>
    </table>
  );
}

export default Day;
