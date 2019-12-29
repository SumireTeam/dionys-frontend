import WeekPage from '~pages/week';
import DayPage from '~pages/day';
import HourPage from '~pages/hour';

export const routes = [
  { path: '/week/:date', component: WeekPage },
  { path: '/day/:date', component: DayPage },
  { path: '/hour/:dateTime', component: HourPage },
];

export default routes;
