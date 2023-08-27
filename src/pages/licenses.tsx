import licenses from '../../public/licenses.json';
import { NpmLicense } from '@/models/license';

const additionalLicenses: NpmLicense[] = [
  {
    licenseType: 'Reshot Stock Icon Free License. ',
    name: 'Reshot',
    link: 'https://www.reshot.com/free-svg-icons/item/mountain-range-J4CZG3UE97/',
    author: 'M0DE0N ',
  },
];

export default function Licenses() {
  return (
    <>
      <h1 className="text-5xl">Licenses</h1>
      <ul className="list-disc">
        {[...additionalLicenses, ...licenses].map((l: NpmLicense, i) => (
          <li key={i} className="list-none">
            <a
              href={l.link.replace('git+', '').replace('ssh://', '')}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-surface-1 block rounded-md transition-colors ease-in p-2"
              aria-label={`Open GitHub repo for ${l.name}`}
            >
              <div>
                <span className="text-2xl">{l.name}</span>
                <span className="text-text-unimportant">{l.installedVersion}</span>
              </div>

              <div className="text-text-unimportant">{[l.licenseType, l.author].filter(Boolean).join(', ')}</div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
