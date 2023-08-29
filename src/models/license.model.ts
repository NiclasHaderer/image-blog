export interface NpmLicense {
  name: string;
  author: string;
  licenseType: string;
  link: string;

  department?: string;
  relatedTo?: string;
  licensePeriod?: string;
  material?: string;
  remoteVersion?: string;
  installedVersion?: string;
  definedVersion?: string;
}
