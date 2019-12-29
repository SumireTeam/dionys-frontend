import { DateTime } from 'luxon';
import React from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';

import Day from '~components/day';

export function DayPage(): React.ReactElement {
  const { date } = useParams();
  const history = useHistory();

  function onRowClick(event: React.MouseEvent, dateTimeISO: string): void {
    const dateTime = DateTime.fromISO(dateTimeISO).toISO();

    history.push(`/hour/${dateTime}`);
  }

  const dateTime = DateTime.fromISO(date).startOf('day');

  const previousDateTime = dateTime.minus({ days: 1 });
  const nextDateTime = dateTime.plus({ days: 1 });

  const weekStartDateTime = dateTime.startOf('week');
  const weekStartDateISO = weekStartDateTime.toISODate();

  return (
    <div className="page">
      <main className="page__content">
        <ul className="page__breadcrumbs">
          <li className="page__breadcrumb">
            <Link to={`/week/${weekStartDateISO}`}>Week of {weekStartDateTime.toFormat('DDD')}</Link>
          </li>
        </ul>

        <div className="page__header">
          <Link className="page__header-button button" to={`/day/${previousDateTime.toISODate()}`}>⮜</Link>
          <h1>{dateTime.toFormat('DDD')}</h1>
          <Link className="page__header-button button" to={`/day/${nextDateTime.toISODate()}`}>⮞</Link>
        </div>

        <Day date={date} onRowClick={onRowClick} />
      </main>
    </div>
  );
}

export default DayPage;
