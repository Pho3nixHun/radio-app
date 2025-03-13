import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  RadioEntry,
  RadioEntryListResponse,
  RadioEntryResponse,
  RadioListParams,
  RadioSearchOrder,
  RadioServerEntryList,
  RadioStat,
  RadioStatResponse,
  SemanticVersion,
  ServerStatus
} from '@app/shared/models/radio.model';
import { isIpv4, toEnum, toUrl } from '@utils';
import { filter, map, shareReplay, switchMap } from 'rxjs';

const mapRadioEntryResponse = (entry: RadioEntryResponse): RadioEntry => ({
  id: entry.stationuuid,
  name: entry.name,
  url: toUrl(entry.url, null),
  urlResolved: toUrl(entry.url_resolved, null),
  homepageUrl: toUrl(entry.homepage, null),
  faviconUrl: toUrl(entry.favicon, null),
  tags: entry.tags.split(','),
  language: entry.language,
  codec: entry.codec,
  bitrate: entry.bitrate,
  location: {
    lat: entry.geo_lat,
    lng: entry.geo_long,
    country: entry.country,
    locale: entry.countrycode ? new Intl.Locale(entry.countrycode) : null,
    state: entry.state,
    flagUrl: entry.countrycode ? new URL(`https://flagsapi.com/${entry.countrycode}/flat/64.png`) : null,
  }
});

const toSemanticVersion = (version: string): SemanticVersion => {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
};

const mapRadioStatResponse = (response: RadioStatResponse): RadioStat => ({
  supportedVersion: response.supported_version,
  softwareVersion: toSemanticVersion(response.software_version),
  status: toEnum(response.status, ServerStatus, ServerStatus.Ok),
  stationCount: response.stations,
  stationBrokenCount: response.stations_broken,
  tagCount: response.tags,
  clicksLastHour: response.clicks_last_hour,
  clicksLastDay: response.clicks_last_day,
  languageCount: response.languages,
  countryCount: response.countries
});

const toUrlSearchParams = (params: RadioListParams | undefined, fallback: Required<RadioListParams>): URLSearchParams => {
  const searchParams = new URLSearchParams();
  searchParams.set('order', params?.order ?? fallback.order);
  searchParams.set('reverse', params?.reverse?.toString() ?? fallback.reverse.toString());
  searchParams.set('limit', params?.limit?.toString() ?? fallback.limit.toString());
  searchParams.set('offset', params?.offset?.toString() ?? fallback.offset.toString());
  searchParams.set('hidebroken', params?.hidebroken?.toString() ?? fallback.hidebroken.toString());
  return searchParams;
};

@Injectable({
  providedIn: 'root',
})
export class RadioService {
  static readonly RADIO_LIST_URL = `http://all.api.radio-browser.info/json/servers`;
  static readonly RADIO_INFO_ENDPOINT = `/json/config`;
  static readonly RADIO_LIST_ALL_ENDPOINT = `/json/stations`;
  static readonly RADIO_STATS_ENDPOINT = `/json/stats`;
  private readonly httpClient = inject(HttpClient);
  public readonly radioServerList$ = this.httpClient
    .get<RadioServerEntryList>(RadioService.RADIO_LIST_URL)
    .pipe(
      map((list) => list.filter((entry) => isIpv4(entry.ip))),
      shareReplay(1)
    );
  public randomRadioServer$ = this.radioServerList$.pipe(
    map((list) => list.at(Math.floor(Math.random() * list.length))),
    filter(Boolean),
    shareReplay(1)
  );
  public radioConfig$ = this.randomRadioServer$.pipe(
    switchMap((radioServer) => this.httpClient.get(`http://${radioServer.name}${RadioService.RADIO_INFO_ENDPOINT}`))
  )
  public radioStats$ = this.randomRadioServer$.pipe(
    switchMap((radioServer) => this.httpClient.get<RadioStatResponse>(`http://${radioServer.name}${RadioService.RADIO_STATS_ENDPOINT}`)),
    map(mapRadioStatResponse),
    shareReplay(1)
  )
  public getRadioList$(params?: RadioListParams) {
    const searchParams = toUrlSearchParams(params, {
      order: RadioSearchOrder.Name,
      reverse: false,
      limit: 25,
      offset: 0,
      hidebroken: true
    });
    return this.randomRadioServer$.pipe(
      switchMap(
        (radioServer) => this.httpClient.get<RadioEntryListResponse>(
          `http://${radioServer.ip}${RadioService.RADIO_LIST_ALL_ENDPOINT}?${searchParams.toString()}`
        )
      ),
      map((list) => list.map(mapRadioEntryResponse)),
      shareReplay(1)
    )
  }
}
