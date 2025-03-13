/**
 * Radio related models.
 * - RadioSearchOrder: Enum for radio search order
 * - RadioListParams: Parameters for radio list
 * - RadioServerEntry: Radio api server entry
 * - RadioServerEntryList: List of radio api server entries
 * - RadioEntryResponse: Radio entry in backend's domain
 * - RadioEntryListResponse: List of radio entries in backend's domain
 * - RadioLocation: Location of radio station
 * - RadioEntry: Radio station entry in frontend's domain
 * - RadioStatResponse: Radio stat in backend's domain
 * - RadioStat: Radio stat in frontend's domain
 * - SemanticVersion: Semantic version
 * - ServerStatus: Enum for server status
 */
export enum RadioSearchOrder {
    Name = 'name',
    Url = 'url',
    Homepage = 'homepage',
    Favicon = 'favicon',
    Tags = 'tags',
    Country = 'country',
    State = 'state',
    Language = 'language',
    Votes = 'votes',
    Codec = 'codec',
    Bitrate = 'bitrate',
    LastCheckOk = 'lastcheckok',
    LastCheckTime = 'lastchecktime',
    ClickTimestamp = 'clicktimestamp',
    ClickCount = 'clickcount',
    ClickTrend = 'clicktrend',
    ChangeTimestamp = 'changetimestamp',
    Random = 'random'
}

export interface RadioListParams {
    order?: RadioSearchOrder;
    reverse?: boolean;
    limit?: number;
    offset?: number;
    hidebroken?: boolean;
}

export interface RadioServerEntry {
    ip: string;
    name: string;
}

export type RadioServerEntryList = RadioServerEntry[];

export interface RadioEntryResponse {
    changeuuid: string
    stationuuid: string
    serveruuid: string
    name: string
    url: string
    url_resolved: string
    homepage: string
    favicon: string
    tags: string
    country: string
    countrycode: string
    iso_3166_2: string
    state: string
    language: string
    languagecodes: string
    votes: number
    lastchangetime: string
    lastchangetime_iso8601: string
    codec: string
    bitrate: number
    hls: number
    lastcheckok: number
    lastchecktime: string
    lastchecktime_iso8601: string
    lastcheckoktime: string
    lastcheckoktime_iso8601: string
    lastlocalchecktime: string
    lastlocalchecktime_iso8601: string
    clicktimestamp: string
    clicktimestamp_iso8601: string
    clickcount: number
    clicktrend: number
    ssl_error: number
    geo_lat: number
    geo_long: number
    geo_distance: any
    has_extended_info: boolean
}

export type RadioEntryListResponse = RadioEntryResponse[];

export interface RadioLocation {
    lat: number;
    lng: number;
    country: string;
    locale: Intl.Locale | null;
    state: string;
    flagUrl: URL | null;
}

export interface RadioEntry {
    id: string;
    name: string;
    url: URL | null;
    urlResolved: URL | null;
    homepageUrl: URL | null;
    faviconUrl: URL | null;
    tags: string[];
    language: string;
    codec: string;
    bitrate: number;
    location: RadioLocation;
}

export interface RadioStatResponse {
    supported_version: number
    software_version: string
    status: string
    stations: number
    stations_broken: number
    tags: number
    clicks_last_hour: number
    clicks_last_day: number
    languages: number
    countries: number
}

export interface SemanticVersion {
    major: number;
    minor: number;
    patch: number;
}

export enum ServerStatus {
    Ok = 'ok',
}

export interface RadioStat {
    supportedVersion: number;
    softwareVersion: SemanticVersion;
    status: string;
    stationCount: number;
    stationBrokenCount: number;
    tagCount: number;
    clicksLastHour: number;
    clicksLastDay: number;
    languageCount: number;
    countryCount: number;
}