import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';

import Hour from '~components/hour';

export function HourPage(): React.ReactElement {
  const { dateTime: timestamp } = useParams();

  const dateTime = DateTime.fromISO(timestamp).startOf('hour');
  const dateTimeISO = dateTime.toISO();

  const history = useHistory();

  // If timestamp from the path is not a hour start, redirect to the time of hour start.
  useEffect(() => {
    if (dateTimeISO !== timestamp) {
      history.push(`/hour/${dateTimeISO}`);
    }
  });

  const previousDateTime = dateTime.minus({ hours: 1 });
  const nextDateTime = dateTime.plus({ hours: 1 });

  const weekStartDateTime = dateTime.startOf('week');
  const weekStartDateISO = weekStartDateTime.toISODate();

  const dayStartDateTime = dateTime.startOf('day');
  const dayStartDateISO = dayStartDateTime.toISODate();

  return (
    <div className="page">
      <main className="page__content">
        <ul className="page__breadcrumbs">
          <li className="page__breadcrumb">
            <Link to={`/week/${weekStartDateISO}`}>Week of {weekStartDateTime.toFormat('DDD')}</Link>
          </li>

          <li className="page__breadcrumb">
            <Link to={`/day/${dayStartDateISO}`}>{dayStartDateTime.toFormat('DDD')}</Link>
          </li>
        </ul>

        <div className="page__header">
          <Link className="page__header-button button" to={`/hour/${previousDateTime.toISO()}`}>⮜</Link>
          <h1>{dateTime.toFormat('DDD T')}</h1>
          <Link className="page__header-button button" to={`/hour/${nextDateTime.toISO()}`}>⮞</Link>
        </div>

        <Hour dateTime={timestamp} />
      </main>
    </div>
  );
}

export default HourPage;
