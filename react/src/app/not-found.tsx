import Link from 'next/link';

import ko from '@/core/i18n/locales/ko.json';

export default function NotFoundPage() {
  return (
    <section className="route-error">
      <p>{ko.champion.notFoundPage}</p>
      <Link className="primary-button route-error__link" href="/champions">
        {ko.champion.backToList}
      </Link>
    </section>
  );
}
