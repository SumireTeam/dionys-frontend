import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';

import Week from '~components/week';

export function WeekPage(): React.ReactElement {
  const { date } = useParams();
  const history = useHistory();

  function onRowClick(event: React.MouseEvent, dateTimeISO: string): void {
    const date = DateTime.fromISO(dateTimeISO).toISODate();

    history.push(`/day/${date}`);
  }

  const dateTime = DateTime.fromISO(date);
  const dateISO = dateTime.toISODate();
  const weekStartDateTime = dateTime.startOf('week');

  // If date from the path is not a week start, redirect to the date of week start.
  useEffect(() => {
    const weekStartDateISO = weekStartDateTime.toISODate();
    if (dateISO !== weekStartDateISO) {
      history.push(`/week/${weekStartDateISO}`);
    }
  });

  const previousWeekDateTime = weekStartDateTime.minus({ weeks: 1 });
  const nextWeekDateTime = weekStartDateTime.plus({ weeks: 1 });

  return (
    <div className="page">
      <main className="page__content">
        <div className="page__header">
          <Link className="page__header-button button" to={`/week/${previousWeekDateTime.toISODate()}`}>⮜</Link>
          <h1>Week of {weekStartDateTime.toFormat('DDD')}</h1>
          <Link className="page__header-button button" to={`/week/${nextWeekDateTime.toISODate()}`}>⮞</Link>
        </div>

        <Week date={date} onRowClick={onRowClick} />
      </main>
    </div>
  );
}

export default WeekPage;
